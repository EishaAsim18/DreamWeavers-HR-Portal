import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bell, Search, Wand2 } from 'lucide-react'
import { useGlobalSearch, useNotificationDrawer, useAiAssistant, useCommandPalette } from '@/shared/hooks'
import { Button } from '@/shared/components/ui/button'
import { Kbd } from '@/shared/components/ui/kbd'
import { cn } from '@/shared/lib/utils'
import type { BreadcrumbItem } from '@/shared/types'

export interface NavbarProps {
  title?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
  className?: string
}

export function Navbar({ title, breadcrumbs, actions, className }: NavbarProps) {
  const { open: openSearch } = useGlobalSearch()
  const { open: openCommand } = useCommandPalette()
  const { open: openNotifications, unreadCount } = useNotificationDrawer()
  const { open: openAi } = useAiAssistant()
  const mobileTitle = title ?? breadcrumbs?.at(-1)?.label

  return (
    <header
      className={cn(
        'glass-navbar sticky top-0 z-[var(--dw-z-sticky)] flex h-[calc(var(--dw-navbar-height)+env(safe-area-inset-top))] shrink-0 items-center gap-2 pb-0 pl-16 pr-2 pt-[env(safe-area-inset-top)] sm:gap-4 sm:pr-3 md:px-6 md:pt-0',
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {mobileTitle && (
          <h1 className="truncate text-sm font-semibold text-[var(--dw-color-ink-primary)] sm:text-base md:hidden">
            {mobileTitle}
          </h1>
        )}
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-sm md:flex">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.label} className="flex min-w-0 items-center gap-1.5">
                {index > 0 && (
                  <span className="text-[var(--dw-color-ink-tertiary)]" aria-hidden="true">
                    /
                  </span>
                )}
                {crumb.href ? (
                  <Link
                    to={crumb.href}
                    className="truncate text-[var(--dw-color-ink-tertiary)] transition-colors hover:text-[var(--dw-color-ink-primary)]"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="truncate font-medium text-[var(--dw-color-ink-primary)]">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <motion.button
          type="button"
          className="search-pill hidden h-9 items-center gap-2 px-3 text-[var(--dw-color-ink-secondary)] sm:flex"
          onClick={openSearch}
          aria-label="Search"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <Search className="size-4" />
          <span className="text-sm">Search…</span>
          <Kbd>/</Kbd>
        </motion.button>

        <Button
          variant="ghost"
          size="icon-sm"
          className="h-10 w-10 sm:hidden"
          onClick={openCommand}
          aria-label="Open command palette"
        >
          <Search className="size-4" />
        </Button>

        {actions}

        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-lg sm:h-9 sm:w-9"
          onClick={openNotifications}
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        >
          <Bell className="size-[18px]" />
          {unreadCount > 0 && (
            <motion.span
              className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[var(--dw-color-danger)]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={openAi}
          aria-label="Open AI assistant"
          className="h-10 w-10 rounded-lg text-[var(--dw-color-brand-primary)] hover:bg-[var(--dw-color-brand-primary-muted)] max-[359px]:hidden sm:h-9 sm:w-9"
        >
          <Wand2 className="size-[18px]" />
        </Button>
      </div>
    </header>
  )
}
