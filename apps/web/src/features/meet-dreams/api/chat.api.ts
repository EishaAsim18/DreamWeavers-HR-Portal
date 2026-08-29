/**
 * Meet Dreams (chat) API client.
 *
 * A thin typed wrapper around the mock backend handlers.
 * When a real backend is ready, swap these implementations for real
 * fetch()/websocket calls — the rest of the application stays unchanged.
 */

import { useAuth } from '@/shared/hooks/use-auth'
import {
  mockFetchConversations,
  mockSendMessage,
  mockCreateChannel,
  mockStartDirectConversation,
} from '@/shared/api/mock/chat.mock'
import type { ChannelFormData } from '../types/chat.types'
import type { User } from '@/shared/types'

export const chatApi = {
  fetchConversations: (user: User) => mockFetchConversations(user),
  sendMessage: (user: User, conversationId: string, content: string) =>
    mockSendMessage(user, conversationId, content),
  createChannel: (user: User, data: ChannelFormData) => mockCreateChannel(user, data),
  startDirectConversation: (user: User, otherUserId: string) =>
    mockStartDirectConversation(user, otherUserId),
} as const

/** Returns API methods pre-bound to the currently authenticated user. */
export function useChatApi() {
  const { user } = useAuth()

  if (!user) throw new Error('useChatApi must be used when authenticated')

  return {
    fetchConversations: () => chatApi.fetchConversations(user),
    sendMessage: (conversationId: string, content: string) =>
      chatApi.sendMessage(user, conversationId, content),
    createChannel: (data: ChannelFormData) => chatApi.createChannel(user, data),
    startDirectConversation: (otherUserId: string) =>
      chatApi.startDirectConversation(user, otherUserId),
  }
}
