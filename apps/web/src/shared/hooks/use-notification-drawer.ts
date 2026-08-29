import { useNotifications } from '@/shared/hooks/use-notifications'
import { useOverlay } from '@/shared/hooks/use-shell'

export function useNotificationDrawer() {
  const { activePanel, openPanel, closePanel, togglePanel } = useOverlay()
  const notificationsState = useNotifications()

  return {
    isOpen: activePanel === 'notifications',
    open: () => openPanel('notifications'),
    close: closePanel,
    toggle: () => togglePanel('notifications'),
    ...notificationsState,
  }
}
