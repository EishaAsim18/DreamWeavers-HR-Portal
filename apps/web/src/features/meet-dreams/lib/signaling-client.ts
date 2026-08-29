/**
 * Thin WebSocket client for the Meet Dreams call-signaling server
 * (`apps/realtime`). A single module-level connection is shared app-wide —
 * `CallProvider` opens it once per authenticated session.
 */

export interface SignalingMessage {
  type: string
  [key: string]: unknown
}

type Listener = (msg: SignalingMessage) => void

const RECONNECT_DELAY_MS = 2000

class SignalingClient {
  private socket: WebSocket | null = null
  private userId: string | null = null
  private listeners = new Set<Listener>()
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private manuallyClosed = true

  connect(userId: string): void {
    if (this.userId === userId && this.socket?.readyState === WebSocket.OPEN) return
    this.userId = userId
    this.manuallyClosed = false
    this.open()
  }

  disconnect(): void {
    this.manuallyClosed = true
    this.userId = null
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.socket?.close()
    this.socket = null
  }

  send(payload: Record<string, unknown>): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload))
    }
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private open(): void {
    if (!this.userId || typeof window === 'undefined') return

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const url = `${protocol}://${window.location.host}/ws`

    let socket: WebSocket
    try {
      socket = new WebSocket(url)
    } catch {
      this.scheduleReconnect()
      return
    }
    this.socket = socket

    socket.onopen = () => {
      this.send({ type: 'register', userId: this.userId })
    }

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as SignalingMessage
        this.listeners.forEach((listener) => listener(msg))
      } catch {
        // ignore malformed frames
      }
    }

    socket.onclose = () => {
      if (!this.manuallyClosed) this.scheduleReconnect()
    }

    socket.onerror = () => {
      socket.close()
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer || this.manuallyClosed) return
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      if (!this.manuallyClosed) this.open()
    }, RECONNECT_DELAY_MS)
  }
}

export const signalingClient = new SignalingClient()
