export type AttendanceStatus = 'present' | 'absent' | 'late' | 'on_leave' | 'half_day'

export interface AttendancePunch {
  id: string
  punchedAt: string
  type: 'in' | 'out'
  source: string
}

export interface AttendanceRecord {
  id: string
  userId: string
  userName: string
  userEmail: string
  department?: string
  date: string
  status: AttendanceStatus
  clockIn: string | null
  clockOut: string | null
  workMinutes: number | null
  notes: string | null
  punches: AttendancePunch[]
}

export interface AttendanceStats {
  present: number
  absent: number
  late: number
  onLeave: number
  halfDay: number
  avgWorkMinutes: number
  totalRecords: number
}

export interface AttendanceCorrection {
  id: string
  attendanceRecordId: string
  requesterId: string
  requesterName: string
  reason: string
  requestedClockIn: string | null
  requestedClockOut: string | null
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  decisionNote: string | null
  createdAt: string
  recordDate: string
}

export interface CorrectionFormData {
  attendanceRecordId: string
  reason: string
  requestedClockIn?: string
  requestedClockOut?: string
}

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  on_leave: 'On Leave',
  half_day: 'Half Day',
}

export const ATTENDANCE_STATUS_CLASS: Record<AttendanceStatus, string> = {
  present: 'bg-emerald-500/10 text-emerald-600',
  absent: 'bg-red-500/10 text-red-600',
  late: 'bg-amber-500/10 text-amber-600',
  on_leave: 'bg-blue-500/10 text-blue-600',
  half_day: 'bg-violet-500/10 text-violet-600',
}

export function formatWorkMinutes(minutes: number | null): string {
  if (!minutes) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return `${h}h ${m}m`
}

export function formatTime(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString('en-PK', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-PK', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function isClockedIn(record: AttendanceRecord | null): boolean {
  return Boolean(record?.clockIn && !record?.clockOut)
}
