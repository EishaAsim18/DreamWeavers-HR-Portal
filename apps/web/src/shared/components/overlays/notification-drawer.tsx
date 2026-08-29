import {
  AtSign,
  Bell,
  CheckCircle,
  Clock,
  FileText,
  Info,
  Video,
  Workflow,
  X,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { ScrollArea } from '@/shared/components/ui/scroll-area'
import { Separator } from '@/shared/components/ui/separator'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerSheetContent,
  DrawerTitle,
} from '@/shared/components/ui/drawer'
import { formatRelativeTime } from '@/shared/lib/utils'
import { ROUTES } from '@/shared/constants'
import type { Notification, NotificationCategory } from '@/shared/types'

const CATEGORY_ICONS: Record<NotificationCategory, typeof Bell> = {
  approval: CheckCircle,
  task: CheckCircle,
  mention: AtSign,
  attendance: Clock,
  document: FileText,
  meeting: Video,
  system: Info,
  automation: Workflow,
}

interface NotificationListProps {
  notifications: Notification[]
  unreadCount: number
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
}

function NotificationList({
  notifications,
  unreadCount,
  markRead,
  markAllRead,
}: NotificationListProps) {
  return (
    <>
      <div className="glass-panel flex items-center justify-between border-b border-[var(--dw-color-border-default)] px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--dw-color-brand-primary-muted)]">
            <Bell className="size-4 text-[var(--dw-color-brand-primary)]" />
          </div>
          <div>
            <span className="text-sm font-semibold text-[var(--dw-color-ink-primary)]">Notifications</span>
            {unreadCount > 0 && (
              <motion.span
                className="ml-2 inline-flex rounded-full bg-[var(--dw-color-brand-primary)] px-2 py-0.5 text-xs font-medium text-white"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              >
                {unreadCount}
              </motion.span>
            )}
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={() => void markAllRead()}>
            Mark all read
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="divide-y divide-[var(--dw-color-border-default)]">
          {notifications.map((notification, i) => {
            const Icon = CATEGORY_ICONS[notification.category]
            return (
              <motion.div
                key={notification.id}
                className="flex gap-3 px-4 py-3 transition-colors hover:bg-[var(--dw-color-surface-sunken)]"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
              >
                {!notification.read && (
                  <motion.span
                    className="mt-2 size-2 shrink-0 rounded-full bg-[var(--dw-color-brand-primary)]"
                    aria-hidden="true"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--dw-color-brand-primary-muted)] ${notification.read ? 'ml-5' : ''}`}
                >
                  <Icon className="size-4 text-[var(--dw-color-brand-primary)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm ${notification.read ? 'text-[var(--dw-color-ink-secondary)]' : 'font-medium text-[var(--dw-color-ink-primary)]'}`}
                  >
                    {notification.title}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--dw-color-ink-tertiary)]">
                    {notification.description}
                  </p>
                  <p className="mt-1 text-xs text-[var(--dw-color-ink-tertiary)]">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                  <div className="mt-2 flex gap-2">
                    {notification.actions?.map((action) => (
                      <Button
                        key={action.id}
                        variant={action.variant === 'primary' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => void markRead(notification.id)}
                      >
                        {action.label}
                      </Button>
                    ))}
                    {notification.href && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        onClick={() => void markRead(notification.id)}
                      >
                        <Link to={notification.href}>View</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </ScrollArea>
      <Separator />
      <div className="p-3">
        <Button variant="ghost" className="w-full" asChild>
          <Link to={ROUTES.notifications}>View all notifications</Link>
        </Button>
      </div>
    </>
  )
}

interface NotificationDrawerProps {
  isOpen: boolean
  close: () => void
  notifications: Notification[]
  unreadCount: number
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
  isMobile: boolean
}

export function NotificationDrawerPanel({
  isOpen,
  close,
  notifications,
  unreadCount,
  markRead,
  markAllRead,
  isMobile,
}: NotificationDrawerProps) {
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && close()}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerTitle className="sr-only">Notifications</DrawerTitle>
          <NotificationList
            notifications={notifications}
            unreadCount={unreadCount}
            markRead={markRead}
            markAllRead={markAllRead}
          />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && close()} direction="right">
      <DrawerSheetContent className="drawer-glass w-[400px] max-w-[400px] p-0">
        <DrawerTitle className="sr-only">Notifications</DrawerTitle>
        <div className="relative flex h-full flex-col">
          <DrawerClose className="absolute right-4 top-4 z-10 rounded-md opacity-70 transition-opacity hover:opacity-100">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </DrawerClose>
          <NotificationList
            notifications={notifications}
            unreadCount={unreadCount}
            markRead={markRead}
            markAllRead={markAllRead}
          />
        </div>
      </DrawerSheetContent>
    </Drawer>
  )
}
