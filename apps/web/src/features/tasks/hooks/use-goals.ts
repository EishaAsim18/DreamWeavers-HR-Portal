import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/shared/hooks/use-auth'
import { STORAGE_KEYS } from '@/shared/constants'
import type { Goal, GoalStatus } from '../types/goal.types'

function keyFor(userId?: string): string {
  return userId ? `${STORAGE_KEYS.goals}:${userId}` : STORAGE_KEYS.goals
}

function loadGoals(userId?: string): Goal[] {
  try {
    const raw = localStorage.getItem(keyFor(userId))
    if (raw) return JSON.parse(raw) as Goal[]
  } catch {
    // ignore corrupt data
  }
  return []
}

function saveGoals(userId: string | undefined, items: Goal[]): void {
  try {
    localStorage.setItem(keyFor(userId), JSON.stringify(items))
  } catch {
    // ignore quota errors
  }
}

/**
 * Personal goals. Private per user, persisted to localStorage — mirrors the
 * to-do list's storage pattern so each person's objectives stay their own.
 */
export function useGoals() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<Goal[]>(() => loadGoals(user?.id))

  // Re-hydrate if the logged-in user changes
  useEffect(() => {
    setGoals(loadGoals(user?.id))
  }, [user?.id])

  const persist = useCallback(
    (next: Goal[]) => {
      setGoals(next)
      saveGoals(user?.id, next)
    },
    [user?.id],
  )

  const addGoal = useCallback(
    (title: string, targetDate?: string) => {
      const trimmed = title.trim()
      if (!trimmed) return
      const goal: Goal = {
        id: `goal_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        title: trimmed,
        targetDate: targetDate || undefined,
        progress: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
      }
      persist([goal, ...goals])
    },
    [goals, persist],
  )

  const updateProgress = useCallback(
    (id: string, percent: number) => {
      const clamped = Math.min(100, Math.max(0, Math.round(percent)))
      persist(
        goals.map((g) => {
          if (g.id !== id) return g
          const isNowComplete = clamped >= 100
          return {
            ...g,
            progress: clamped,
            status: isNowComplete ? 'completed' : g.status === 'archived' ? g.status : 'active',
            completedAt: isNowComplete ? g.completedAt ?? new Date().toISOString() : undefined,
          }
        }),
      )
    },
    [goals, persist],
  )

  const setStatus = useCallback(
    (id: string, status: GoalStatus) => {
      persist(
        goals.map((g) =>
          g.id === id
            ? {
                ...g,
                status,
                completedAt: status === 'completed' ? g.completedAt ?? new Date().toISOString() : undefined,
              }
            : g,
        ),
      )
    },
    [goals, persist],
  )

  const deleteGoal = useCallback(
    (id: string) => {
      persist(goals.filter((g) => g.id !== id))
    },
    [goals, persist],
  )

  const activeGoals = goals.filter((g) => g.status === 'active')
  const completedGoals = goals.filter((g) => g.status === 'completed')

  return {
    goals,
    activeGoals,
    completedGoals,
    addGoal,
    updateProgress,
    setStatus,
    deleteGoal,
  }
}
