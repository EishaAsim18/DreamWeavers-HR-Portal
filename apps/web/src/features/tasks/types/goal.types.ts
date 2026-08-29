// ── Personal Goals ────────────────────────────────────────────────────────────
// Private per-user objectives, separate from formal assigned tasks and the
// quick to-do checklist. Each person tracks progress toward their own goals.

export type GoalStatus = 'active' | 'completed' | 'archived'

export interface Goal {
  id: string
  title: string
  targetDate?: string
  progress: number
  status: GoalStatus
  createdAt: string
  completedAt?: string
}
