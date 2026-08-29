// ── Core types ────────────────────────────────────────────────────────────────

export type ConversationKind = 'channel' | 'dm'

export interface ChatMessage {
  id: string
  conversationId: string
  authorId: string
  content: string
  createdAt: string
}

interface BaseConversation {
  id: string
  kind: ConversationKind
  memberIds: string[]
  createdAt: string
}

export interface ChannelConversation extends BaseConversation {
  kind: 'channel'
  name: string
  description: string
  createdById: string
}

export interface DirectConversation extends BaseConversation {
  kind: 'dm'
}

export type Conversation = ChannelConversation | DirectConversation

/** A conversation bundled with its full message history — the mock dataset is
 * small enough that shipping messages alongside the conversation avoids a
 * second round trip per thread. */
export type ConversationSummary = Conversation & { messages: ChatMessage[] }

export interface ChannelFormData {
  name: string
  description: string
  memberIds: string[]
}

export function isChannel(c: Conversation): c is ChannelConversation {
  return c.kind === 'channel'
}
