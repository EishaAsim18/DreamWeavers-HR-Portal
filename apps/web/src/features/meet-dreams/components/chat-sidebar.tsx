import { motion } from 'framer-motion'
import { Hash, Search, Plus, MessageSquarePlus, X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { getPerson } from '@/features/calendar/data/calendar.mock'
import { isChannel, type ConversationSummary } from '../types/chat.types'
import { formatConversationTime } from '../lib/format-time'
import { useCall } from '../contexts/call-context'

interface ChatSidebarProps {
  search: string
  onSearchChange: (v: string) => void
  channels: ConversationSummary[]
  directMessages: ConversationSummary[]
  activeId: string | null
  currentUserId?: string
  onSelect: (id: string) => void
  isUnread: (c: ConversationSummary) => boolean
  conversationLabel: (c: ConversationSummary) => string
  onNewChannel: () => void
  onNewDm: () => void
}

function Row({
  isActive,
  isUnread,
  icon,
  label,
  preview,
  time,
  onClick,
}: {
  isActive: boolean
  isUnread: boolean
  icon: React.ReactNode
  label: string
  preview: string
  time: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors',
        isActive ? 'bg-[var(--dw-color-brand-primary-muted)]' : 'hover:bg-[var(--dw-color-surface-sunken)]',
      )}
    >
      {icon}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className={cn('truncate text-[13px]', isUnread ? 'font-bold text-[var(--dw-color-ink-primary)]' : 'font-medium text-[var(--dw-color-ink-secondary)]')}>
            {label}
          </p>
          <span className="shrink-0 text-[10px] text-[var(--dw-color-ink-tertiary)]">{time}</span>
        </div>
        <p className={cn('truncate text-[11px]', isUnread ? 'font-semibold text-[var(--dw-color-ink-secondary)]' : 'text-[var(--dw-color-ink-tertiary)]')}>
          {preview}
        </p>
      </div>
      {isUnread && <span className="size-2 shrink-0 rounded-full bg-[var(--dw-color-brand-primary)]" />}
    </button>
  )
}

export function ChatSidebar({
  search,
  onSearchChange,
  channels,
  directMessages,
  activeId,
  currentUserId,
  onSelect,
  isUnread,
  conversationLabel,
  onNewChannel,
  onNewDm,
}: ChatSidebarProps) {
  const { onlineUserIds } = useCall()
  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden">
      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[var(--dw-color-ink-tertiary)]" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search chats…"
          className="w-full rounded-xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] py-1.5 pl-8 pr-7 text-xs text-[var(--dw-color-ink-primary)] placeholder:text-[var(--dw-color-ink-tertiary)] transition-colors focus:border-[#4a7c92] focus:outline-none focus:ring-2 focus:ring-[#4a7c92]/10"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center rounded-full text-[var(--dw-color-ink-tertiary)] hover:text-red-500"
          >
            <X className="size-3" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-0.5">
        {/* Channels */}
        <div className="mb-1 flex items-center justify-between px-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dw-color-ink-tertiary)]">
            Channels
          </span>
          <button
            onClick={onNewChannel}
            title="New channel"
            className="flex size-5 items-center justify-center rounded-md text-[var(--dw-color-ink-tertiary)] hover:bg-[var(--dw-color-surface-sunken)] hover:text-[#4a7c92]"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
        <div className="mb-3 flex flex-col gap-0.5">
          {channels.map((c) => {
            const last = c.messages.at(-1)
            return (
              <Row
                key={c.id}
                isActive={activeId === c.id}
                isUnread={isUnread(c)}
                icon={<Hash className="size-4 shrink-0 text-[var(--dw-color-ink-tertiary)]" />}
                label={conversationLabel(c)}
                preview={last ? last.content : isChannel(c) ? c.description : ''}
                time={last ? formatConversationTime(last.createdAt) : ''}
                onClick={() => onSelect(c.id)}
              />
            )
          })}
          {channels.length === 0 && (
            <p className="px-2 py-1 text-[11px] text-[var(--dw-color-ink-tertiary)]">No channels found.</p>
          )}
        </div>

        {/* Direct messages */}
        <div className="mb-1 flex items-center justify-between px-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dw-color-ink-tertiary)]">
            Direct Messages
          </span>
          <button
            onClick={onNewDm}
            title="New direct message"
            className="flex size-5 items-center justify-center rounded-md text-[var(--dw-color-ink-tertiary)] hover:bg-[var(--dw-color-surface-sunken)] hover:text-[#4a7c92]"
          >
            <MessageSquarePlus className="size-3.5" />
          </button>
        </div>
        <div className="flex flex-col gap-0.5">
          {directMessages.map((c) => {
            const otherId = c.memberIds.find((id) => id !== currentUserId)
            const person = otherId ? getPerson(otherId) : undefined
            const last = c.messages.at(-1)
            return (
              <Row
                key={c.id}
                isActive={activeId === c.id}
                isUnread={isUnread(c)}
                icon={
                  person ? (
                    <span
                      className="relative flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ background: person.avatarColor }}
                    >
                      {person.initials}
                      {otherId && onlineUserIds.has(otherId) && (
                        <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full border-2 border-[var(--dw-color-surface-base)] bg-emerald-500" />
                      )}
                    </span>
                  ) : (
                    <span className="size-6 shrink-0 rounded-full bg-[var(--dw-color-surface-sunken)]" />
                  )
                }
                label={conversationLabel(c)}
                preview={last ? last.content : 'Say hi 👋'}
                time={last ? formatConversationTime(last.createdAt) : ''}
                onClick={() => onSelect(c.id)}
              />
            )
          })}
          {directMessages.length === 0 && (
            <p className="px-2 py-1 text-[11px] text-[var(--dw-color-ink-tertiary)]">No direct messages found.</p>
          )}
        </div>
      </div>

      <motion.button
        onClick={onNewDm}
        className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-[var(--dw-color-border-default)] py-2 text-xs font-semibold text-[var(--dw-color-ink-secondary)] transition-colors hover:border-[#4a7c92]/40 hover:text-[#4a7c92]"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <MessageSquarePlus className="size-3.5" />
        New Message
      </motion.button>
    </div>
  )
}
