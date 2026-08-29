import { useState, useCallback, useMemo, useEffect } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/shared/hooks/use-auth'
import { getPerson } from '@/features/calendar/data/calendar.mock'
import type { ChannelFormData, ConversationSummary } from '../types/chat.types'
import { isChannel } from '../types/chat.types'
import { useChatApi } from '../api/chat.api'
import { useLastRead } from './use-last-read'

function conversationLabel(c: ConversationSummary, currentUserId?: string): string {
  if (isChannel(c)) return c.name
  const otherId = c.memberIds.find((id) => id !== currentUserId)
  return otherId ? getPerson(otherId)?.name ?? 'Unknown' : 'Unknown'
}

export function useChatStore() {
  const { user } = useAuth()
  const api = useChatApi()
  const { markRead, lastReadAt } = useLastRead()

  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)

  const [activeId, setActiveId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false)
  const [isStartDmOpen, setIsStartDmOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const fetched = await api.fetchConversations()
        if (!mounted) return
        setConversations(fetched)
        if (!activeId && fetched.length > 0) {
          const sorted = [...fetched].sort((a, b) => {
            const aTime = a.messages.at(-1)?.createdAt ?? a.createdAt
            const bTime = b.messages.at(-1)?.createdAt ?? b.createdAt
            return new Date(bTime).getTime() - new Date(aTime).getTime()
          })
          setActiveId(sorted[0].id)
        }
      } catch (e) {
        if (!mounted) return
        const msg = e instanceof Error ? e.message : 'Failed to load conversations'
        setError(msg)
        toast.error(msg)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    void load()
    return () => { mounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const aTime = a.messages.at(-1)?.createdAt ?? a.createdAt
      const bTime = b.messages.at(-1)?.createdAt ?? b.createdAt
      return new Date(bTime).getTime() - new Date(aTime).getTime()
    })
  }, [conversations])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return sortedConversations
    return sortedConversations.filter((c) => conversationLabel(c, user?.id).toLowerCase().includes(q))
  }, [sortedConversations, search, user?.id])

  const channels = useMemo(() => filtered.filter(isChannel), [filtered])
  const directMessages = useMemo(() => filtered.filter((c) => !isChannel(c)), [filtered])

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId],
  )

  const isUnread = useCallback(
    (c: ConversationSummary) => {
      const last = c.messages.at(-1)
      if (!last || last.authorId === user?.id) return false
      const readAt = lastReadAt(c.id)
      return !readAt || new Date(last.createdAt) > new Date(readAt)
    },
    [user?.id, lastReadAt],
  )

  const totalUnread = useMemo(() => conversations.filter(isUnread).length, [conversations, isUnread])

  // ── Handlers ──────────────────────────────────────────────────────────────
  const selectConversation = useCallback(
    (id: string) => {
      setActiveId(id)
      markRead(id)
    },
    [markRead],
  )

  const sendMessage = useCallback(
    async (content: string) => {
      if (!activeId || !content.trim()) return
      setIsSending(true)
      try {
        const message = await api.sendMessage(activeId, content)
        setConversations((prev) =>
          prev.map((c) => (c.id === activeId ? { ...c, messages: [...c.messages, message] } : c)),
        )
        markRead(activeId)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to send message')
      } finally {
        setIsSending(false)
      }
    },
    [activeId, api, markRead],
  )

  const createChannel = useCallback(
    async (data: ChannelFormData) => {
      try {
        const created = await api.createChannel(data)
        setConversations((prev) => [...prev, created])
        setActiveId(created.id)
        markRead(created.id)
        setIsCreateChannelOpen(false)
        toast.success(`✅ #${isChannel(created) ? created.name : created.id} created`)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to create channel')
      }
    },
    [api, markRead],
  )

  const startDirectConversation = useCallback(
    async (otherUserId: string) => {
      try {
        const conversation = await api.startDirectConversation(otherUserId)
        setConversations((prev) =>
          prev.some((c) => c.id === conversation.id)
            ? prev.map((c) => (c.id === conversation.id ? conversation : c))
            : [...prev, conversation],
        )
        setActiveId(conversation.id)
        markRead(conversation.id)
        setIsStartDmOpen(false)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to start conversation')
      }
    },
    [api, markRead],
  )

  return {
    // Server state
    conversations,
    isLoading,
    error,
    isSending,
    // UI state
    search,
    setSearch,
    activeId,
    activeConversation,
    isCreateChannelOpen,
    setIsCreateChannelOpen,
    isStartDmOpen,
    setIsStartDmOpen,
    // Computed
    channels,
    directMessages,
    isUnread,
    totalUnread,
    conversationLabel: (c: ConversationSummary) => conversationLabel(c, user?.id),
    // Handlers
    selectConversation,
    sendMessage,
    createChannel,
    startDirectConversation,
  }
}
