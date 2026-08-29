import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/shared/hooks/use-auth'
import { STORAGE_KEYS } from '@/shared/constants'

type LastReadMap = Record<string, string>

function keyFor(userId?: string): string {
  return userId ? `${STORAGE_KEYS.meetDreamsRead}:${userId}` : STORAGE_KEYS.meetDreamsRead
}

function load(userId?: string): LastReadMap {
  try {
    const raw = localStorage.getItem(keyFor(userId))
    if (raw) return JSON.parse(raw) as LastReadMap
  } catch {
    // ignore corrupt data
  }
  return {}
}

function save(userId: string | undefined, map: LastReadMap): void {
  try {
    localStorage.setItem(keyFor(userId), JSON.stringify(map))
  } catch {
    // ignore quota errors
  }
}

/** Tracks, per user, the last time each conversation was opened/read. */
export function useLastRead() {
  const { user } = useAuth()
  const [map, setMap] = useState<LastReadMap>(() => load(user?.id))

  useEffect(() => {
    setMap(load(user?.id))
  }, [user?.id])

  const markRead = useCallback(
    (conversationId: string) => {
      setMap((prev) => {
        const next = { ...prev, [conversationId]: new Date().toISOString() }
        save(user?.id, next)
        return next
      })
    },
    [user?.id],
  )

  const lastReadAt = useCallback((conversationId: string) => map[conversationId], [map])

  return { markRead, lastReadAt }
}
