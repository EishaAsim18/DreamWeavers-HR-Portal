import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/shared/hooks/use-auth'
import { STORAGE_KEYS } from '@/shared/constants'
import type { TodoItem } from '../types/todo.types'

function keyFor(userId?: string): string {
  return userId ? `${STORAGE_KEYS.todoList}:${userId}` : STORAGE_KEYS.todoList
}

function loadTodos(userId?: string): TodoItem[] {
  try {
    const raw = localStorage.getItem(keyFor(userId))
    if (raw) return JSON.parse(raw) as TodoItem[]
  } catch {
    // ignore corrupt data
  }
  return []
}

function saveTodos(userId: string | undefined, items: TodoItem[]): void {
  try {
    localStorage.setItem(keyFor(userId), JSON.stringify(items))
  } catch {
    // ignore quota errors
  }
}

/**
 * Personal quick to-do list. Private per user, persisted to localStorage.
 * Distinct from the formal assigned CalendarTask system — this is a simple
 * checklist for reminders and personal follow-ups.
 */
export function useTodoList() {
  const { user } = useAuth()
  const [items, setItems] = useState<TodoItem[]>(() => loadTodos(user?.id))

  // Re-hydrate if the logged-in user changes
  useEffect(() => {
    setItems(loadTodos(user?.id))
  }, [user?.id])

  const persist = useCallback(
    (next: TodoItem[]) => {
      setItems(next)
      saveTodos(user?.id, next)
    },
    [user?.id],
  )

  const addTodo = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      const item: TodoItem = {
        id: `todo_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        text: trimmed,
        completed: false,
        createdAt: new Date().toISOString(),
      }
      persist([item, ...items])
    },
    [items, persist],
  )

  const toggleTodo = useCallback(
    (id: string) => {
      persist(items.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
    },
    [items, persist],
  )

  const deleteTodo = useCallback(
    (id: string) => {
      persist(items.filter((t) => t.id !== id))
    },
    [items, persist],
  )

  const clearCompleted = useCallback(() => {
    persist(items.filter((t) => !t.completed))
  }, [items, persist])

  const completedCount = items.filter((t) => t.completed).length

  return {
    items,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    completedCount,
    total: items.length,
  }
}
