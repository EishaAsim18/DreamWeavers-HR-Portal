import { MOCK_SEARCH_RESULTS } from '@/shared/data/mock'
import { sleep } from '@/shared/lib/utils'
import type { SearchResult } from '@/shared/types'

export async function mockGlobalSearch(query: string): Promise<SearchResult[]> {
  await sleep(300)
  if (!query.trim()) return []

  const q = query.toLowerCase()
  return MOCK_SEARCH_RESULTS.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.subtitle?.toLowerCase().includes(q) ||
      r.meta?.toLowerCase().includes(q),
  )
}

export async function mockAiResponse(prompt: string): Promise<string> {
  await sleep(800)
  return `I'm the DreamWeavers AI assistant (mock). You asked: "${prompt}". Full Gemini integration will connect in a later phase.`
}
