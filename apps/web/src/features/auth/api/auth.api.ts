import { sleep } from '@/shared/lib/utils'
import { MOCK_USERS } from '@/shared/data/mock'

export interface ForgotPasswordResult {
  success: boolean
  email: string
}

export async function mockForgotPassword(email: string): Promise<ForgotPasswordResult> {
  await sleep(900)

  // Always succeed for UX demo — don't reveal whether email exists
  const exists = MOCK_USERS.some((u) => u.email === email)
  void exists

  return { success: true, email }
}
