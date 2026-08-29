import { Send, Sparkles, Square, Trash2, X, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useAiAssistant } from '@/shared/hooks'
import { Button } from '@/shared/components/ui/button'
import { ScrollArea } from '@/shared/components/ui/scroll-area'
import {
  Drawer,
  DrawerClose,
  DrawerSheetContent,
  DrawerTitle,
} from '@/shared/components/ui/drawer'
import { DrawerContent } from '@/shared/components/ui/drawer'
import { useIsMobile } from '@/shared/hooks'
import { formatRelativeTime } from '@/shared/lib/utils'
import { ANIMATION } from '@/shared/constants'

const SUGGESTED_PROMPTS = [
  "What's our leave policy?",
  'Help me write a performance review',
  'How do I request time off?',
  'Summarize best practices for onboarding',
  'Draft a team announcement',
  "What are today's HR priorities?",
]

/** Very simple markdown-to-JSX: bold, inline code, bullet lists */
function SimpleMarkdown({ text }: { text: string }) {
  if (!text) return null

  const lines = text.split('\n')
  const elements: React.ReactNode[] = []

  lines.forEach((line, li) => {
    if (line.startsWith('• ') || line.startsWith('- ') || line.match(/^\d+\. /)) {
      elements.push(
        <li key={li} className="ml-4 list-disc leading-relaxed">
          <InlineMarkdown text={line.replace(/^[•-]\s|^\d+\.\s/, '')} />
        </li>,
      )
    } else if (line.startsWith('### ')) {
      elements.push(
        <p key={li} className="mt-2 font-bold text-[var(--dw-color-ink-primary)]">
          <InlineMarkdown text={line.slice(4)} />
        </p>,
      )
    } else if (line.startsWith('## ')) {
      elements.push(
        <p key={li} className="mt-2 font-bold text-[var(--dw-color-ink-primary)]">
          <InlineMarkdown text={line.slice(3)} />
        </p>,
      )
    } else if (line === '') {
      elements.push(<div key={li} className="h-1.5" />)
    } else {
      elements.push(
        <p key={li} className="leading-relaxed">
          <InlineMarkdown text={line} />
        </p>,
      )
    }
  })

  return <>{elements}</>
}

function InlineMarkdown({ text }: { text: string }) {
  // Handle **bold** and `code`
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="rounded bg-[var(--dw-color-surface-sunken)] px-1 py-0.5 font-mono text-[11px]">
              {part.slice(1, -1)}
            </code>
          )
        }
        return part
      })}
    </>
  )
}

function TypingCursor() {
  return (
    <motion.span
      className="ml-0.5 inline-block h-[1em] w-[2px] rounded-full bg-[var(--dw-color-brand-primary)] align-middle"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.8, repeat: Infinity }}
    />
  )
}

