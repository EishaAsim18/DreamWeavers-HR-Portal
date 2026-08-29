import { DEFAULT_MOCK_USER, MOCK_USERS } from '@/shared/data/mock'
import { STORAGE_KEYS, ROLE_PERMISSIONS } from '@/shared/constants'
import { sleep } from '@/shared/lib/utils'
import type { AuthSession, LoginCredentials, RegisterInput, User } from '@/shared/types'
import { registerSelfAsEmployee } from './employees.mock'

const MOCK_PASSWORD = 'password123'

// ── Self-registered accounts ────────────────────────────────────────────────
// Seeded demo accounts (MOCK_USERS) are static; anyone who signs up gets
// persisted here instead, alongside their (mock, plaintext-for-a-demo)
// password, so they can log back in later.

interface RegisteredUserRecord {
  user: User
  password: string
}

function loadRegisteredUsers(): RegisteredUserRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.registeredUsers)
    if (raw) return JSON.parse(raw) as RegisteredUserRecord[]
  } catch {
    // ignore corrupt data
  }
  return []
}

function saveRegisteredUsers(list: RegisteredUserRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.registeredUsers, JSON.stringify(list))
  } catch {
    // ignore quota errors
  }
}

function createSession(user: User): AuthSession {
  return {
    user,
    accessToken: `mock_token_${user.id}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60_000).toISOString(),
  }
}

// Session lives in sessionStorage (per browser tab) so that opening the app
// fresh ALWAYS lands on the login page first. Refreshing mid-session keeps
// the user logged in, but a new tab/window/visit starts at /login.
export function loadStoredSession(): AuthSession | null {
  try {
    // Clean up any session persisted by older builds
    localStorage.removeItem(STORAGE_KEYS.authSession)
    const raw = sessionStorage.getItem(STORAGE_KEYS.authSession)
    if (!raw) return null
    const session = JSON.parse(raw) as AuthSession
    if (new Date(session.expiresAt) < new Date()) {
      sessionStorage.removeItem(STORAGE_KEYS.authSession)
      return null
    }
    return session
  } catch {
    return null
  }
}

export function persistSession(session: AuthSession | null): void {
  if (session) {
    sessionStorage.setItem(STORAGE_KEYS.authSession, JSON.stringify(session))
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.authSession)
  }
}

export async function mockLogin(credentials: LoginCredentials): Promise<AuthSession> {
  await sleep(600)

  const email = credentials.email.trim().toLowerCase()

  const seeded = MOCK_USERS.find((u) => u.email.toLowerCase() === email)
  if (seeded) {
    if (credentials.password !== MOCK_PASSWORD) {
      throw new Error('Invalid email or password')
    }
    const session = createSession(seeded)
    persistSession(session)
    return session
  }

  const registered = loadRegisteredUsers().find((r) => r.user.email.toLowerCase() === email)
  if (!registered || registered.password !== credentials.password) {
    throw new Error('Invalid email or password')
  }

  const session = createSession(registered.user)
  persistSession(session)
  return session
}

/**
 * Self-registration — anyone can create an account, WhatsApp-style. Creates
 * an 'employee'-role user, adds a matching Employee directory record (so
 * they're instantly visible/contactable everywhere — Employees, Teams,
 * Calendar, Meet Dreams), persists their login credentials, and logs them
 * straight in.
 */
export async function mockRegister(input: RegisterInput): Promise<AuthSession> {
  await sleep(700)

  const email = input.email.trim().toLowerCase()
  const registered = loadRegisteredUsers()

  const emailTaken =
    MOCK_USERS.some((u) => u.email.toLowerCase() === email) ||
    registered.some((r) => r.user.email.toLowerCase() === email)
  if (emailTaken) {
    throw new Error('An account with this email already exists.')
  }

  const id = `usr_reg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  const firstName = input.firstName.trim()
  const lastName = input.lastName.trim()

  const employee = registerSelfAsEmployee({ id, firstName, lastName, email })

  const user: User = {
    id,
    email,
    firstName,
    lastName,
    role: 'employee',
    permissions: ROLE_PERMISSIONS.employee,
    department: employee.department,
    jobTitle: employee.jobTitle,
  }

  saveRegisteredUsers([...registered, { user, password: input.password }])

  const session = createSession(user)
  persistSession(session)
  return session
}

export async function mockLogout(): Promise<void> {
  await sleep(200)
  persistSession(null)
}

export async function mockGetCurrentUser(): Promise<User> {
  await sleep(300)
  const session = loadStoredSession()
  if (!session) throw new Error('Not authenticated')
  return session.user
}

export async function mockDevLoginAs(userId?: string): Promise<AuthSession> {
  const user = MOCK_USERS.find((u) => u.id === userId) ?? DEFAULT_MOCK_USER
  const session = createSession(user)
  persistSession(session)
  return session
}
