import { motion } from 'framer-motion'
import { cn } from '@/shared/lib/utils'
import { getPerson } from '@/features/calendar/data/calendar.mock'
import type { ChatMessage } from '../types/chat.types'
import { formatMessageTime } from '../lib/format-time'

interface MessageBubbleProps {
  message: ChatMessage
  isOwn: boolean
  showAuthor: boolean
}

export function MessageBubble({ message, isOwn, showAuthor }: MessageBubbleProps) {
  const author = getPerson(message.authorId)

  return (
    <motion.div
      className={cn('flex items-end gap-2', isOwn ? 'flex-row-reverse' : 'flex-row')}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-7 shrink-0">
        {showAuthor && author && (
          <span
            className="flex size-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ background: author.avatarColor }}
            title={author.name}
          >
            {author.initials}
          </span>
        )}
      </div>

      <div className={cn('flex max-w-[75%] flex-col gap-0.5', isOwn ? 'items-end' : 'items-start')}>
        {showAuthor && (
          <span className="px-1 text-[10px] font-semibold text-[var(--dw-color-ink-tertiary)]">
            {isOwn ? 'You' : author?.name ?? 'Unknown'} · {formatMessageTime(message.createdAt)}
          </span>
        )}
        <div
          className={cn(
            'rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm',
            isOwn
              ? 'rounded-br-md bg-gradient-to-br from-[#4a7c92] to-[#3d6779] text-white'
              : 'rounded-bl-md border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] text-[var(--dw-color-ink-primary)]',
          )}
        >
          {message.content}
        </div>
      </div>
    </motion.div>
  )
}
