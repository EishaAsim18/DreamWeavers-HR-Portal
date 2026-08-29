import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Calendar,
  Clock,
  User,
  Tag,
  Paperclip,
  MessageSquare,
  Activity,
  Edit3,
  Trash2,
  CheckCircle2,
  RotateCcw,
  ChevronRight,
  Send,
  Upload,
  Video,
  MapPin,
  Link2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import type { CalendarEvent, CalendarTask, CalendarMeeting } from '../types/calendar.types'
import { PRIORITY_CONFIG, STATUS_CONFIG, MEETING_COLORS } from '../types/calendar.types'
import { getPerson } from '../data/calendar.mock'
import type { useCalendarPermissions } from '../hooks/use-calendar-permissions'
import type { useCalendarStore } from '../hooks/use-calendar-store'

type Perms = ReturnType<typeof useCalendarPermissions>
type Store = ReturnType<typeof useCalendarStore>

interface TaskDrawerProps {
  event: CalendarEvent | null
  isOpen: boolean
  onClose: () => void
  perms: Perms
  store: Store
}

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ personId, size = 'sm' }: { personId: string; size?: 'sm' | 'md' | 'lg' }) {
  const person = getPerson(personId)
  if (!person) return null
  const dims = size === 'lg' ? 'size-9' : size === 'md' ? 'size-7' : 'size-6'
  const text = size === 'lg' ? 'text-xs' : 'text-[10px]'
  return (
    <span
      className={`${dims} flex shrink-0 items-center justify-center rounded-full font-bold text-white ${text}`}
      style={{ background: person.avatarColor }}
      title={person.name}
    >
      {person.initials}
    </span>
  )
}

// ── Progress Bar ──────────────────────────────────────────────────────────────

function ProgressBar({ value, onChange, editable }: { value: number; onChange?: (v: number) => void; editable: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    if (!editable || !ref.current || !onChange) return
    const rect = ref.current.getBoundingClientRect()
    const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    onChange(Math.min(100, Math.max(0, pct)))
  }

  const color = value === 100 ? '#10b981' : value > 60 ? '#4a7c92' : value > 30 ? '#f59e0b' : '#ef4444'

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--dw-color-ink-tertiary)]">Progress</span>
        <span className="text-xs font-bold" style={{ color }}>{value}%</span>
      </div>
      <div
        ref={ref}
        className={`h-2 w-full overflow-hidden rounded-full bg-[var(--dw-color-surface-sunken)] ${editable ? 'cursor-pointer' : ''}`}
        onClick={handleClick}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {editable && (
        <p className="mt-1 text-[10px] text-[var(--dw-color-ink-tertiary)]">Click the bar to update progress</p>
      )}
    </div>
  )
}

// ── Task Drawer Content ───────────────────────────────────────────────────────

