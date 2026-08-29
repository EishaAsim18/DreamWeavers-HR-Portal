/**
 * Meet Dreams (chat) Mock Backend
 *
 * Simulates a real REST/websocket API for team messaging — channels + DMs.
 * – localStorage persistence so conversations survive page refreshes
 * – Realistic network delays via sleep()
 * – Membership-gated reads/writes (you can only see/post in conversations
 *   you belong to)
 */

import { STORAGE_KEYS } from '@/shared/constants'
import { sleep } from '@/shared/lib/utils'
import { AuthorizationError } from '@/shared/types'
import type { User } from '@/shared/types'
import { getPerson } from '@/features/calendar/data/calendar.mock'
import { MOCK_CONVERSATIONS, MOCK_CHAT_MESSAGES } from '@/features/meet-dreams/data/meet-dreams.mock'
import type {
  ChannelFormData,
  ChatMessage,
  Conversation,
  ConversationSummary,
} from '@/features/meet-dreams/types/chat.types'
import { requireAuth } from './authorization'

// ── Persistence ───────────────────────────────────────────────────────────────

interface ChatData {
  conversations: Conversation[]
  messages: ChatMessage[]
}

function loadChatData(): ChatData {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.meetDreams)
    if (raw) return JSON.parse(raw) as ChatData
  } catch {
    // ignore corrupt data
  }
  return { conversations: [...MOCK_CONVERSATIONS], messages: [...MOCK_CHAT_MESSAGES] }
}

function saveChatData(data: ChatData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.meetDreams, JSON.stringify(data))
  } catch {
    // ignore quota errors
  }
}

let _data: ChatData = loadChatData()

function toSummary(conversation: Conversation): ConversationSummary {
  const messages = _data.messages
    .filter((m) => m.conversationId === conversation.id)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  return { ...conversation, messages }
}

function assertMember(user: User, conversation: Conversation): void {
  if (!conversation.memberIds.includes(user.id)) {
    throw new AuthorizationError("You're not a member of this conversation.")
  }
}

// ── Handlers ──────────────────────────────────────────────────────────────────

/** Fetch every conversation (channel or DM) the user belongs to, with messages. */
export async function mockFetchConversations(user: User | null): Promise<ConversationSummary[]> {
  await sleep(350)
  requireAuth(user)
  _data = loadChatData()
  return _data.conversations
    .filter((c) => c.memberIds.includes(user.id))
    .map(toSummary)
}

/** Post a message to a conversation. Requires membership. */
export async function mockSendMessage(
  user: User | null,
  conversationId: string,
  content: string,
): Promise<ChatMessage> {
  await sleep(250)
  requireAuth(user)

  const conversation = _data.conversations.find((c) => c.id === conversationId)
  if (!conversation) throw new AuthorizationError('Conversation not found.')
  assertMember(user, conversation)

  const trimmed = content.trim()
  if (!trimmed) throw new AuthorizationError('Message cannot be empty.')

  const message: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    conversationId,
    authorId: user.id,
    content: trimmed,
    createdAt: new Date().toISOString(),
  }

  _data = { ..._data, messages: [..._data.messages, message] }
  saveChatData(_data)
  return message
}

/** Create a new channel. The creator is always included as a member. */
export async function mockCreateChannel(
  user: User | null,
  data: ChannelFormData,
): Promise<ConversationSummary> {
  await sleep(400)
  requireAuth(user)

  const name = data.name.trim().toLowerCase().replace(/\s+/g, '-')
  if (!name) throw new AuthorizationError('A channel name is required.')
  if (_data.conversations.some((c) => c.kind === 'channel' && c.name === name)) {
    throw new AuthorizationError(`#${name} already exists.`)
  }

  const memberIds = Array.from(new Set([user.id, ...data.memberIds]))

  const channel: Conversation = {
    id: `chan_${Date.now()}`,
    kind: 'channel',
    name,
    description: data.description.trim(),
    memberIds,
    createdById: user.id,
    createdAt: new Date().toISOString(),
  }

  _data = { ..._data, conversations: [...(_data.conversations), channel] }
  saveChatData(_data)
  return toSummary(channel)
}

/** Find or start a direct conversation with another employee. */
export async function mockStartDirectConversation(
  user: User | null,
  otherUserId: string,
): Promise<ConversationSummary> {
  await sleep(300)
  requireAuth(user)

  if (otherUserId === user.id) {
    throw new AuthorizationError("You can't start a DM with yourself.")
  }
  if (!getPerson(otherUserId)) {
    throw new AuthorizationError('That person could not be found.')
  }

  const existing = _data.conversations.find(
    (c) => c.kind === 'dm' && c.memberIds.includes(user.id) && c.memberIds.includes(otherUserId),
  )
  if (existing) return toSummary(existing)

  const dm: Conversation = {
    id: `dm_${Date.now()}`,
    kind: 'dm',
    memberIds: [user.id, otherUserId],
    createdAt: new Date().toISOString(),
  }

  _data = { ..._data, conversations: [..._data.conversations, dm] }
  saveChatData(_data)
  return toSummary(dm)
}

/** Reset all chat data to initial mock data. */
export function mockResetChatData(): void {
  _data = { conversations: [...MOCK_CONVERSATIONS], messages: [...MOCK_CHAT_MESSAGES] }
  saveChatData(_data)
}
