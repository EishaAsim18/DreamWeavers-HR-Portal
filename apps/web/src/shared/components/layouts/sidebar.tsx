import { useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Menu,
  Search,
  Wand2,
  X,
} from 'lucide-react'
import { MAIN_NAV, FOOTER_NAV, APP_NAME, ROUTES, ANIMATION, ROLE_LABELS, ROLE_BADGE_CLASS } from '@/shared/constants'
import { useAuth } from '@/shared/hooks/use-auth'
import { useSidebar } from '@/shared/hooks/use-shell'
import {
  useAiAssistant,
  useCommandPalette,
  useNotificationDrawer,
} from '@/shared/hooks'
import { useIsMobile, useIsDesktop } from '@/shared/hooks/use-media-query'
import { cn, getInitials } from '@/shared/lib/utils'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/button'
import { Kbd } from '@/shared/components/ui/kbd'
import { ScrollArea } from '@/shared/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'
import type { NavItem } from '@/shared/types'

// ── Logo ─────────────────────────────────────────────────────────────────────
function DreamWeaversLogo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={cn('flex items-center gap-2.5', collapsed && 'justify-center')}>
      <motion.div
        className="relative shrink-0"
        whileHover={{ scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      >
        <img
          src="/dreamweavers-logo.png"
          alt="DreamWeavers"
          className="size-8 object-contain drop-shadow-[0_2px_6px_rgba(74,124,146,0.25)]"
          draggable={false}
        />
      </motion.div>
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: ANIMATION.normal }}
            className="overflow-hidden"
          >
            <p className="whitespace-nowrap text-[13px] font-bold tracking-wide text-[var(--dw-sidebar-ink)]">
              {APP_NAME}
            </p>
            <p className="whitespace-nowrap text-[9px] font-medium tracking-[0.15em] text-[var(--dw-color-brand-primary)] uppercase">
              HRMS Platform
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Nav item ─────────────────────────────────────────────────────────────────
function NavItemLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const location = useLocation()
  const isActive =
    location.pathname === item.href ||
    (item.href !== ROUTES.dashboard && location.pathname.startsWith(item.href))

  const link = (
    <NavLink
      to={item.href}
      className={cn(
        'group relative flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-150',
        isActive
          ? 'text-[var(--dw-sidebar-active-ink)]'
          : 'text-[var(--dw-sidebar-ink-dim)] hover:text-[var(--dw-sidebar-ink)]',
        collapsed && 'justify-center px-0',
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Active background */}
      {isActive && (
        <motion.span
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-lg"
          style={{ background: 'var(--dw-sidebar-active-bg)' }}
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        />
      )}
      {/* Active left accent */}
      {isActive && (
        <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[var(--dw-sidebar-active-ink)]" />
      )}
      {/* Hover background */}
      {!isActive && (
        <span className="absolute inset-0 rounded-lg opacity-0 transition-opacity group-hover:bg-[var(--dw-sidebar-hover)] group-hover:opacity-100" />
      )}
      <item.icon
        className={cn(
          'relative z-[1] size-[17px] shrink-0 transition-colors',
          isActive ? 'text-[var(--dw-sidebar-active-ink)]' : 'text-[var(--dw-sidebar-ink-dim)] group-hover:text-[var(--dw-sidebar-ink)]',
        )}
        aria-hidden="true"
      />
      {!collapsed && (
        <>
          <span className="relative z-[1] flex-1 truncate">{item.label}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <span className="relative z-[1] flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--dw-sidebar-active-ink)]/20 px-1 text-[10px] font-semibold text-[var(--dw-sidebar-active-ink)]">
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">
          {item.label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return link
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function filterNavItem(
  item: NavItem,
  canAccessRole: (roles: import('@/shared/types').Role[]) => boolean,
  canAccessAnyPermission: (permissions: import('@/shared/types').Permission[]) => boolean,
): boolean {
  if (item.roles && !canAccessRole(item.roles)) return false
  if (item.permissions && !canAccessAnyPermission(item.permissions)) return false
  return true
}

// ── Main sidebar ──────────────────────────────────────────────────────────────
export function Sidebar() {
  const { collapsed, mobileOpen, toggleCollapsed, setMobileOpen } = useSidebar()
  const { canAccessRole, canAccessAnyPermission, user, logout } = useAuth()
  const { open: openCommand } = useCommandPalette()
  const { open: openNotifications, unreadCount } = useNotificationDrawer()
  const { open: openAi } = useAiAssistant()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useIsMobile()
  const isDesktop = useIsDesktop()

  const showCollapsed = isDesktop ? collapsed : false

  // Close the off-canvas drawer whenever the route changes, so navigating
  // to a page doesn't leave the mobile menu open over the new content.
  useEffect(() => {
    setMobileOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const sidebarContent = (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full flex-col">

        {/* Logo */}
        <div className={cn('flex h-14 items-center px-4', isMobile && 'justify-between', showCollapsed && 'justify-center px-0')}>
          <DreamWeaversLogo collapsed={showCollapsed} />
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-[var(--dw-sidebar-ink-dim)] hover:bg-[var(--dw-sidebar-hover)] hover:text-[var(--dw-sidebar-ink)]"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="size-5" />
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="px-3 pb-3">
          <Button
            variant="ghost"
            className={cn(
              'search-pill w-full justify-start gap-2',
              showCollapsed && 'justify-center px-0',
            )}
            onClick={openCommand}
            aria-label="Open command palette"
          >
            <Search className="size-[15px] text-[var(--dw-sidebar-ink-dim)]" />
            {!showCollapsed && (
              <>
                <span className="flex-1 text-left text-xs text-[var(--dw-sidebar-ink-dim)]">Quick search</span>
                <Kbd className="border-[var(--dw-sidebar-border)] bg-[var(--dw-sidebar-profile-bg)] text-[var(--dw-sidebar-ink-tertiary)] text-[9px]">⌘K</Kbd>
              </>
            )}
          </Button>
        </div>

        {/* Nav sections */}
        <ScrollArea className="flex-1 px-3">
          <nav className="space-y-5 pb-2" aria-label="Main navigation">
            {MAIN_NAV.map((section) => {
              const items = section.items.filter((item) =>
                filterNavItem(item, canAccessRole, canAccessAnyPermission),
              )
              if (items.length === 0) return null
              return (
                <div key={section.id} className="space-y-0.5">
                  {section.label && !showCollapsed && (
                    <p className="mb-1.5 px-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--dw-sidebar-ink-tertiary)]">
                      {section.label}
                    </p>
                  )}
                  {items.map((item) => (
                    <NavItemLink key={item.id} item={item} collapsed={showCollapsed} />
                  ))}
                </div>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="mt-auto space-y-1 px-3 pb-3">
          <div className="mb-2 h-px bg-[var(--dw-sidebar-border)]" />

          {/* Notifications */}
          {filterNavItem(
            { ...FOOTER_NAV.notifications } as NavItem,
            canAccessRole,
            canAccessAnyPermission,
          ) && (
            <button
              type="button"
              className={cn(
                'flex h-9 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-[var(--dw-sidebar-ink-dim)] transition-all duration-150 hover:bg-[var(--dw-sidebar-hover)] hover:text-[var(--dw-sidebar-ink)]',
                showCollapsed && 'justify-center px-0',
              )}
              onClick={openNotifications}
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
            >
              <Bell className="size-[17px] shrink-0" />
              {!showCollapsed && (
                <>
                  <span className="flex-1 text-left">Notifications</span>
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--dw-sidebar-active-ink)]/20 px-1 text-[10px] font-semibold text-[var(--dw-sidebar-active-ink)]"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </>
              )}
            </button>
          )}

          {/* AI Assistant */}
          <button
            type="button"
            className={cn(
              'flex h-9 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-[var(--dw-sidebar-ink-dim)] transition-all duration-150 hover:bg-[var(--dw-sidebar-hover)] hover:text-[var(--dw-sidebar-active-ink)]',
              showCollapsed && 'justify-center px-0',
            )}
            onClick={openAi}
            aria-label="Open AI assistant"
          >
            <Wand2 className="size-[17px] shrink-0" />
            {!showCollapsed && <span className="flex-1 text-left">AI Assistant</span>}
          </button>

          {/* User profile + logout */}
          <div className={cn(
            'mt-1 flex items-center gap-1 rounded-xl border border-[var(--dw-sidebar-profile-border)] bg-[var(--dw-sidebar-profile-bg)] p-2',
            showCollapsed && 'flex-col border-0 bg-transparent p-0',
          )}>
            <motion.button
              type="button"
              className={cn(
                'flex min-w-0 flex-1 items-center gap-2.5 rounded-lg transition-colors hover:bg-[var(--dw-sidebar-hover)]',
                showCollapsed ? 'w-full justify-center p-1' : 'px-1 py-1',
              )}
              onClick={() => navigate(ROUTES.profile)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="relative shrink-0">
                <Avatar className="size-7 ring-1 ring-[rgba(74,124,146,0.4)]">
                  <AvatarFallback className="bg-[var(--dw-color-brand-primary-muted)] text-[9px] font-bold text-[var(--dw-sidebar-active-ink)]">
                    {user ? getInitials(user.firstName, user.lastName) : '?'}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-emerald-500 ring-1 ring-[var(--dw-sidebar-bg-end)]" />
              </div>
              {!showCollapsed && user && (
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-[12px] font-semibold text-[var(--dw-sidebar-ink)]">
                    {user.firstName} {user.lastName}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className={`shrink-0 rounded-full px-1.5 py-0 text-[8.5px] font-bold uppercase tracking-wide ${ROLE_BADGE_CLASS[user.role]}`}>
                      {ROLE_LABELS[user.role]}
                    </span>
                  </div>
                </div>
              )}
            </motion.button>

            {/* Logout */}
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  type="button"
                  onClick={handleLogout}
                  className={cn(
                    'flex shrink-0 items-center justify-center rounded-lg p-1.5 text-[var(--dw-sidebar-ink-dim)] transition-colors hover:bg-[rgba(239,68,68,0.12)] hover:text-red-400',
                    showCollapsed && 'mt-1 w-full',
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label="Sign out"
                >
                  <LogOut className="size-3.5" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side={showCollapsed ? 'right' : 'top'}>
                Sign out
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Collapse toggle */}
          {isDesktop && (
            <button
              type="button"
              className="mt-1 flex h-8 w-full items-center justify-center rounded-lg text-[var(--dw-sidebar-ink-tertiary)] transition-colors hover:bg-[var(--dw-sidebar-hover)] hover:text-[var(--dw-sidebar-ink-dim)]"
              onClick={toggleCollapsed}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronsRight className="size-4" />
              ) : (
                <ChevronsLeft className="size-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </TooltipProvider>
  )

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-3 top-[calc(env(safe-area-inset-top)+0.5rem)] z-[var(--dw-z-sidebar)] h-10 w-10 md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-[var(--dw-z-drawer)] bg-black/50 backdrop-blur-sm md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                aria-hidden="true"
              />
              <motion.aside
                className="full-sidebar fixed inset-y-0 left-0 z-[var(--dw-z-drawer)] w-[min(var(--dw-sidebar-width),calc(100vw-1rem))] overflow-hidden pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] md:hidden"
                initial={{ x: -280, opacity: 0.8 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -280, opacity: 0.8 }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              >
                {sidebarContent}
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    )
  }

  return (
    <motion.aside
      className="full-sidebar fixed inset-y-0 left-0 z-[var(--dw-z-sidebar)] hidden overflow-hidden md:block"
      animate={{ width: showCollapsed ? 'var(--dw-sidebar-collapsed-width)' : 'var(--dw-sidebar-width)' }}
      transition={{ duration: ANIMATION.slow, ease: [0.32, 0.72, 0, 1] }}
      aria-label="Application sidebar"
    >
      {sidebarContent}
    </motion.aside>
  )
}
