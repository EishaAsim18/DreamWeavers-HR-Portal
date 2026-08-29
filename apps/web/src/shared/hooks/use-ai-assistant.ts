import { useCallback, useRef, useState } from 'react'
import { useOverlay } from '@/shared/hooks/use-shell'
import { streamGrokCompletion, type GrokMessage } from '@/shared/lib/grok'
import type { AiMessage } from '@/shared/types'

export function useAiAssistant() {
  const { activePanel, openPanel, closePanel, togglePanel } = useOverlay()
  const [messages, setMessages] = useState<AiMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim()
    if (!trimmed) return

    // Cancel any in-flight request
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    const userMessage: AiMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    }

    // Add user message and a placeholder for the streaming assistant reply
    const assistantId = crypto.randomUUID()
    const assistantPlaceholder: AiMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage, assistantPlaceholder])
    setInput('')
    setIsTyping(true)

    try {
      // Build conversation history for Grok (last 20 messages for context)
      const history: GrokMessage[] = [...messages, userMessage]
        .slice(-20)
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

      await streamGrokCompletion(
        history,
        (token) => {
          // Append each streaming token to the assistant message in real-time
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + token } : m,
            ),
          )
        },
        abortRef.current.signal,
      )
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        const errorMsg = (err as Error).message ?? 'Unknown error'
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: `❌ Error: ${errorMsg}` }
              : m,
          ),
        )
      }
    } finally {
      setIsTyping(false)
    }
  }, [messages])

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort()
    setIsTyping(false)
  }, [])

  return {
    isOpen: activePanel === 'ai',
    open: () => openPanel('ai'),
    close: closePanel,
    toggle: () => togglePanel('ai'),
    messages,
    input,
    setInput,
    isTyping,
    sendMessage,
    stopGeneration,
    clearMessages: () => setMessages([]),
  }
}
