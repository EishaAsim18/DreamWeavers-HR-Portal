import { useIsMobile, useNotificationDrawer } from '@/shared/hooks'
import { NotificationDrawerPanel } from '@/shared/components/overlays/notification-drawer'

export function NotificationDrawer() {
  const isMobile = useIsMobile()
  const state = useNotificationDrawer()

  return (
    <NotificationDrawerPanel
      isOpen={state.isOpen}
      close={state.close}
      notifications={state.notifications}
      unreadCount={state.unreadCount}
      markRead={state.markRead}
      markAllRead={state.markAllRead}
      isMobile={isMobile}
    />
  )
}
