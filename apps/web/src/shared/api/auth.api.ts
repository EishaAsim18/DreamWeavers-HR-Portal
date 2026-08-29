import { apiClient } from '@/shared/api/client'
import type { AuthSession, LoginCredentials, RegisterInput, User } from '@/shared/types'
import {
  loadStoredSession,
  mockDevLoginAs,
  mockLogin,
  mockLogout,
  mockRegister,
  persistSession,
} from './mock/auth.mock'
import { hydrateCloudStorage } from '@/shared/lib/cloud-storage'

async function isApiAvailable(): Promise<boolean> {
  try {
    await apiClient.get('/health', { signal: AbortSignal.timeout(3500) })
    return true
  } catch {
    return false
  }
}

export async function apiLogin(credentials: LoginCredentials): Promise<AuthSession> {
  const session = await apiClient.post<AuthSession>('/auth/login', credentials)
  persistSession(session)
  await hydrateCloudStorage()
  return session
}

export async function apiLogout(): Promise<void> {
  persistSession(null)
}

export async function apiGetCurrentUser(): Promise<User> {
  return apiClient.get<User>('/auth/me')
}

/**
 * Tries real API first, falls back to mock when backend is unavailable OR
 * when the real API rejects the credentials — this keeps self-registered
 * (mock-only) accounts able to log back in even while a real API server
 * happens to be running, since they were never written to Postgres.
 */
export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  if (await isApiAvailable()) {
    return apiLogin(credentials)
  }
  return mockLogin(credentials)
}

export async function logout(): Promise<void> {
  if (await isApiAvailable()) {
    await apiLogout()
    return
  }
  await mockLogout()
}

export async function devLogin(userId?: string): Promise<AuthSession> {
  if (await isApiAvailable()) {
    throw new Error('Dev login is only available in mock mode. Start without the API server.')
  }
  return mockDevLoginAs(userId)
}

/**
 * Self-registration — no real `/auth/register` endpoint exists yet, so this
 * is mock-only for now (same spirit as `devLogin`). Accounts created here
 * live in localStorage and can log back in via the mock path regardless of
 * whether a real API server happens to be running.
 */
export async function register(input: RegisterInput): Promise<AuthSession> {
  if (await isApiAvailable()) {
    const session = await apiClient.post<AuthSession>('/auth/register', input)
    persistSession(session)
    await hydrateCloudStorage()
    return session
  }
  return mockRegister(input)
}

export { loadStoredSession, persistSession }
