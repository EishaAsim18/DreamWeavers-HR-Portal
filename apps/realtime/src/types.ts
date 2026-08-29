/**
 * Signaling protocol shared shape (kept in sync by hand with
 * `apps/web/src/features/meet-dreams/lib/signaling-client.ts` — there is no
 * shared package yet, so this file is the source of truth for the server
 * side of the contract).
 *
 * The server is a dumb relay: it never inspects SDP/ICE payloads, it just
 * forwards them to the intended recipient by userId and tracks who is online.
 */

export type CallKind = 'video' | 'audio'

export interface RegisterMessage {
  type: 'register'
  userId: string
}

export interface RelayableMessage {
  type:
    | 'call:invite'
    | 'call:accept'
    | 'call:decline'
    | 'call:cancel'
    | 'call:hangup'
    | 'webrtc:offer'
    | 'webrtc:answer'
    | 'webrtc:ice-candidate'
  toUserId: string
  callId: string
  conversationId?: string
  kind?: CallKind
  sdp?: unknown
  candidate?: unknown
  [key: string]: unknown
}

export type InboundMessage = RegisterMessage | RelayableMessage

export const RELAYABLE_TYPES: ReadonlySet<string> = new Set([
  'call:invite',
  'call:accept',
  'call:decline',
  'call:cancel',
  'call:hangup',
  'webrtc:offer',
  'webrtc:answer',
  'webrtc:ice-candidate',
])
