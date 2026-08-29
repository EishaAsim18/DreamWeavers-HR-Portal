import { apiClient } from '@/shared/api/client'

/** AI requests go through the authenticated API so provider credentials never ship to the browser. */

// ── Built-in fallback rule engine (used when no API key) ─────────────────────
function builtInResponse(prompt: string): string {
  const q = prompt.toLowerCase()
  if (q.includes('leave') || q.includes('time off') || q.includes('vacation')) {
    return 'Our leave policy allows **18 days of annual leave**, **10 sick days**, and **3 casual leaves** per year. Submit leave requests through the Attendance section at least 2 days in advance for approval.'
  }
  if (q.includes('attendance') || q.includes('clock') || q.includes('check in')) {
    return 'You can clock in/out from the **Attendance** page. Standard hours are 9AM–6PM. Late arrivals after 9:30AM are marked late. Contact your admin if you need to correct an attendance record.'
  }
  if (q.includes('task') || q.includes('todo') || q.includes('assign')) {
    return 'Tasks are managed in the **Tasks** section. You can create, assign, and track tasks by status (To Do → In Progress → Done). Your admin can assign tasks to team members.'
  }
  if (q.includes('salary') || q.includes('payroll') || q.includes('pay')) {
    return 'Payroll is processed on the **last working day** of each month. For payslips or salary queries, contact your HR admin through the Documents section.'
  }
  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return "Hello! I'm DreamWeavers AI. I can help you with HR policies, leave requests, attendance, tasks, and more. What would you like to know?"
  }
  if (q.includes('performance') || q.includes('review') || q.includes('appraisal')) {
    return 'Performance reviews are conducted **bi-annually** (June & December). Your manager will schedule a 1:1 review meeting. You can view past reviews in your employee profile.'
  }
  if (q.includes('onboard') || q.includes('new employee') || q.includes('joining')) {
    return 'New employee onboarding includes:\n- Profile setup in the portal\n- Team introduction meeting\n- Policy orientation (HR will share the handbook)\n- IT equipment & access setup\n- 30-day check-in with your manager'
  }
  return "I can help with HR policies, leave requests, attendance, tasks, performance reviews, and more. Could you rephrase or give me more details about what you need?"
}

export interface GrokMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/**
 * Send a message to AI and stream the response.
 * Falls back to built-in responses if the online AI service is unavailable.
 */
export async function streamGrokCompletion(
  messages: GrokMessage[],
  onToken: (token: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  try {
    const data = await apiClient.post<{ content: string }>('/ai/chat', {
      messages: messages
        .filter((message) => message.role !== 'system')
        .map(({ role, content }) => ({ role, content })),
    }, { signal })
    const text = data.content

    // Typewriter effect
    for (let i = 0; i < text.length; i += 4) {
      if (signal?.aborted) break
      onToken(text.slice(i, i + 4))
      await new Promise((r) => setTimeout(r, 12))
    }

    return text
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err

    // Network error → fallback
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')
    const fallback = builtInResponse(lastUserMsg?.content ?? '')
    for (let i = 0; i < fallback.length; i += 4) {
      onToken(fallback.slice(i, i + 4))
      await new Promise((r) => setTimeout(r, 10))
    }
    return fallback
  }
}