function AiPanelContent() {
  const { messages, input, setInput, isTyping, sendMessage, stopGeneration, clearMessages } =
    useAiAssistant()
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom on new tokens
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return
    void sendMessage(input)
    if (textareaRef.current) textareaRef.current.style.height = '44px'
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#4a7c92] to-[#7ab5cc]">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="size-3.5 text-white" />
            </motion.div>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--dw-color-ink-primary)]">DreamWeavers AI</p>
            <div className="flex items-center gap-1">
              <Zap className="size-2.5 text-amber-500" />
              <span className="text-[10px] font-medium text-[var(--dw-color-ink-tertiary)]">Powered by Grok</span>
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={clearMessages}
            title="Clear conversation"
            aria-label="Clear conversation"
          >
            <Trash2 className="size-3.5 text-[var(--dw-color-ink-tertiary)]" />
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="space-y-4 px-4 py-4">

          {/* Empty state with suggestions */}
          {messages.length === 0 && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-xl border border-[var(--dw-color-border-default)] bg-gradient-to-br from-[var(--dw-color-brand-primary-subtle)] to-[var(--dw-color-surface-base)] p-4">
                <p className="text-sm font-medium text-[var(--dw-color-ink-primary)]">
                  Hi! I'm your DreamWeavers HR assistant. 👋
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--dw-color-ink-secondary)]">
                  Ask me anything about HR policies, leave requests, performance reviews, or how to use the platform.
                </p>
              </div>
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--dw-color-ink-tertiary)]">
                  Suggested
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_PROMPTS.map((prompt, i) => (
                    <motion.button
                      key={prompt}
                      type="button"
                      className="rounded-full border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] px-3 py-1.5 text-[11px] font-medium text-[var(--dw-color-ink-secondary)] shadow-[var(--dw-shadow-xs)] transition-all hover:border-[var(--dw-color-brand-primary)]/40 hover:bg-[var(--dw-color-brand-primary-muted)] hover:text-[var(--dw-color-brand-primary)]"
                      onClick={() => void sendMessage(prompt)}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.05 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Message thread */}
          <AnimatePresence initial={false}>
            {messages.map((message, idx) => {
              const isLast = idx === messages.length - 1
              const isStreaming = isTyping && isLast && message.role === 'assistant'

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: ANIMATION.normal }}
                  className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                >
                  {message.role === 'assistant' && (
                    <div className="mr-2 mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4a7c92] to-[#7ab5cc]">
                      <Sparkles className="size-2.5 text-white" />
                    </div>
                  )}
                  <div
                    className={
                      message.role === 'user'
                        ? 'max-w-[82%] rounded-2xl rounded-br-md bg-[var(--dw-color-brand-primary)] px-3.5 py-2.5 text-sm text-white shadow-[var(--dw-shadow-brand)]'
                        : 'max-w-[92%] rounded-2xl rounded-bl-md border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] px-3.5 py-2.5 text-sm text-[var(--dw-color-ink-primary)] shadow-[var(--dw-shadow-xs)]'
                    }
                  >
                    {message.role === 'assistant' ? (
                      <div className="space-y-0.5">
                        {message.content ? (
                          <SimpleMarkdown text={message.content} />
                        ) : (
                          <span className="text-[var(--dw-color-ink-tertiary)]">Thinking…</span>
                        )}
                        {isStreaming && <TypingCursor />}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                    <p className="mt-1.5 text-[10px] opacity-60">
                      {formatRelativeTime(message.createdAt)}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] p-3">
        <form className="flex items-end gap-2" onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            placeholder="Ask anything about HR…"
            rows={1}
            className="max-h-[120px] min-h-[44px] flex-1 resize-none rounded-xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[var(--dw-color-brand-primary)] focus:bg-[var(--dw-color-surface-base)] focus:ring-2 focus:ring-[var(--dw-color-brand-primary)]/20"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            disabled={isTyping}
          />
          {isTyping ? (
            <Button
              type="button"
              size="icon"
              variant="danger"
              onClick={stopGeneration}
              title="Stop generation"
              aria-label="Stop generation"
            >
              <Square className="size-3.5" fill="currentColor" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim()}
              aria-label="Send message"
            >
              <Send className="size-4" />
            </Button>
          )}
        </form>
        <p className="mt-1.5 text-center text-[9px] text-[var(--dw-color-ink-tertiary)]">
          AI can make mistakes — verify important HR information.
        </p>
      </div>
    </div>
  )
}

export function AiAssistantDrawer() {
  const { isOpen, close } = useAiAssistant()
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && close()}>
        <DrawerContent className="h-[90vh] p-0">
          <DrawerTitle className="sr-only">DreamWeavers AI</DrawerTitle>
          <AiPanelContent />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && close()} direction="right">
      <DrawerSheetContent className="drawer-glass w-[var(--dw-panel-width)] max-w-[var(--dw-panel-width)] p-0">
        <DrawerTitle className="sr-only">DreamWeavers AI</DrawerTitle>
        <AiPanelContent />
        <DrawerClose className="absolute right-4 top-4 rounded-md opacity-70 hover:opacity-100">
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DrawerClose>
      </DrawerSheetContent>
    </Drawer>
  )
}
