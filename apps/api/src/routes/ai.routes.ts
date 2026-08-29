import { Router } from 'express'
import { z } from 'zod'
import { config } from '../config.js'
import { AppError, authenticate } from '../middleware/auth.js'

const requestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().trim().min(1).max(8_000),
  })).min(1).max(20),
})

const SYSTEM_PROMPT = `You are DreamWeavers AI, the intelligent HR assistant for the DreamWeavers HRMS platform.
Help employees, admins, and HR managers with HR policies, leave rules, attendance, drafting messages, task management, onboarding, and workplace questions.
Be concise, warm, and professional. Use bullet points for lists. Keep responses focused and actionable.`

export const aiRouter = Router()
aiRouter.use(authenticate)

aiRouter.post('/chat', async (req, res, next) => {
  try {
    if (!config.groqApiKey) {
      throw new AppError('AI service is not configured.', 503, 'AI_UNAVAILABLE')
    }

    const body = requestSchema.parse(req.body)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.groqApiKey}`,
      },
      body: JSON.stringify({
        model: config.aiModel,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...body.messages],
        temperature: 0.7,
        max_tokens: 1024,
        stream: false,
      }),
      signal: AbortSignal.timeout(20_000),
    })

    if (!response.ok) {
      throw new AppError('AI service is temporarily unavailable.', 502, 'AI_UPSTREAM_ERROR')
    }
    const data = await response.json() as {
      choices?: Array<{ message?: { content?: string } }>
    }
    const content = data.choices?.[0]?.message?.content?.trim()
    if (!content) {
      throw new AppError('AI service returned an empty response.', 502, 'AI_EMPTY_RESPONSE')
    }
    res.json({ content })
  } catch (error) {
    next(error)
  }
})
