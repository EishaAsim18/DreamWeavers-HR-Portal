import type { WebSocket, WebSocketServer } from 'ws'
import { RELAYABLE_TYPES, type InboundMessage } from './types.js'

interface ConnectedClient {
  userId: string
  socket: WebSocket
}

/** userId -> connected socket. A user is "online" iff present here. */
const clients = new Map<string, ConnectedClient>()

function safeSend(socket: WebSocket, payload: unknown): void {
  if (socket.readyState === socket.OPEN) {
    socket.send(JSON.stringify(payload))
  }
}

function sendToUser(userId: string, payload: unknown): boolean {
  const client = clients.get(userId)
  if (!client) return false
  safeSend(client.socket, payload)
  return true
}

function broadcastPresence(): void {
  const onlineUserIds = Array.from(clients.keys())
  const payload = { type: 'presence:list', onlineUserIds }
  for (const client of clients.values()) safeSend(client.socket, payload)
}

function parseMessage(raw: unknown): InboundMessage | null {
  try {
    const text = typeof raw === 'string' ? raw : (raw as { toString(): string })?.toString()
    const parsed = JSON.parse(text ?? '')
    if (parsed && typeof parsed.type === 'string') return parsed as InboundMessage
  } catch {
    // ignore malformed frames
  }
  return null
}

export function registerSignaling(wss: WebSocketServer): void {
  wss.on('connection', (socket: WebSocket) => {
    let userId: string | null = null

    socket.on('message', (raw) => {
      const msg = parseMessage(raw)
      if (!msg) return

      if (msg.type === 'register') {
        if (!msg.userId) return
        // A new tab/session for the same user replaces the old socket — only
        // one "device" per user is tracked at a time.
        const existing = clients.get(msg.userId)
        if (existing && existing.socket !== socket) {
          safeSend(existing.socket, { type: 'session:replaced' })
          existing.socket.close()
        }
        userId = msg.userId
        clients.set(userId, { userId, socket })
        safeSend(socket, { type: 'presence:list', onlineUserIds: Array.from(clients.keys()) })
        broadcastPresence()
        return
      }

      if (!userId) return // must register before anything else is relayed

      if (RELAYABLE_TYPES.has(msg.type) && 'toUserId' in msg && msg.toUserId) {
        const delivered = sendToUser(msg.toUserId, { ...msg, fromUserId: userId })
        if (!delivered && msg.type === 'call:invite') {
          sendToUser(userId, { type: 'call:unavailable', toUserId: msg.toUserId, callId: msg.callId })
        }
      }
    })

    socket.on('close', () => {
      if (userId && clients.get(userId)?.socket === socket) {
        clients.delete(userId)
        broadcastPresence()
      }
    })

    socket.on('error', () => {
      socket.close()
    })
  })
}
