import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { ArrowLeft, Hash, Phone, Video, Send, Users } from 'lucide-react'
import { getPerson } from '@/features/calendar/data/calendar.mock'
import { isChannel, type ConversationSummary } from '../types/chat.types'
import { MessageBubble } from './message-bubble'
import { formatDayDivider } from '../lib/format-time'
import { useCall, type CallKind } from '../contexts/call-context'

interface ChatThreadProps {
  conversation: ConversationSummary | null
  currentUserId?: string
  label: string
  isSending: boolean
  onSend: (content: string) => void
  onBack?: () => void
}

function DayDivider({ label }: { label: string }) {
  return (
    <div className="my-3 flex items-center gap-3">
      <div className="h-px flex-1 bg-[var(--dw-color-border-default)]" />
      <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--dw-color-ink-tertiary)]">
        {label}
      </span>
      <div className="h-px flex-1 bg-[var(--dw-color-border-default)]" />
    </div>
  )
}

export function ChatThread({ conversation, currentUserId, label, isSending, onSend, onBack }: ChatThreadProps) {
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const call = useCall()

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [conversation?.messages.length, conversation?.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.trim()) return
    onSend(draft)
    setDraft('')
  }

  if (!conversation) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-3 text-center">
        <span className="flex size-16 items-center justify-center rounded-3xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] text-3xl">
          💬
        </span>
        <div>
          <p className="text-sm font-bold text-[var(--dw-color-ink-secondary)]">Pick a conversation</p>
          <p className="text-xs text-[var(--dw-color-ink-tertiary)]">Choose a channel or DM to start chatting.</p>
        </div>
      </div>
    )
  }

  const otherUserId = !isChannel(conversation)
    ? conversation.memberIds.find((id) => id !== currentUserId)
    : undefined
  const otherPerson = otherUserId ? getPerson(otherUserId) : undefined

  const handleStartCall = (kind: CallKind) => {
    if (!otherUserId) {
      toast.info('Group calls are coming soon — try a direct message for now.')
      return
    }
    if (call.phase !== 'idle') {
      toast.info('You are already on a call.')
      return
    }
    void call.startCall(conversation.id, otherUserId, kind)
  }

  let lastDay = ''

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--dw-color-border-default)] px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {onBack && (
            <button
              onClick={onBack}
              className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] hover:bg-[var(--dw-color-surface-sunken)]"
            >
              <ArrowLeft className="size-4" />
            </button>
          )}
          {isChannel(conversation) ? (
            <Hash className="size-4 shrink-0 text-[var(--dw-color-ink-tertiary)]" />
          ) : otherPerson ? (
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ background: otherPerson.avatarColor }}
            >
              {otherPerson.initials}
            </span>
          ) : null}
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[var(--dw-color-ink-primary)]">{label}</p>
            <p className="truncate text-[11px] text-[var(--dw-color-ink-tertiary)]">
              {isChannel(conversation) ? (
                <span className="flex items-center gap-1">
                  <Users className="size-3" /> {conversation.memberIds.length} members · {conversation.description}
                </span>
              ) : (
                otherPerson?.jobTitle
              )}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => handleStartCall('audio')}
            title="Voice call"
            className="flex size-8 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] hover:bg-[var(--dw-color-surface-sunken)] hover:text-[#4a7c92]"
          >
            <Phone className="size-4" />
          </button>
          <button
            onClick={() => handleStartCall('video')}
            title="Video call"
            className="flex size-8 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] hover:bg-[var(--dw-color-surface-sunken)] hover:text-[#4a7c92]"
          >
            <Video className="size-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
        {conversation.messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm font-semibold text-[var(--dw-color-ink-secondary)]">No messages yet</p>
            <p className="text-xs text-[var(--dw-color-ink-tertiary)]">Say hello 👋</p>
          </div>
        )}
        <div className="flex flex-col gap-2.5">
          {conversation.messages.map((m, i) => {
            const day = formatDayDivider(m.createdAt)
            const showDivider = day !== lastDay
            lastDay = day
            const prev = conversation.messages[i - 1]
            const showAuthor = !prev || prev.authorId !== m.authorId || showDivider
            return (
              <div key={m.id}>
                {showDivider && <DayDivider label={day} />}
                <MessageBubble message={m} isOwn={m.authorId === currentUserId} showAuthor={showAuthor} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Composer */}
      <form onSubmit={handleSubmit} className="flex shrink-0 items-center gap-2 border-t border-[var(--dw-color-border-default)] px-3 py-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={isChannel(conversation) ? `Message #${conversation.name}…` : `Message ${label}…`}
          className="flex-1 rounded-xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] px-3.5 py-2.5 text-sm text-[var(--dw-color-ink-primary)] placeholder:text-[var(--dw-color-ink-tertiary)] transition-colors focus:border-[#4a7c92] focus:outline-none focus:ring-2 focus:ring-[#4a7c92]/10"
        />
        <motion.button
          type="submit"
          disabled={!draft.trim() || isSending}
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4a7c92] to-[#3d6779] text-white shadow-[var(--dw-shadow-brand)] disabled:opacity-40"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Send className="size-4" />
        </motion.button>
      </form>
    </div>
  )
}
