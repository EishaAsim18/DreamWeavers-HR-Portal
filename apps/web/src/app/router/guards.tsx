import { Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldOff } from 'lucide-react'
import { useAuth } from '@/shared/hooks/use-auth'
import { LoadingScreen } from '@/shared/components/feedback'
import { Button } from '@/shared/components/ui/button'
import { ROUTES } from '@/shared/constants'
import type { Permission, Role } from '@/shared/types'

// ── ProtectedRoute ────────────────────────────────────────────────────────────

interface ProtectedRouteProps {
  children: React.ReactNode
}

/** Redirects unauthenticated users to /login. */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <LoadingScreen />

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />
  }

  return children
}

// ── Access-denied wall ────────────────────────────────────────────────────────

function AccessDenied({ message }: { message?: string }) {
  return (
    <motion.div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-5 px-6 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-danger-muted)] shadow-[var(--dw-shadow-sm)]">
        <ShieldOff className="size-6 text-[var(--dw-color-danger)]" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-[var(--dw-color-ink-primary)]">Access restricted</h2>
        <p className="mt-1.5 max-w-sm text-sm text-[var(--dw-color-ink-secondary)]">
          {message ?? "Your role doesn't have permission to view this section. Contact your administrator if you believe this is a mistake."}
        </p>
      </div>
      <Button variant="secondary" asChild>
        <a href={ROUTES.dashboard}>Back to dashboard</a>
      </Button>
    </motion.div>
  )
}

// ── RoleRoute ─────────────────────────────────────────────────────────────────

interface RoleRouteProps {
  children: React.ReactNode
  /** User must have AT LEAST ONE of these roles. */
  roles?: Role[]
  /** User must have AT LEAST ONE of these permissions. */
  permissions?: Permission[]
  /** Custom fallback instead of the default access-denied screen. */
  fallback?: React.ReactNode
  /** Custom message for the default access-denied screen. */
  deniedMessage?: string
}

/**
 * Renders children only when the authenticated user satisfies the
 * role/permission requirements. Shows the access-denied wall otherwise.
 *
 * NEVER use this to gate super_admin-only UI — use SuperAdminRoute instead.
 */
export function RoleRoute({
  children,
  roles,
  permissions,
  fallback,
  deniedMessage,
}: RoleRouteProps) {
  const { canAccessRole, canAccessAnyPermission } = useAuth()

  const roleOk = !roles || canAccessRole(roles)
  const permOk = !permissions || canAccessAnyPermission(permissions)

  if (!roleOk || !permOk) {
    return fallback ?? <AccessDenied message={deniedMessage} />
  }

  return children
}

// ── SuperAdminRoute ───────────────────────────────────────────────────────────

interface SuperAdminRouteProps {
  children: React.ReactNode
}

/**
 * Renders children ONLY for super_admin.
 * Used for admin-management pages that must never be visible to other roles.
 */
export function SuperAdminRoute({ children }: SuperAdminRouteProps) {
  const { is } = useAuth()

  if (!is('super_admin')) {
    return (
      <AccessDenied message="This section is reserved for the system owner and cannot be accessed by your role." />
    )
  }

  return children
}

// ── SelfOrAdminRoute ──────────────────────────────────────────────────────────

interface SelfOrAdminRouteProps {
  children: React.ReactNode
  /** The resource owner's user ID (e.g. from URL params). */
  ownerId: string
}

/**
 * Renders children when:
 *   • The current user IS the resource owner (employee viewing their own data), OR
 *   • The current user is admin or super_admin.
 *
 * This ensures employees can only access their own records while
 * admins retain full visibility.
 */
export function SelfOrAdminRoute({ children, ownerId }: SelfOrAdminRouteProps) {
  const { user, atLeast } = useAuth()

  const isSelf = user?.id === ownerId
  const isAdmin = atLeast('admin')

  if (!isSelf && !isAdmin) {
    return (
      <AccessDenied message="You can only access your own data." />
    )
  }

  return children
}
