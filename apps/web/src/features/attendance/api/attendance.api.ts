import { apiClient } from '@/shared/api/client'
import type {
  AttendanceCorrection,
  AttendanceRecord,
  AttendanceStats,
  CorrectionFormData,
} from '../types/attendance.types'

export interface AttendanceFilters {
  startDate?: string
  endDate?: string
  userId?: string
  all?: boolean
}

function buildQuery(filters?: AttendanceFilters): string {
  if (!filters) return ''
  const params = new URLSearchParams()
  if (filters.startDate) params.set('startDate', filters.startDate)
  if (filters.endDate) params.set('endDate', filters.endDate)
  if (filters.userId) params.set('userId', filters.userId)
  if (filters.all) params.set('all', 'true')
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export const attendanceApi = {
  fetchToday: () => apiClient.get<AttendanceRecord>('/attendance/today'),

  fetchRecords: (filters?: AttendanceFilters) =>
    apiClient.get<AttendanceRecord[]>(`/attendance${buildQuery(filters)}`),

  fetchStats: (month?: number, year?: number) => {
    const params = new URLSearchParams()
    if (month) params.set('month', String(month))
    if (year) params.set('year', String(year))
    const qs = params.toString()
    return apiClient.get<AttendanceStats>(`/attendance/stats${qs ? `?${qs}` : ''}`)
  },

  clockIn: () => apiClient.post<AttendanceRecord>('/attendance/clock-in'),

  clockOut: () => apiClient.post<AttendanceRecord>('/attendance/clock-out'),

  fetchCorrections: () => apiClient.get<AttendanceCorrection[]>('/attendance/corrections'),

  requestCorrection: (data: CorrectionFormData) =>
    apiClient.post<AttendanceCorrection>('/attendance/corrections', data),

  reviewCorrection: (
    id: string,
    decision: 'approved' | 'rejected',
    decisionNote?: string,
  ) => apiClient.patch<AttendanceCorrection>(`/attendance/corrections/${id}`, { decision, decisionNote }),
}

export function useAttendanceApi() {
  return attendanceApi
}
