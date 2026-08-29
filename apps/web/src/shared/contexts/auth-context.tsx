import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  devLogin,
  loadStoredSession,
  login as apiLogin,
  logout as apiLogout,
  persistSession,
  register as apiRegister,
} from '@/shared/api'
import type { AuthSession, LoginCredentials, Permission, RegisterInput, Role, User } from '@/shared/types'
import { hydrateCloudStorage } from '@/shared/lib/cloud-storage'
import {
  hasAllPermissions,
  hasAnyPermission,
  hasMinRole,
  hasPermission,
  hasRole,
} from '@/shared/constants'

interface AuthContextValue {
  user: User | null
  session: AuthSession | null
  isAuthenticated: boolean
  isLoading: boolean

  // ── Auth actions ─────────────────────────────────────
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  devLogin: (userId?: string) => Promise<void>
  register: (input: RegisterInput) => Promise<void>

  // ── Role helpers ─────────────────────────────────────
  /** True if the current user's role is in the provided list. */
  is: (...roles: Role[]) => boolean
  /** True if the current user's role is at least as privileged as minRole. */
  atLeast: (minRole: Role) => boolean

  // ── Permission helpers ────────────────────────────────
  /** True if the user holds the specific permission. */
  can: (permission: Permission) => boolean
  /** True if the user holds ANY of the listed permissions. */
  canAny: (permissions: Permission[]) => boolean
  /** True if the user holds ALL of the listed permissions. */
  canAll: (permissions: Permission[]) => boolean

  // ── Legacy aliases (kept for existing call-sites) ────
  canAccessRole: (roles: Role[]) => boolean
  canAccessPermission: (permission: Permission) => boolean
  canAccessAnyPermission: (permissions: Permission[]) => boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initialize = async () => {
      const stored = loadStoredSession()
      if (stored && !stored.accessToken.startsWith('mock_token_')) {
        await hydrateCloudStorage()
      }
      setSession(stored)
      setIsLoading(false)
    }
    void initialize()
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const next = await apiLogin(credentials)
    setSession(next)
  }, [])

  const logout = useCallback(async () => {
    await apiLogout()
    setSession(null)
  }, [])

  const devLoginHandler = useCallback(async (userId?: string) => {
    const next = await devLogin(userId)
    setSession(next)
  }, [])

  const register = useCallback(async (input: RegisterInput) => {
    const next = await apiRegister(input)
    setSession(next)
  }, [])

  // ── Role helpers ─────────────────────────────────────────────────────────

  const is = useCallback(
    (...roles: Role[]) => {
      if (!session?.user) return false
      return hasRole(session.user.role, roles)
    },
    [session],
  )

  const atLeast = useCallback(
    (minRole: Role) => {
      if (!session?.user) return false
      return hasMinRole(session.user.role, minRole)
    },
    [session],
  )

  // ── Permission helpers ────────────────────────────────────────────────────

  const can = useCallback(
    (permission: Permission) => {
      if (!session?.user) return false
      return hasPermission(session.user.permissions, permission)
    },
    [session],
  )

  const canAny = useCallback(
    (permissions: Permission[]) => {
      if (!session?.user) return false
      return hasAnyPermission(session.user.permissions, permissions)
    },
    [session],
  )

  const canAll = useCallback(
    (permissions: Permission[]) => {
      if (!session?.user) return false
      return hasAllPermissions(session.user.permissions, permissions)
    },
    [session],
  )

  // ── Legacy aliases ────────────────────────────────────────────────────────

  const canAccessRole = useCallback(
    (roles: Role[]) => {
      if (!session?.user) return false
      return hasRole(session.user.role, roles)
    },
    [session],
  )

  const canAccessPermission = useCallback(
    (permission: Permission) => {
      if (!session?.user) return false
      return hasPermission(session.user.permissions, permission)
    },
    [session],
  )

  const canAccessAnyPermission = useCallback(
    (permissions: Permission[]) => {
      if (!session?.user) return false
      return hasAnyPermission(session.user.permissions, permissions)
    },
    [session],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      isAuthenticated: Boolean(session),
      isLoading,
      login,
      logout,
      devLogin: devLoginHandler,
      register,
      is,
      atLeast,
      can,
      canAny,
      canAll,
      canAccessRole,
      canAccessPermission,
      canAccessAnyPermission,
    }),
    [
      session,
      isLoading,
      login,
      logout,
      devLoginHandler,
      register,
      is,
      atLeast,
      can,
      canAny,
      canAll,
      canAccessRole,
      canAccessPermission,
      canAccessAnyPermission,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { persistSession }