function TaskContent({ task, perms, store, onClose }: {
  task: CalendarTask
  perms: Perms
  store: Store
  onClose: () => void
}) {
  const navigate = useNavigate()
  const [comment, setComment] = useState('')
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'activity'>('details')

  const priorityCfg = PRIORITY_CONFIG[task.priority]
  const statusCfg = STATUS_CONFIG[task.status]
  const assignedTo = getPerson(task.assignedToId)
  const assignedBy = getPerson(task.assignedById)
  const reviewer = task.reviewerId ? getPerson(task.reviewerId) : null

  const dueDateObj = new Date(task.dueDate)
  const isOverdue = dueDateObj < new Date() && task.status !== 'completed' && task.status !== 'cancelled'
  const formattedDue = dueDateObj.toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })

  const handleComment = () => {
    if (!comment.trim() || !perms.userId) return
    const person = getPerson(perms.userId)
    if (!person) return
    void store.addComment(task.id, comment.trim())
    setComment('')
  }

  const handleProgressChange = (v: number) => {
    void store.updateProgress(task.id, v)
  }

  const canApprove = perms.canApproveTask(task)
  const canRevision = perms.canReturnForRevision(task)
  const canMarkReady = perms.canMarkReadyForReview(task)
  const canEdit = perms.canEditTask(task)
  const canDelete = perms.canDeleteTask(task)
  const canUpload = perms.canUploadAttachment(task)
  const canUpdateProgress = perms.canUpdateProgress(task)

  // Get the latest task from store (to reflect comment updates)
  const liveTask = store.filteredTasks.find((t) => t.id === task.id) ?? task

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-[var(--dw-color-border-default)] px-5 pb-4 pt-5">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            {/* Priority + Status badges */}
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${priorityCfg.bg} ${priorityCfg.border} ${priorityCfg.color}`}>
                <span className={`size-1.5 rounded-full ${priorityCfg.dot}`} />
                {priorityCfg.label}
              </span>
              <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${statusCfg.bg} ${statusCfg.color}`}>
                <span className="text-[11px]">{statusCfg.icon}</span>
                {statusCfg.label}
              </span>
              {isOverdue && (
                <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                  <AlertCircle className="size-3" />
                  Overdue
                </span>
              )}
            </div>
            {/* Title */}
            <h2 className="text-base font-semibold leading-snug text-[var(--dw-color-ink-primary)]">
              {task.title}
            </h2>
          </div>

          {/* Action buttons */}
          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => { onClose(); navigate(`/tasks/${task.id}`) }}
              className="flex size-7 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] transition-colors hover:bg-[var(--dw-color-surface-sunken)] hover:text-[var(--dw-color-brand-primary)]"
              title="Open full task"
            >
              <ExternalLink className="size-3.5" />
            </button>
            {canEdit && (
              <button
                onClick={() => { onClose(); store.openEditForm(task) }}
                className="flex size-7 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] transition-colors hover:bg-[var(--dw-color-surface-sunken)] hover:text-[var(--dw-color-brand-primary)]"
                title="Edit task"
              >
                <Edit3 className="size-3.5" />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => store.deleteTask(task.id)}
                className="flex size-7 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] transition-colors hover:bg-red-50 hover:text-red-500"
                title="Delete task"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="flex size-7 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] transition-colors hover:bg-[var(--dw-color-surface-sunken)]"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <ProgressBar
            value={liveTask.completionPercent}
            onChange={canUpdateProgress ? handleProgressChange : undefined}
            editable={canUpdateProgress}
          />
        </div>

        {/* Quick action buttons */}
        <div className="mt-3 flex flex-wrap gap-2">
          {canMarkReady && (
            <motion.button
              onClick={() => store.changeTaskStatus(task.id, 'ready_for_review')}
              className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition-all hover:bg-amber-100"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <ChevronRight className="size-3.5" />
              Submit for Review
            </motion.button>
          )}
          {canApprove && (
            <motion.button
              onClick={() => store.changeTaskStatus(task.id, 'completed')}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-all hover:bg-emerald-100"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <CheckCircle2 className="size-3.5" />
              Approve & Complete
            </motion.button>
          )}
          {canRevision && (
            <motion.button
              onClick={() => store.changeTaskStatus(task.id, 'needs_revision')}
              className="flex items-center gap-1.5 rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700 transition-all hover:bg-orange-100"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <RotateCcw className="size-3.5" />
              Return for Revision
            </motion.button>
          )}
          {task.status === 'todo' && task.assignedToId === perms.userId && (
            <motion.button
              onClick={() => store.changeTaskStatus(task.id, 'in_progress')}
              className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-all hover:bg-blue-100"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Start Task
            </motion.button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--dw-color-border-default)] px-5">
        {(['details', 'comments', 'activity'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative py-2.5 pr-4 text-xs font-semibold capitalize transition-colors ${
              activeTab === tab
                ? 'text-[var(--dw-color-brand-primary)]'
                : 'text-[var(--dw-color-ink-tertiary)] hover:text-[var(--dw-color-ink-secondary)]'
            }`}
          >
            {tab}
            {tab === 'comments' && liveTask.comments.length > 0 && (
              <span className="ml-1 rounded-full bg-[var(--dw-color-brand-primary-muted)] px-1.5 py-0.5 text-[10px] text-[var(--dw-color-brand-primary)]">
                {liveTask.comments.length}
              </span>
            )}
            {activeTab === tab && (
              <motion.div
                className="absolute bottom-0 left-0 right-4 h-0.5 rounded-full bg-[var(--dw-color-brand-primary)]"
                layoutId="tab-indicator"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <AnimatePresence mode="wait">
          {activeTab === 'details' && (
            <motion.div
              key="details"
              className="flex flex-col gap-4"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                <InfoCard icon={<User className="size-3.5" />} label="Assigned To">
                  {assignedTo && (
                    <div className="flex items-center gap-1.5">
                      <Avatar personId={task.assignedToId} size="sm" />
                      <span className="text-xs font-medium text-[var(--dw-color-ink-primary)]">
                        {assignedTo.name.split(' ')[0]}
                      </span>
                    </div>
                  )}
                </InfoCard>

                <InfoCard icon={<User className="size-3.5" />} label="Assigned By">
                  {assignedBy && (
                    <div className="flex items-center gap-1.5">
                      <Avatar personId={task.assignedById} size="sm" />
                      <span className="text-xs font-medium text-[var(--dw-color-ink-primary)]">
                        {assignedBy.name.split(' ')[0]}
                      </span>
                    </div>
                  )}
                </InfoCard>

                <InfoCard icon={<Calendar className="size-3.5" />} label="Due Date">
                  <span className={`text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-[var(--dw-color-ink-primary)]'}`}>
                    {formattedDue}
                  </span>
                </InfoCard>

                <InfoCard icon={<Clock className="size-3.5" />} label="Estimated">
                  <span className="text-xs font-medium text-[var(--dw-color-ink-primary)]">
                    {task.estimatedHours}h
                  </span>
                </InfoCard>

                {reviewer && (
                  <InfoCard icon={<CheckCircle2 className="size-3.5" />} label="Reviewer">
                    <div className="flex items-center gap-1.5">
                      <Avatar personId={reviewer.id} size="sm" />
                      <span className="text-xs font-medium text-[var(--dw-color-ink-primary)]">
                        {reviewer.name.split(' ')[0]}
                      </span>
                    </div>
                  </InfoCard>
                )}

                <InfoCard icon={<Calendar className="size-3.5" />} label="Created">
                  <span className="text-xs font-medium text-[var(--dw-color-ink-primary)]">
                    {new Date(task.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                  </span>
                </InfoCard>
              </div>

              {/* Description */}
              {task.description && (
                <div>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--dw-color-ink-tertiary)]">
                    Description
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--dw-color-ink-secondary)]">
                    {task.description}
                  </p>
                </div>
              )}

              {/* Labels */}
              {task.labels.length > 0 && (
                <div>
                  <p className="mb-1.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--dw-color-ink-tertiary)]">
                    <Tag className="size-3" /> Labels
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {task.labels.map((label) => (
                      <span
                        key={label}
                        className="rounded-full border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] px-2.5 py-0.5 text-xs text-[var(--dw-color-ink-secondary)]"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachments */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--dw-color-ink-tertiary)]">
                    <Paperclip className="size-3" /> Attachments ({liveTask.attachments.length})
                  </p>
                  {canUpload && (
                    <button className="flex items-center gap-1 text-[10px] font-semibold text-[var(--dw-color-brand-primary)]">
                      <Upload className="size-3" /> Upload
                    </button>
                  )}
                </div>
                {liveTask.attachments.length > 0 ? (
                  <div className="flex flex-col gap-1.5">
                    {liveTask.attachments.map((att) => (
                      <AttachmentRow key={att.id} att={att} />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--dw-color-ink-tertiary)]">No attachments yet</p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'comments' && (
            <motion.div
              key="comments"
              className="flex flex-col gap-3"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {liveTask.comments.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <MessageSquare className="size-8 text-[var(--dw-color-border-default)]" />
                  <p className="text-sm text-[var(--dw-color-ink-tertiary)]">No comments yet</p>
                </div>
              ) : (
                liveTask.comments.map((c) => (
                  <motion.div
                    key={c.id}
                    className="flex gap-2.5"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span
                      className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ background: c.authorColor }}
                    >
                      {c.authorInitials}
                    </span>
                    <div className="flex-1 rounded-xl bg-[var(--dw-color-surface-sunken)] p-3">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[var(--dw-color-ink-primary)]">
                          {c.authorName}
                        </span>
                        <span className="text-[10px] text-[var(--dw-color-ink-tertiary)]">
                          {new Date(c.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-[var(--dw-color-ink-secondary)]">
                        {c.content}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}

              {/* Comment input */}
              {perms.canAddComment() && (
                <div className="sticky bottom-0 mt-2 flex gap-2 rounded-xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] p-2">
                  <input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleComment() } }}
                    placeholder="Add a comment…"
                    className="flex-1 bg-transparent text-sm text-[var(--dw-color-ink-primary)] placeholder:text-[var(--dw-color-ink-tertiary)] focus:outline-none"
                  />
                  <button
                    onClick={handleComment}
                    disabled={!comment.trim()}
                    className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[var(--dw-color-brand-primary)] text-white transition-all disabled:opacity-40"
                  >
                    <Send className="size-3.5" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              className="flex flex-col gap-0"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {task.activityTimeline.map((item, idx) => {
                const isLast = idx === task.activityTimeline.length - 1
                const icons: Record<string, React.ReactNode> = {
                  create: <span className="text-blue-500">✦</span>,
                  assign: <span className="text-purple-500">→</span>,
                  status: <span className="text-amber-500">◑</span>,
                  comment: <span className="text-sky-500">💬</span>,
                  approve: <span className="text-emerald-500">✓</span>,
                  revision: <span className="text-orange-500">↺</span>,
                  complete: <span className="text-emerald-500">★</span>,
                  upload: <span className="text-[#4a7c92]">↑</span>,
                }
                return (
                  <div key={item.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex size-5 items-center justify-center rounded-full bg-[var(--dw-color-surface-sunken)] text-[11px]">
                        {icons[item.type] ?? <Activity className="size-2.5" />}
                      </div>
                      {!isLast && <div className="w-px flex-1 bg-[var(--dw-color-border-default)] my-1" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-xs text-[var(--dw-color-ink-secondary)]">
                        <span className="font-semibold text-[var(--dw-color-ink-primary)]">
                          {item.userName}
                        </span>{' '}
                        {item.action}
                        {item.detail && (
                          <span className="font-semibold text-[var(--dw-color-brand-primary)]">
                            {' '}{item.detail}
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-[10px] text-[var(--dw-color-ink-tertiary)]">
                        {new Date(item.timestamp).toLocaleDateString('en-PK', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Meeting Drawer Content ────────────────────────────────────────────────────

function MeetingContent({ meeting, onClose }: { meeting: CalendarMeeting; onClose: () => void }) {
  const color = MEETING_COLORS[meeting.meetingType]
  const start = new Date(meeting.startDate)
  const end = new Date(meeting.endDate)

  const typeLabel: Record<string, string> = {
    standup: 'Daily Standup',
    review: 'Review Meeting',
    '1on1': '1:1 Meeting',
    all_hands: 'All Hands',
    planning: 'Planning Session',
    interview: 'Interview',
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[var(--dw-color-border-default)] px-5 pb-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span
              className="mb-2 inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{ background: `${color}18`, color }}
            >
              <Video className="size-3" />
              {typeLabel[meeting.meetingType] ?? 'Meeting'}
            </span>
            <h2 className="text-base font-semibold text-[var(--dw-color-ink-primary)]">
              {meeting.title}
            </h2>
          </div>
          <button onClick={onClose} className="flex size-7 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] hover:bg-[var(--dw-color-surface-sunken)]">
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <InfoCard icon={<Calendar className="size-3.5" />} label="Date">
              <span className="text-xs font-medium text-[var(--dw-color-ink-primary)]">
                {start.toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </InfoCard>
            <InfoCard icon={<Clock className="size-3.5" />} label="Time">
              <span className="text-xs font-medium text-[var(--dw-color-ink-primary)]">
                {start.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })} –{' '}
                {end.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </InfoCard>
            {meeting.location && (
              <InfoCard icon={<MapPin className="size-3.5" />} label="Location">
                <span className="text-xs font-medium text-[var(--dw-color-ink-primary)]">{meeting.location}</span>
              </InfoCard>
            )}
            {meeting.meetingLink && (
              <InfoCard icon={<Link2 className="size-3.5" />} label="Join Link">
                <a
                  href={meeting.meetingLink}
                  className="text-xs font-medium text-[var(--dw-color-brand-primary)] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Meeting
                </a>
              </InfoCard>
            )}
          </div>

          {meeting.description && (
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--dw-color-ink-tertiary)]">Description</p>
              <p className="text-sm leading-relaxed text-[var(--dw-color-ink-secondary)]">{meeting.description}</p>
            </div>
          )}

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--dw-color-ink-tertiary)]">
              Attendees ({meeting.attendeeIds.length})
            </p>
            <div className="flex flex-col gap-2">
              {meeting.attendeeIds.map((id) => {
                const person = getPerson(id)
                if (!person) return null
                return (
                  <div key={id} className="flex items-center gap-2.5">
                    <span
                      className="flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ background: person.avatarColor }}
                    >
                      {person.initials}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-[var(--dw-color-ink-primary)]">
                        {person.name}
                        {id === meeting.organizerId && (
                          <span className="ml-1.5 text-[9px] font-medium text-[var(--dw-color-ink-tertiary)]">Organizer</span>
                        )}
                      </p>
                      <p className="text-[10px] text-[var(--dw-color-ink-tertiary)]">{person.jobTitle}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function InfoCard({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] p-2.5">
      <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--dw-color-ink-tertiary)]">
        {icon} {label}
      </span>
      {children}
    </div>
  )
}

function AttachmentRow({ att }: { att: { id: string; name: string; size: string; fileType: string; uploadedAt: string } }) {
  const icons: Record<string, string> = { pdf: '📄', image: '🖼️', doc: '📝', spreadsheet: '📊', other: '📎' }
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] p-2">
      <span className="text-base">{icons[att.fileType] ?? '📎'}</span>
      <div className="flex-1 min-w-0">
        <p className="truncate text-xs font-medium text-[var(--dw-color-ink-primary)]">{att.name}</p>
        <p className="text-[10px] text-[var(--dw-color-ink-tertiary)]">
          {att.size} · {new Date(att.uploadedAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
        </p>
      </div>
    </div>
  )
}

// ── Main Drawer ───────────────────────────────────────────────────────────────

export function TaskDrawer({ event, isOpen, onClose, perms, store }: TaskDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && event && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.div
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col bg-[var(--dw-color-surface-base)] shadow-[var(--dw-shadow-xl)]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {event.calendarType === 'task' && (
              <TaskContent
                task={event}
                perms={perms}
                store={store}
                onClose={onClose}
              />
            )}
            {event.calendarType === 'meeting' && (
              <MeetingContent meeting={event} onClose={onClose} />
            )}
            {event.calendarType === 'holiday' && (
              <div className="flex h-full flex-col">
                <div className="border-b border-[var(--dw-color-border-default)] px-5 pb-4 pt-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="mb-2 inline-block rounded-md bg-[#edf5f8] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#4a7c92]">
                        {event.holidayType === 'national' ? 'National Holiday' : 'Company Holiday'}
                      </span>
                      <h2 className="text-base font-semibold text-[var(--dw-color-ink-primary)]">{event.title}</h2>
                    </div>
                    <button onClick={onClose} className="flex size-7 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] hover:bg-[var(--dw-color-surface-sunken)]">
                      <X className="size-4" />
                    </button>
                  </div>
                </div>
                <div className="px-5 py-4">
                  <InfoCard icon={<Calendar className="size-3.5" />} label="Date">
                    <span className="text-xs font-medium text-[var(--dw-color-ink-primary)]">
                      {new Date(event.date).toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </InfoCard>
                  {event.description && (
                    <p className="mt-4 text-sm text-[var(--dw-color-ink-secondary)]">{event.description}</p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
