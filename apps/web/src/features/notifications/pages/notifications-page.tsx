import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Check, CheckCheck, ClipboardCheck, FileText, ListChecks, Search, ShieldAlert, Trash2 } from 'lucide-react'
import { PageContainer, PageHeader } from '@/shared/components/layouts'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { EmptyState } from '@/shared/components/premium/empty-state'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useNotifications } from '@/shared/hooks/use-notifications'
import { cn } from '@/shared/lib/utils'
import type { Notification, NotificationCategory } from '@/shared/types'

type Filter = 'all' | 'approval' | 'task' | 'document' | 'system'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'approval', label: 'Approvals' },
  { id: 'task', label: 'Tasks' },
  { id: 'document', label: 'Documents' },
  { id: 'system', label: 'System' },
]

function categoryIcon(category: NotificationCategory) {
  if (category === 'approval' || category === 'attendance') return ClipboardCheck
  if (category === 'task' || category === 'mention') return ListChecks
  if (category === 'document') return FileText
  return ShieldAlert
}

function relativeTime(value: string) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 60000))
  if (minutes < 60) return `${minutes}m`
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h`
  return `${Math.floor(minutes / 1440)}d`
}

function groupLabel(value: string) {
  const date = new Date(value)
  const today = new Date()
  const yesterday = new Date(Date.now() - 86400000)
  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return date.toLocaleDateString('en-PK', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function NotificationsPage() {
  const navigate = useNavigate()
  const { notifications, unreadCount, isLoading, markRead, markAllRead, dismiss } = useNotifications()
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => notifications.filter((item) => {
    if (filter === 'system' && !['system', 'meeting', 'attendance'].includes(item.category)) return false
    if (filter !== 'all' && filter !== 'system' && item.category !== filter) return false
    const needle = query.trim().toLowerCase()
    return !needle || `${item.title} ${item.description}`.toLowerCase().includes(needle)
  }), [filter, notifications, query])

  const groups = useMemo(() => filtered.reduce<Record<string, Notification[]>>((result, item) => {
    const key = groupLabel(item.createdAt)
    ;(result[key] ??= []).push(item)
    return result
  }, {}), [filtered])

  const openNotification = async (item: Notification) => {
    if (!item.read) await markRead(item.id)
    if (item.href) navigate(item.href)
  }

  return (
    <PageContainer>
      <PageHeader title="Notifications" description={`${unreadCount} unread update${unreadCount === 1 ? '' : 's'} across your workspace.`} actions={<Button variant="secondary" onClick={() => void markAllRead()} disabled={!unreadCount}><CheckCheck className="size-4" /> Mark all read</Button>} />

      <div className="mb-4 rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] p-3 shadow-[var(--dw-shadow-sm)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--dw-color-ink-tertiary)]" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search notifications…" className="pl-9" /></div>
          <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">{FILTERS.map((item) => <button key={item.id} type="button" onClick={() => setFilter(item.id)} className={cn('shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-colors', filter === item.id ? 'bg-[var(--dw-color-brand-primary)] text-white' : 'text-[var(--dw-color-ink-secondary)] hover:bg-[var(--dw-color-surface-sunken)]')}>{item.label}</button>)}</div>
        </div>
      </div>

      {isLoading ? <div className="space-y-2">{Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-20 rounded-2xl" />)}</div> : filtered.length === 0 ? <div className="rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)]"><EmptyState icon={Bell} title="You're all caught up" description={query ? 'No notifications match your search.' : 'There are no updates in this category.'} /></div> : <div className="space-y-5">{Object.entries(groups).map(([label, items]) => <section key={label}><h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--dw-color-ink-tertiary)]">{label}</h2><div className="overflow-hidden rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] shadow-[var(--dw-shadow-xs)]">{items.map((item) => { const Icon = categoryIcon(item.category); return <div key={item.id} className={cn('group flex items-start gap-3 border-b border-[var(--dw-color-border-default)] p-3.5 last:border-b-0 sm:p-4', !item.read && 'bg-[var(--dw-color-brand-primary-muted)]/35')}><button type="button" onClick={() => void openNotification(item)} className="flex min-w-0 flex-1 items-start gap-3 text-left"><span className={cn('mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl', !item.read ? 'bg-[var(--dw-color-brand-primary)] text-white' : 'bg-[var(--dw-color-surface-sunken)] text-[var(--dw-color-ink-tertiary)]')}><Icon className="size-[18px]" /></span><span className="min-w-0 flex-1"><span className="flex items-start gap-2"><span className={cn('flex-1 text-sm text-[var(--dw-color-ink-primary)]', !item.read && 'font-bold')}>{item.title}</span>{!item.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[var(--dw-color-brand-primary)]" />}</span><span className="mt-1 block text-xs leading-relaxed text-[var(--dw-color-ink-secondary)]">{item.description}</span><span className="mt-1.5 block text-[10px] font-medium uppercase tracking-wide text-[var(--dw-color-ink-tertiary)]">{item.category} · {relativeTime(item.createdAt)}</span></span></button><div className="flex shrink-0 items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">{!item.read && <button type="button" title="Mark read" aria-label="Mark read" onClick={() => void markRead(item.id)} className="flex size-8 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] hover:bg-[var(--dw-color-surface-sunken)] hover:text-emerald-600"><Check className="size-4" /></button>}<button type="button" title="Dismiss" aria-label="Dismiss" onClick={() => void dismiss(item.id)} className="flex size-8 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] hover:bg-red-50 hover:text-red-500"><Trash2 className="size-4" /></button></div></div>})}</div></section>)}</div>}
    </PageContainer>
  )
}
