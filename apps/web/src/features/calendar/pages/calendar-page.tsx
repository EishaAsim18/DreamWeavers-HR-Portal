import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import type { EventInput, EventDropArg, EventClickArg, CalendarApi } from '@fullcalendar/core'
import type { DateClickArg } from '@fullcalendar/interaction'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { PageContainer } from '@/shared/components/layouts'
import { AmbientBackground } from '@/shared/components/motion/motion-primitives'
import { BorderBeam } from '@/shared/components/effects/border-beam'
import { Meteors } from '@/shared/components/effects/meteors'
import { useAuth } from '@/shared/hooks/use-auth'
import { useIsMobile } from '@/shared/hooks/use-media-query'
import type { CalendarEvent } from '../types/calendar.types'
import { PRIORITY_FC_COLORS, MEETING_COLORS } from '../types/calendar.types'
import { useCalendarStore } from '../hooks/use-calendar-store'
import { CalendarToolbar } from '../components/calendar-toolbar'
import { CalendarEventContent } from '../components/event-card'
import { TaskDrawer } from '../components/task-drawer'
import { TaskFormModal } from '../components/task-form-modal'
import { TimelineView } from '../components/timeline-view'
import { MiniCalendar } from '../components/mini-calendar'
import { CalendarHeroBanner, PriorityLegendBar } from '../components/calendar-decor'
import { CalendarStatCards } from '../components/calendar-stat-cards'
import '../components/calendar.css'

function toFCEvent(event: CalendarEvent): EventInput {
  if (event.calendarType === 'task') {
    const color = PRIORITY_FC_COLORS[event.priority]
    return {
      id: event.id,
      title: event.title,
      start: event.startDate,
      end: event.dueDate,
      allDay: true,
      backgroundColor: `${color}18`,
      borderColor: 'transparent',
      textColor: color,
      editable: true,
      classNames: event.priority === 'urgent' ? ['fc-event-urgent'] : [],
      extendedProps: { calendarEvent: event },
    }
  }

  if (event.calendarType === 'meeting') {
    const color = MEETING_COLORS[event.meetingType]
    return {
      id: event.id,
      title: event.title,
      start: event.startDate,
      end: event.endDate,
      allDay: false,
      backgroundColor: `${color}18`,
      borderColor: color,
      textColor: color,
      editable: false,
      extendedProps: { calendarEvent: event },
    }
  }

  const color = event.holidayType === 'national' ? '#0891b2' : '#4a7c92'
  return {
    id: event.id,
    title: event.title,
    start: event.date,
    allDay: true,
    backgroundColor: `${color}12`,
    borderColor: 'transparent',
    textColor: color,
    editable: false,
    display: 'background',
    extendedProps: { calendarEvent: event },
  }
}

function CalendarSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] shadow-[var(--dw-shadow-sm)]">
      <div className="grid grid-cols-7 border-b border-[var(--dw-color-border-default)] bg-gradient-to-r from-[var(--dw-color-surface-sunken)] to-[#edf5f8]/50 px-3 py-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex justify-center">
            <div className="calendar-skeleton-shimmer h-2.5 w-6 rounded-full" />
          </div>
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, row) => (
        <div key={row} className="grid grid-cols-7 border-b border-[var(--dw-color-border-default)] last:border-0">
          {Array.from({ length: 7 }).map((_, col) => (
            <div key={col} className="flex min-h-[100px] flex-col gap-1.5 border-r border-[var(--dw-color-border-default)] p-2 last:border-0">
              <div className="calendar-skeleton-shimmer ml-auto h-2 w-5 rounded-full" />
              {(row + col) % 3 === 0 && (
                <div className="calendar-skeleton-shimmer h-5 w-full rounded-lg opacity-70" />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export function CalendarPage() {
  const store = useCalendarStore()
  const { user } = useAuth()
  const { perms } = store
  const calendarRef = useRef<FullCalendar>(null)
  const [currentTitle, setCurrentTitle] = useState('')
  const isMobile = useIsMobile()
  const appliedMobileView = useRef(false)

  const getCalendarApi = useCallback((): CalendarApi | null => {
    return calendarRef.current?.getApi() ?? null
  }, [])

  const handleViewChange = useCallback(
    (view: import('../types/calendar.types').CalendarView) => {
      store.setActiveView(view)
      if (view !== 'timeline') {
        const api = getCalendarApi()
        if (api) {
          api.changeView(view)
          setCurrentTitle(api.view.title)
        }
      }
    },
    [store, getCalendarApi],
  )

  useEffect(() => {
    if (isMobile && !appliedMobileView.current) {
      appliedMobileView.current = true
      handleViewChange('listWeek')
    } else if (!isMobile) {
      appliedMobileView.current = false
    }
  }, [handleViewChange, isMobile])

  const handleDateClick = useCallback(
    (arg: DateClickArg) => {
      if (!perms.canCreateTask) return
      store.openCreateForm(arg.dateStr)
    },
    [store, perms.canCreateTask],
  )

  const handleEventClick = useCallback(
    (arg: EventClickArg) => {
      const event = arg.event.extendedProps.calendarEvent as CalendarEvent | undefined
      if (!event) return
      store.openTask(event)
    },
    [store],
  )

  const handleEventDrop = useCallback(
    (arg: EventDropArg) => {
      const event = arg.event.extendedProps.calendarEvent as CalendarEvent | undefined
      if (!event || event.calendarType !== 'task') { arg.revert(); return }
      const newDate = arg.event.startStr.split('T')[0]
      void store.dragDropTask(event.id, newDate).then((ok) => { if (!ok) arg.revert() })
    },
    [store],
  )

  const handleEventAllow = useCallback(
    (_dropInfo: unknown, draggedEvent: { extendedProps?: { calendarEvent?: CalendarEvent } } | null) => {
      if (!draggedEvent?.extendedProps?.calendarEvent) return false
      const event = draggedEvent.extendedProps.calendarEvent
      if (event.calendarType !== 'task') return false
      return perms.canDragTask(event)
    },
    [perms],
  )

  const handleMiniDateClick = useCallback(
    (date: Date) => {
      const api = getCalendarApi()
      if (api && store.activeView !== 'timeline') {
        api.gotoDate(date)
        setCurrentTitle(api.view.title)
      }
    },
    [getCalendarApi, store.activeView],
  )

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

  const fcEvents = store.allVisibleEvents.filter((e) => e.calendarType !== 'holiday').map(toFCEvent)
  const bgEvents = store.allVisibleEvents.filter((e) => e.calendarType === 'holiday').map(toFCEvent)
  const allFCEvents = [...fcEvents, ...bgEvents]
  const isTimeline = store.activeView === 'timeline'

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.firstName ?? ''
  const roleLabel =
    perms.role === 'super_admin' ? '👑 Super Admin'
    : perms.role === 'admin' ? '🛡️ HR'
    : '👤 My Calendar'
  const dateLabel = new Date().toLocaleDateString('en-PK', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <PageContainer className="relative">
      <AmbientBackground />

      {/* Subtle meteors in background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
        <Meteors number={8} />
      </div>

      {/* Hero banner */}
      <CalendarHeroBanner
        greeting={greeting}
        firstName={firstName}
        roleLabel={roleLabel}
        dateLabel={dateLabel}
        isLoading={store.isLoading}
      />

      {/* Animated stat cards */}
      <CalendarStatCards stats={stats} />

      {/* Two-column layout */}
      <div className="relative flex gap-4">
        <motion.aside
          className="hidden w-[240px] shrink-0 xl:block"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.15, type: 'spring', stiffness: 200 }}
        >
          <MiniCalendar
            tasks={store.filteredTasks}
            meetings={store.meetings}
            holidays={store.holidays}
            onDateClick={handleMiniDateClick}
            currentUserId={perms.userId}
          />
        </motion.aside>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <CalendarToolbar
            activeView={store.activeView}
            onViewChange={handleViewChange}
            calendarApi={getCalendarApi()}
            currentTitle={currentTitle || 'Calendar'}
            canCreateTask={perms.canCreateTask}
            onNewTask={() => store.openCreateForm()}
            filters={store.filters}
            onUpdateFilters={store.updateFilters}
            onResetFilters={store.resetFilters}
            activeFilterCount={store.activeFilterCount}
            isFiltersOpen={store.isFiltersOpen}
            setIsFiltersOpen={store.setIsFiltersOpen}
            canViewAllCalendars={perms.canViewAllCalendars}
            allTasks={store.filteredTasks}
            currentUserId={perms.userId}
          />

          {/* Main calendar — glass panel with border beam */}
          <motion.div
            className="relative min-h-[420px] overflow-hidden rounded-2xl border sm:min-h-[600px] border-[var(--dw-color-border-default)] calendar-glass-panel shadow-[var(--dw-shadow-md)]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.12 }}
          >
            <BorderBeam size={250} duration={15} colorFrom="#4a7c92" colorTo="#7c3aed" borderWidth={2} />

            <div className="relative p-3 sm:p-4">
              <AnimatePresence mode="wait">
                {store.isLoading ? (
                  <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <CalendarSkeleton />
                  </motion.div>
                ) : isTimeline ? (
                  <motion.div
                    key="timeline"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <TimelineView tasks={store.filteredTasks} onTaskClick={store.openTask} />
                  </motion.div>
                ) : (
                  <motion.div
                    key={`cal-${store.activeView}`}
                    className="dw-calendar-wrap"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                  >
                    <FullCalendar
                      ref={calendarRef}
                      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                      initialView={isMobile ? 'listWeek' : 'dayGridMonth'}
                      headerToolbar={false}
                      editable
                      selectable={perms.canCreateTask}
                      selectMirror
                      dayMaxEvents={isMobile ? 2 : 4}
                      weekends
                      events={allFCEvents}
                      eventContent={(arg) => <CalendarEventContent arg={arg} />}
                      eventClick={handleEventClick}
                      dateClick={handleDateClick}
                      eventDrop={handleEventDrop}
                      eventAllow={handleEventAllow as never}
                      datesSet={(arg) => setCurrentTitle(arg.view.title)}
                      height="auto"
                      listDaySideFormat={{ weekday: 'long' }}
                      listDayFormat={{ month: 'long', day: 'numeric', year: 'numeric' }}
                      moreLinkContent={(args) => `+${args.num} more`}
                      noEventsContent={() => (
                        <motion.div
                          className="flex flex-col items-center gap-4 py-20 text-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <motion.div
                            className="flex size-20 items-center justify-center rounded-3xl border border-[var(--dw-color-border-default)] bg-gradient-to-br from-[#edf5f8] to-[var(--dw-color-surface-sunken)] shadow-lg"
                            animate={{ rotate: [0, 5, -5, 0], y: [0, -4, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                          >
                            <span className="text-4xl">📅</span>
                          </motion.div>
                          <div>
                            <p className="text-sm font-bold text-[var(--dw-color-ink-secondary)]">
                              No events in this period
                            </p>
                            <p className="text-xs text-[var(--dw-color-ink-tertiary)]">
                              Adjust filters or pick another date
                            </p>
                          </div>
                          {perms.canCreateTask && (
                            <motion.button
                              onClick={() => store.openCreateForm()}
                              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--dw-color-brand-primary)] to-[#3d6779] px-5 py-2.5 text-xs font-bold text-white shadow-[var(--dw-shadow-brand)]"
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              <Plus className="size-3.5" />
                              Create a task
                            </motion.button>
                          )}
                        </motion.div>
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <PriorityLegendBar />
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
