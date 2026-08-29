import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import {
  mockFetchNotifications,
  mockDeleteNotification,
  mockMarkAllNotificationsRead,
  mockMarkNotificationRead,
} from '@/shared/api'
import { QUERY_KEYS } from '@/shared/constants'

export function useNotifications() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: QUERY_KEYS.notifications,
    queryFn: mockFetchNotifications,
  })

  const unreadCount = query.data?.filter((n) => !n.read).length ?? 0

  const markRead = useCallback(
    async (id: string) => {
      await mockMarkNotificationRead(id)
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications })
    },
    [queryClient],
  )

  const markAllRead = useCallback(async () => {
    await mockMarkAllNotificationsRead()
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications })
  }, [queryClient])

  const dismiss = useCallback(async (id: string) => {
    await mockDeleteNotification(id)
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications })
  }, [queryClient])

  return {
    notifications: query.data ?? [],
    unreadCount,
    isLoading: query.isLoading,
    markRead,
    markAllRead,
    dismiss,
    refetch: query.refetch,
  }
}
