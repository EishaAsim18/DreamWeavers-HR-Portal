import { motion } from 'framer-motion'
import { MessageCircle, Phone, Search, Send, Video } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'
import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/lib/utils'
import { SPRING } from '@/shared/lib/motion'

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.08 + i * 0.06, duration: 0.22, ease: [0.32, 0.72, 0, 1] as const },
})

interface PreviewProps {
  className?: string
  dimmed?: boolean
}

export function KanbanPreview({ className, dimmed }: PreviewProps) {
  const cols = [
    { id: 'todo', label: 'To do', items: ['Review onboarding docs', 'Update team handbook'] },
    { id: 'progress', label: 'In progress', items: ['Q3 hiring pipeline'] },
    { id: 'done', label: 'Done', items: ['Deploy staging hotfix', 'Schedule standup'] },
  ]

  return (
    <div className={cn('grid grid-cols-3 gap-2', dimmed && 'pointer-events-none opacity-60', className)}>
      {cols.map((col) => (
        <div key={col.id} className="min-w-0">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[var(--dw-color-ink-tertiary)]">
            {col.label}
          </p>
          <div className="kanban-column space-y-2 rounded-xl p-1.5">
            {col.items.map((item, i) => (
              <motion.div
                key={item}
                className="kanban-card rounded-lg p-2.5 text-xs"
                {...fadeUp(i)}
                whileHover={dimmed ? undefined : { y: -2, transition: SPRING.gentle }}
              >
                <span className="line-clamp-2 font-medium text-[var(--dw-color-ink-primary)]">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function CalendarPreview({ className, dimmed }: PreviewProps) {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const dates = Array.from({ length: 35 }, (_, i) => i + 1)
  const highlights = new Set([7, 12, 15, 22, 28])

  return (
    <div className={cn(dimmed && 'pointer-events-none opacity-60', className)}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--dw-color-ink-primary)]">July 2026</p>
        <Badge variant="muted">3 events</Badge>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-[var(--dw-color-ink-tertiary)]">
        {days.map((d) => (
          <span key={d} className="py-1">
            {d}
          </span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {dates.map((date, i) => (
          <motion.button
            key={date}
            type="button"
            className={cn(
              'calendar-day aspect-square rounded-lg text-xs font-medium',
              highlights.has(date) && 'calendar-day-active',
              date > 31 && 'invisible',
            )}
            {...fadeUp(i % 7)}
          >
            {date <= 31 ? date : ''}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export function MeetDreamsPreview({ className, dimmed }: PreviewProps) {
  const threads = [
    { name: 'Engineering Crew', preview: 'Standup notes are ready', unread: 2 },
    { name: 'Bilal Ahmed', preview: 'Can we sync before 3pm?', unread: 0 },
    { name: 'HR Announcements', preview: 'Eid leave policy updated', unread: 1 },
  ]

  return (
    <div
      className={cn(
        'flex h-[280px] overflow-hidden rounded-xl border border-[var(--dw-color-border-default)]',
        dimmed && 'pointer-events-none opacity-60',
        className,
      )}
    >
      <div className="w-[38%] border-r border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)]/50 p-2">
        <div className="search-pill mb-2 flex items-center gap-2 px-2.5 py-1.5">
          <Search className="size-3 text-[var(--dw-color-ink-tertiary)]" />
          <span className="text-[10px] text-[var(--dw-color-ink-tertiary)]">Search chats</span>
        </div>
        {threads.map((thread, i) => (
          <motion.div
            key={thread.name}
            className={cn(
              'mb-1 rounded-lg px-2 py-2',
              i === 0 && 'bg-[var(--dw-color-brand-primary-muted)]',
            )}
            {...fadeUp(i)}
          >
            <div className="flex items-center justify-between gap-1">
              <p className="truncate text-xs font-medium">{thread.name}</p>
              {thread.unread > 0 && (
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[var(--dw-color-brand-primary)] text-[9px] text-white">
                  {thread.unread}
                </span>
              )}
            </div>
            <p className="mt-0.5 truncate text-[10px] text-[var(--dw-color-ink-tertiary)]">{thread.preview}</p>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-[var(--dw-color-border-default)] px-3 py-2">
          <p className="text-xs font-semibold">Engineering Crew</p>
          <div className="flex gap-1 text-[var(--dw-color-ink-tertiary)]">
            <Phone className="size-3.5" />
            <Video className="size-3.5" />
          </div>
        </div>
        <div className="flex-1 space-y-2 p-3">
          <div className="chat-bubble-incoming max-w-[85%] rounded-2xl rounded-bl-md px-3 py-2 text-[11px]">
            Subah bakhair team — review at 2pm 🌙
          </div>
          <div className="chat-bubble-outgoing ml-auto max-w-[85%] rounded-2xl rounded-br-md px-3 py-2 text-[11px]">
            On it! Slides ready in 10 mins.
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-[var(--dw-color-border-default)] p-2">
          <MessageCircle className="size-3.5 text-[var(--dw-color-ink-tertiary)]" />
          <div className="flex-1 rounded-full border border-[var(--dw-color-border-default)] px-3 py-1.5 text-[10px] text-[var(--dw-color-ink-tertiary)]">
            Type a message…
          </div>
          <Send className="size-3.5 text-[var(--dw-color-brand-primary)]" />
        </div>
      </div>
    </div>
  )
}

const EMPLOYEES = [
  { name: 'Bilal Ahmed', role: 'Product Designer', dept: 'Design', status: 'Active' },
  { name: 'Sana Malik', role: 'Engineering Lead', dept: 'Engineering', status: 'Active' },
  { name: 'Raza Khan', role: 'HR Specialist', dept: 'People', status: 'On leave' },
]

export function EmployeeTablePreview({ className, dimmed }: PreviewProps) {
  return (
    <div className={cn('premium-table overflow-hidden rounded-xl', dimmed && 'pointer-events-none opacity-60', className)}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th>Employee</th>
            <th className="hidden sm:table-cell">Role</th>
            <th className="hidden md:table-cell">Department</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {EMPLOYEES.map((row, i) => (
            <motion.tr key={row.name} {...fadeUp(i)}>
              <td>
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-[10px]">
                      {row.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{row.name}</span>
                </div>
              </td>
              <td className="hidden text-[var(--dw-color-ink-secondary)] sm:table-cell">{row.role}</td>
              <td className="hidden text-[var(--dw-color-ink-secondary)] md:table-cell">{row.dept}</td>
              <td>
                <Badge variant={row.status === 'Active' ? 'success' : 'muted'}>{row.status}</Badge>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function FormPreview({ className, dimmed }: PreviewProps) {
  const fields = [
    { label: 'Full name', value: 'Zara Malik' },
    { label: 'Work email', value: 'zara@dreamweavers.com' },
    { label: 'Department', value: 'Engineering' },
  ]

  return (
    <div className={cn('space-y-4', dimmed && 'pointer-events-none opacity-60', className)}>
      {fields.map((field, i) => (
        <motion.div key={field.label} className="space-y-1.5" {...fadeUp(i)}>
          <label className="text-xs font-medium text-[var(--dw-color-ink-secondary)]">{field.label}</label>
          <div className="rounded-md border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] px-3 py-2 text-sm shadow-[var(--dw-shadow-xs)]">
            {field.value}
          </div>
        </motion.div>
      ))}
      <motion.div
        className="h-9 w-28 rounded-md bg-[var(--dw-color-brand-primary)]/90"
        {...fadeUp(3)}
      />
    </div>
  )
}

export function ReportsChartPreview({ className, dimmed }: PreviewProps) {
  const bars = [62, 78, 55, 88, 72, 94, 68]

  return (
    <div className={cn(dimmed && 'pointer-events-none opacity-60', className)}>
      <div className="flex h-[160px] items-end justify-between gap-2 px-1">
        {bars.map((height, i) => (
          <motion.div
            key={i}
            className="chart-bar flex-1 rounded-t-md bg-gradient-to-t from-[var(--dw-color-brand-primary)] to-[var(--dw-color-brand-primary)]/40"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: `${height}%`, opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-[var(--dw-color-ink-tertiary)]">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  )
}
