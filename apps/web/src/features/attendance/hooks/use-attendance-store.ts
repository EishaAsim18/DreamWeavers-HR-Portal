import { useState, useCallback, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import type {
  AttendanceCorrection,
  AttendanceRecord,
  AttendanceStats,
  CorrectionFormData,
} from '../types/attendance.types'
import { isClockedIn } from '../types/attendance.types'
import { useAttendanceApi } from '../api/attendance.api'
import { useAttendancePermissions } from './use-attendance-permissions'

export function useAttendanceStore() {
  const api = useAttendanceApi()
  const perms = useAttendancePermissions()

  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null)
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [stats, setStats] = useState<AttendanceStats | null>(null)
  const [corrections, setCorrections] = useState<AttendanceCorrection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPunching, setIsPunching] = useState(false)
  const [isCorrectionOpen, setIsCorrectionOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null)

  const clockedIn = useMemo(() => isClockedIn(todayRecord), [todayRecord])

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [today, history, monthStats, correctionList] = await Promise.all([
        api.fetchToday(),
        api.fetchRecords(perms.canViewAll ? { all: true } : undefined),
        api.fetchStats(),
        api.fetchCorrections(),
      ])
      setTodayRecord(today)
      setRecords(history)
      setStats(monthStats)
      setCorrections(correctionList)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load attendance')
    } finally {
      setIsLoading(false)
    }
  }, [api, perms.canViewAll])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const clockIn = useCallback(async () => {
    if (!perms.canSubmit) {
      toast.error("You don't have permission to clock in.")
      return
    }
    setIsPunching(true)
    try {
      const record = await api.clockIn()
      setTodayRecord(record)
      setRecords((prev) => {
        const idx = prev.findIndex((r) => r.id === record.id)
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = record
          return next
        }
        return [record, ...prev]
      })
      toast.success('Clocked in successfully')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to clock in')
    } finally {
      setIsPunching(false)
    }
  }, [api, perms.canSubmit])

  const clockOut = useCallback(async () => {
    if (!perms.canSubmit) {
      toast.error("You don't have permission to clock out.")
      return
    }
    setIsPunching(true)
    try {
      const record = await api.clockOut()
      setTodayRecord(record)
      setRecords((prev) => prev.map((r) => (r.id === record.id ? record : r)))
      toast.success('Clocked out successfully')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to clock out')
    } finally {
      setIsPunching(false)
    }
  }, [api, perms.canSubmit])

  const openCorrection = useCallback((record: AttendanceRecord) => {
    setSelectedRecord(record)
    setIsCorrectionOpen(true)
  }, [])

  const closeCorrection = useCallback(() => {
    setIsCorrectionOpen(false)
    setTimeout(() => setSelectedRecord(null), 300)
  }, [])

  const submitCorrection = useCallback(
    async (data: CorrectionFormData) => {
      try {
        const correction = await api.requestCorrection(data)
        setCorrections((prev) => [correction, ...prev])
        toast.success('Correction request submitted')
        closeCorrection()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to submit correction')
      }
    },
    [api, closeCorrection],
  )

  const reviewCorrection = useCallback(
    async (id: string, decision: 'approved' | 'rejected') => {
      try {
        const updated = await api.reviewCorrection(id, decision)
        setCorrections((prev) => prev.map((c) => (c.id === id ? updated : c)))
        await loadData()
        toast.success(`Correction ${decision}`)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to review correction')
      }
    },
    [api, loadData],
  )

  const pendingCorrections = useMemo(
    () => corrections.filter((c) => c.status === 'pending'),
    [corrections],
  )

  return {
    todayRecord,
    records,
    stats,
    corrections,
    pendingCorrections,
    isLoading,
    isPunching,
    clockedIn,
    isCorrectionOpen,
    selectedRecord,
    perms,
    clockIn,
    clockOut,
    openCorrection,
    closeCorrection,
    submitCorrection,
    reviewCorrection,
    refresh: loadData,
  }
}
