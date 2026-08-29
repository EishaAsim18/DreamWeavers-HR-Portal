import { MOCK_NOTIFICATIONS } from '@/shared/data/mock'
import { sleep } from '@/shared/lib/utils'
import type { Notification } from '@/shared/types'

let notifications = [...MOCK_NOTIFICATIONS]

export async function mockFetchNotifications(): Promise<Notification[]> {
  await sleep(400)
  return [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export async function mockMarkNotificationRead(id: string): Promise<void> {
  await sleep(150)
  notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
}

export async function mockMarkAllNotificationsRead(): Promise<void> {
  await sleep(200)
  notifications = notifications.map((n) => ({ ...n, read: true }))
}

export async function mockDeleteNotification(id: string): Promise<void> {
  await sleep(150)
  notifications = notifications.filter((notification) => notification.id !== id)
}

export function mockUnreadCount(): number {
  return notifications.filter((n) => !n.read).length
}
