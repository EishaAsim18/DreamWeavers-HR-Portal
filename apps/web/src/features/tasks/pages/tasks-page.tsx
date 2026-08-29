import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PageContainer } from '@/shared/components/layouts'
import { AmbientBackground } from '@/shared/components/motion/motion-primitives'
import { Meteors } from '@/shared/components/effects/meteors'
import { useAuth } from '@/shared/hooks/use-auth'
import { useIsMobile } from '@/shared/hooks/use-media-query'
import { useCalendarStore } from '@/features/calendar/hooks/use-calendar-store'
import { TaskDrawer } from '@/features/calendar/components/task-drawer'
import { TaskFormModal } from '@/features/calendar/components/task-form-modal'
import { TimelineView } from '@/features/calendar/components/timeline-view'
import { CalendarStatCards } from '@/features/calendar/components/calendar-stat-cards'
import type { CalendarTask } from '@/features/calendar/types/calendar.types'
import { TasksHeroBanner, TasksLegendBar } from '../components/tasks-decor'
import { TasksToolbar, type QuickStatusFilter, type TasksView } from '../components/tasks-toolbar'
import { TaskBoard } from '../components/task-board'
import { TaskListView } from '../components/task-list-view'
import { TodoListWidget } from '../components/todo-list-widget'
import { GoalsWidget } from '../components/goals-widget'

export function TasksPage() {
  // Reuses the exact same store as the Calendar page (same mock backend,
  // same permissions, same task model) so both modules stay perfectly aligned.
  const store = useCalendarStore()
  const { user } = useAuth()
  const { perms } = store
  const isMobile = useIsMobile()
  const appliedMobileView = useRef(false)

  const [view, setView] = useState<TasksView>('board')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<QuickStatusFilter>('all')

  useEffect(() => {
    if (isMobile && !appliedMobileView.current) {
      appliedMobileView.current = true
      setView('list')
    } else if (!isMobile) {
      appliedMobileView.current = false
    }
  }, [isMobile])

  const visibleTasks = useMemo(() => {
    let list = store.filteredTasks
    if (statusFilter !== 'all') {
      list = list.filter((t) => t.status === statusFilter)
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.labels.some((l) => l.toLowerCase().includes(q)),
      )
    }
    return list
  }, [store.filteredTasks, statusFilter, search])

  const stats = useMemo(() => {
    const t = store.filteredTasks
    return {
      total: t.length,
      inProgress: t.filter((x) => x.status === 'in_progress').length,
      inReview: t.filter((x) => x.status === 'ready_for_review').length,
      overdue: t.filter((x) => x.status === 'overdue').length,
      completed: t.filter((x) => x.status === 'completed').length,
    }
  }, [store.filteredTasks])

  const canDragTask = (task: CalendarTask) =>
    perms.canDragTask(task) || task.assignedToId === perms.userId

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.firstName ?? ''
  const roleLabel =
    perms.role === 'super_admin' ? '👑 Super Admin'
    : perms.role === 'admin' ? '🛡️ HR'
    : '👤 My Tasks'
  const dateLabel = new Date().toLocaleDateString('en-PK', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <PageContainer className="relative">
      <AmbientBackground />

      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
        <Meteors number={8} />
      </div>

      <TasksHeroBanner
        greeting={greeting}
        firstName={firstName}
        roleLabel={roleLabel}
        dateLabel={dateLabel}
        isLoading={store.isLoading}
      />

      <CalendarStatCards stats={stats} />

      {/* Two-column layout — mirrors the Calendar page for a consistent feel */}
      <div className="relative flex gap-4">
        <motion.aside
          className="hidden w-[240px] shrink-0 xl:block"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.15, type: 'spring', stiffness: 200 }}
        >
          <div className="flex flex-col gap-4">
            <TodoListWidget />
            <GoalsWidget />
          </div>
        </motion.aside>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <TasksToolbar
            search={search}
            onSearchChange={setSearch}
            activeView={view}
            onViewChange={setView}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            allTasks={store.filteredTasks}
            canCreateTask={perms.canCreateTask}
            onNewTask={() => store.openCreateForm()}
          />

          <motion.div
            className="relative min-h-[420px] rounded-2xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.12 }}
          >
            <AnimatePresence mode="wait">
              {store.isLoading ? (
                <motion.div
                  key="skeleton"
                  className="flex gap-3 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex h-[420px] w-[270px] shrink-0 flex-col gap-2 rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] p-3"
                    >
                      <div className="calendar-skeleton-shimmer h-4 w-2/3 rounded-full" />
                      {Array.from({ length: 3 }).map((_, j) => (
                        <div key={j} className="calendar-skeleton-shimmer h-20 w-full rounded-xl" />
                      ))}
                    </div>
                  ))}
                </motion.div>
              ) : view === 'board' ? (
                <motion.div key="board" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ type: 'spring', stiffness: 200 }}>
                  <TaskBoard
                    tasks={visibleTasks}
                    onTaskClick={store.openTask}
                    canDragTask={canDragTask}
                    onChangeStatus={(taskId, status) => void store.changeTaskStatus(taskId, status)}
                    canCreateTask={perms.canCreateTask}
                    onCreateTask={() => store.openCreateForm()}
                  />
                </motion.div>
              ) : view === 'list' ? (
                <motion.div key="list" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ type: 'spring', stiffness: 200 }}>
                  <TaskListView
                    tasks={visibleTasks}
                    onTaskClick={store.openTask}
                    canCreateTask={perms.canCreateTask}
                    onCreateTask={() => store.openCreateForm()}
                  />
                </motion.div>
              ) : (
                <motion.div key="timeline" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ type: 'spring', stiffness: 200 }}>
                  <TimelineView tasks={visibleTasks} onTaskClick={store.openTask} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <TasksLegendBar />
        </div>
      </div>

      <TaskDrawer
        event={store.selectedEvent}
        isOpen={store.isDrawerOpen}
        onClose={store.closeDrawer}
        perms={perms}
        store={store}
      />

      <TaskFormModal
        isOpen={store.isFormOpen}
        onClose={store.closeForm}
        editingTask={store.editingTask}
        defaultDate={store.defaultFormDate}
        store={store}
        perms={perms}
      />
    </PageContainer>
  )
}
