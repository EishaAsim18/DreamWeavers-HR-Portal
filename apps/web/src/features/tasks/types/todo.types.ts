// ── Personal To-Do List ──────────────────────────────────────────────────────
// A lightweight, private checklist distinct from the formal assigned-task
// system (CalendarTask). Lives entirely on-device per user.

export interface TodoItem {
  id: string
  text: string
  completed: boolean
  createdAt: string
}
