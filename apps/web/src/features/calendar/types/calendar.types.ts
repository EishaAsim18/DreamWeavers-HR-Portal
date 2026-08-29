// ── Task & Event Types ────────────────────────────────────────────────────────

export type TaskStatus =
  | 'todo'
  | 'in_progress'
  | 'ready_for_review'
  | 'needs_revision'
  | 'completed'
  | 'cancelled'
  | 'overdue'

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low'

export type MeetingType =
  | 'standup'
  | 'review'
  | '1on1'
  | 'all_hands'
  | 'planning'
  | 'interview'

// ── People ────────────────────────────────────────────────────────────────────

export interface CalendarPerson {
  id: string
  name: string
  initials: string
  role: 'super_admin' | 'admin' | 'employee'
  department: string
  jobTitle: string
  avatarColor: string
}

// ── Sub-entities ─────────────────────────────────────────────────────────────

export interface CalendarAttachment {
  id: string
  name: string
  size: string
  fileType: 'pdf' | 'image' | 'doc' | 'spreadsheet' | 'other'
  uploadedAt: string
  uploadedBy: string
}

export interface CalendarComment {
  id: string
  authorId: string
  authorName: string
  authorInitials: string
  authorColor: string
  content: string
  createdAt: string
  isEdited?: boolean
}

export interface ActivityItem {
  id: string
  userId: string
  userName: string
  action: string
  detail?: string
  timestamp: string
  type: 'create' | 'assign' | 'status' | 'comment' | 'approve' | 'revision' | 'complete' | 'upload'
}

// ── Core Calendar Entities ───────────────────────────────────────────────────

export interface CalendarTask {
  id: string
  calendarType: 'task'
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  labels: string[]
  attachments: CalendarAttachment[]
  comments: CalendarComment[]
  assignedById: string
  assignedToId: string
  reviewerId?: string
  createdAt: string
  startDate: string
  dueDate: string
  estimatedHours: number
  completionPercent: number
  activityTimeline: ActivityItem[]
}

export interface CalendarMeeting {
  id: string
  calendarType: 'meeting'
  title: string
  description: string
  startDate: string
  endDate: string
  attendeeIds: string[]
  organizerId: string
  meetingLink?: string
  meetingType: MeetingType
  location?: string
}

export interface CalendarHoliday {
  id: string
  calendarType: 'holiday'
  title: string
  date: string
  holidayType: 'national' | 'company'
  description?: string
}

export type CalendarEvent = CalendarTask | CalendarMeeting | CalendarHoliday

// ── UI State Types ────────────────────────────────────────────────────────────

export type CalendarView =
  | 'dayGridMonth'
  | 'timeGridWeek'
  | 'timeGridDay'
  | 'listWeek'
  | 'timeline'

export interface CalendarFilters {
  assigneeIds: string[]
  priorities: TaskPriority[]
  statuses: TaskStatus[]
  showMeetings: boolean
  showHolidays: boolean
}

export interface TaskFormData {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  labels: string[]
  assignedToId: string
  reviewerId: string
  startDate: string
  dueDate: string
  estimatedHours: number
}

// ── Display Helpers ───────────────────────────────────────────────────────────

export const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  urgent: {
    label: 'Urgent',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
  high: {
    label: 'High',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    dot: 'bg-orange-500',
  },
  medium: {
    label: 'Medium',
    color: 'text-[#4a7c92]',
    bg: 'bg-[#edf5f8]',
    border: 'border-[#c5dde6]',
    dot: 'bg-[#4a7c92]',
  },
  low: {
    label: 'Low',
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
  },
}

export const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; bg: string; icon: string }
> = {
  todo: { label: 'To Do', color: 'text-slate-600', bg: 'bg-slate-100', icon: '○' },
  in_progress: { label: 'In Progress', color: 'text-blue-700', bg: 'bg-blue-50', icon: '◑' },
  ready_for_review: { label: 'Ready for Review', color: 'text-amber-700', bg: 'bg-amber-50', icon: '◕' },
  needs_revision: { label: 'Needs Revision', color: 'text-orange-700', bg: 'bg-orange-50', icon: '↺' },
  completed: { label: 'Completed', color: 'text-emerald-700', bg: 'bg-emerald-50', icon: '✓' },
  cancelled: { label: 'Cancelled', color: 'text-slate-500', bg: 'bg-slate-100', icon: '✕' },
  overdue: { label: 'Overdue', color: 'text-red-700', bg: 'bg-red-50', icon: '!' },
}

export const PRIORITY_FC_COLORS: Record<TaskPriority, string> = {
  urgent: '#ef4444',
  high: '#f97316',
  medium: '#4a7c92',
  low: '#94a3b8',
}

export const MEETING_COLORS: Record<MeetingType, string> = {
  standup: '#8b5cf6',
  review: '#6366f1',
  '1on1': '#ec4899',
  all_hands: '#0891b2',
  planning: '#7c3aed',
  interview: '#059669',
}
