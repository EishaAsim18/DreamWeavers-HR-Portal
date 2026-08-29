import { AttendanceStatus, ApprovalStatus, ApprovalType } from '@dreamweavers/database'
import { prisma } from '../lib/prisma.js'
import { AppError } from '../middleware/auth.js'
import type { ApiUser } from '../utils/serialize.js'
import { parseTimeOnDate, startOfDay, toDateOnly } from '../utils/serialize.js'
import { hasPermission } from '../utils/permissions.js'

export interface AttendanceRecordDto {
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
  punches: {
    id: string
    punchedAt: string
    type: string
    source: string
  }[]
}

export interface AttendanceStatsDto {
  present: number
  absent: number
  late: number
  onLeave: number
  halfDay: number
  avgWorkMinutes: number
  totalRecords: number
}

function serializeRecord(
  record: {
    id: string
    userId: string
    date: Date
    status: AttendanceStatus
    clockIn: Date | null
    clockOut: Date | null
    workMinutes: number | null
    notes: string | null
    punches: { id: string; punchedAt: Date; type: string; source: string }[]
    user: {
      firstName: string
      lastName: string
      email: string
      department?: { name: string } | null
    }
  },
): AttendanceRecordDto {
  return {
    id: record.id,
    userId: record.userId,
    userName: `${record.user.firstName} ${record.user.lastName}`,
    userEmail: record.user.email,
    department: record.user.department?.name,
    date: toDateOnly(record.date),
    status: record.status,
    clockIn: record.clockIn?.toISOString() ?? null,
    clockOut: record.clockOut?.toISOString() ?? null,
    workMinutes: record.workMinutes,
    notes: record.notes,
    punches: record.punches.map((p) => ({
      id: p.id,
      punchedAt: p.punchedAt.toISOString(),
      type: p.type,
      source: p.source,
    })),
  }
}

const recordInclude = {
  punches: { orderBy: { punchedAt: 'asc' as const } },
  user: { include: { department: true } },
}

async function getOrgSettings(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { organization: { include: { settings: true } } },
  })
  return user?.organization.settings
}

function computeWorkMinutes(clockIn: Date, clockOut: Date): number {
  return Math.max(0, Math.round((clockOut.getTime() - clockIn.getTime()) / 60_000))
}

function determineStatus(clockIn: Date, workDayStart: string, lateThresholdMinutes: number): AttendanceStatus {
  const dayStart = startOfDay(clockIn)
  const expectedStart = parseTimeOnDate(workDayStart, dayStart)
  const lateCutoff = new Date(expectedStart.getTime() + lateThresholdMinutes * 60_000)
  return clockIn > lateCutoff ? AttendanceStatus.late : AttendanceStatus.present
}

async function getOrCreateTodayRecord(userId: string) {
  const today = startOfDay()
  let record = await prisma.attendanceRecord.findUnique({
    where: { userId_date: { userId, date: today } },
    include: recordInclude,
  })

  if (!record) {
    record = await prisma.attendanceRecord.create({
      data: {
        userId,
        date: today,
        status: AttendanceStatus.absent,
      },
      include: recordInclude,
    })
  }

  return record
}

export async function getTodayRecord(user: ApiUser): Promise<AttendanceRecordDto> {
  const record = await getOrCreateTodayRecord(user.id)
  return serializeRecord(record)
}

export async function clockIn(user: ApiUser): Promise<AttendanceRecordDto> {
  if (!hasPermission(user.permissions, 'attendance:submit')) {
    throw new AppError('You do not have permission to clock in.', 403, 'FORBIDDEN')
  }

  const now = new Date()
  const today = startOfDay(now)
  const settings = await getOrgSettings(user.id)

  let record = await prisma.attendanceRecord.findUnique({
    where: { userId_date: { userId: user.id, date: today } },
    include: recordInclude,
  })

  if (record?.clockIn && !record.clockOut) {
    throw new AppError('You are already clocked in. Please clock out first.', 400, 'ALREADY_CLOCKED_IN')
  }

  const status = determineStatus(
    now,
    settings?.workDayStart ?? '09:00',
    settings?.lateThresholdMinutes ?? 15,
  )

  if (!record) {
    record = await prisma.attendanceRecord.create({
      data: {
        userId: user.id,
        date: today,
        status,
        clockIn: now,
        workMinutes: 0,
        punches: { create: { punchedAt: now, type: 'in', source: 'web' } },
      },
      include: recordInclude,
    })
  } else {
    record = await prisma.attendanceRecord.update({
      where: { id: record.id },
      data: {
        status,
        clockIn: now,
        clockOut: null,
        workMinutes: 0,
        punches: { create: { punchedAt: now, type: 'in', source: 'web' } },
      },
      include: recordInclude,
    })
  }

  return serializeRecord(record)
}

export async function clockOut(user: ApiUser): Promise<AttendanceRecordDto> {
  if (!hasPermission(user.permissions, 'attendance:submit')) {
    throw new AppError('You do not have permission to clock out.', 403, 'FORBIDDEN')
  }

  const now = new Date()
  const today = startOfDay(now)

  const record = await prisma.attendanceRecord.findUnique({
    where: { userId_date: { userId: user.id, date: today } },
    include: { punches: true },
  })

  if (!record?.clockIn) {
    throw new AppError('You have not clocked in today.', 400, 'NOT_CLOCKED_IN')
  }

  if (record.clockOut) {
    throw new AppError('You have already clocked out today.', 400, 'ALREADY_CLOCKED_OUT')
  }

  const workMinutes = computeWorkMinutes(record.clockIn, now)

  const updated = await prisma.attendanceRecord.update({
    where: { id: record.id },
    data: {
      clockOut: now,
      workMinutes,
      punches: { create: { punchedAt: now, type: 'out', source: 'web' } },
    },
    include: recordInclude,
  })

  return serializeRecord(updated)
}

export async function listRecords(
  user: ApiUser,
  filters: { startDate?: string; endDate?: string; userId?: string },
): Promise<AttendanceRecordDto[]> {
  const canViewAll = hasPermission(user.permissions, 'attendance:read_all')
  const canViewOwn = hasPermission(user.permissions, 'attendance:read_own')

  if (!canViewAll && !canViewOwn) {
    throw new AppError('You do not have permission to view attendance.', 403, 'FORBIDDEN')
  }

  const targetUserId = canViewAll && filters.userId ? filters.userId : user.id

  if (targetUserId !== user.id && !canViewAll) {
    throw new AppError('You can only view your own attendance records.', 403, 'FORBIDDEN')
  }

  const where: {
    userId: string
    date?: { gte?: Date; lte?: Date }
  } = { userId: targetUserId }

  if (filters.startDate || filters.endDate) {
    where.date = {}
    if (filters.startDate) where.date.gte = new Date(filters.startDate)
    if (filters.endDate) where.date.lte = new Date(filters.endDate)
  }

  const records = await prisma.attendanceRecord.findMany({
    where,
    include: recordInclude,
    orderBy: { date: 'desc' },
    take: 90,
  })

  return records.map(serializeRecord)
}

export async function listAllRecords(
  user: ApiUser,
  filters: { startDate?: string; endDate?: string },
): Promise<AttendanceRecordDto[]> {
  if (!hasPermission(user.permissions, 'attendance:read_all')) {
    throw new AppError('You do not have permission to view all attendance.', 403, 'FORBIDDEN')
  }

  const where: { date?: { gte?: Date; lte?: Date } } = {}
  if (filters.startDate || filters.endDate) {
    where.date = {}
    if (filters.startDate) where.date.gte = new Date(filters.startDate)
    if (filters.endDate) where.date.lte = new Date(filters.endDate)
  }

  const records = await prisma.attendanceRecord.findMany({
    where,
    include: recordInclude,
    orderBy: [{ date: 'desc' }, { user: { firstName: 'asc' } }],
    take: 200,
  })

  return records.map(serializeRecord)
}

export async function getStats(
  user: ApiUser,
  month?: number,
  year?: number,
): Promise<AttendanceStatsDto> {
  const now = new Date()
  const targetMonth = month ?? now.getMonth() + 1
  const targetYear = year ?? now.getFullYear()

  const start = new Date(targetYear, targetMonth - 1, 1)
  const end = new Date(targetYear, targetMonth, 0)

  const canViewAll = hasPermission(user.permissions, 'attendance:read_all')
  const where = {
    userId: canViewAll ? undefined : user.id,
    date: { gte: start, lte: end },
  }

  const records = await prisma.attendanceRecord.findMany({ where })

  const stats: AttendanceStatsDto = {
    present: 0,
    absent: 0,
    late: 0,
    onLeave: 0,
    halfDay: 0,
    avgWorkMinutes: 0,
    totalRecords: records.length,
  }

  let totalWork = 0
  let workCount = 0

  for (const r of records) {
    switch (r.status) {
      case AttendanceStatus.present: stats.present++; break
      case AttendanceStatus.absent: stats.absent++; break
      case AttendanceStatus.late: stats.late++; break
      case AttendanceStatus.on_leave: stats.onLeave++; break
      case AttendanceStatus.half_day: stats.halfDay++; break
    }
    if (r.workMinutes) {
      totalWork += r.workMinutes
      workCount++
    }
  }

  stats.avgWorkMinutes = workCount > 0 ? Math.round(totalWork / workCount) : 0
  return stats
}

export interface CorrectionDto {
  id: string
  attendanceRecordId: string
  requesterId: string
  requesterName: string
  reason: string
  requestedClockIn: string | null
  requestedClockOut: string | null
  status: ApprovalStatus
  decisionNote: string | null
  createdAt: string
  recordDate: string
}

export async function requestCorrection(
  user: ApiUser,
  data: {
    attendanceRecordId: string
    reason: string
    requestedClockIn?: string
    requestedClockOut?: string
  },
): Promise<CorrectionDto> {
  const record = await prisma.attendanceRecord.findUnique({
    where: { id: data.attendanceRecordId },
  })

  if (!record) {
    throw new AppError('Attendance record not found.', 404, 'NOT_FOUND')
  }

  if (record.userId !== user.id && !hasPermission(user.permissions, 'attendance:manage')) {
    throw new AppError('You can only request corrections for your own records.', 403, 'FORBIDDEN')
  }

  const correction = await prisma.attendanceCorrection.create({
    data: {
      attendanceRecordId: data.attendanceRecordId,
      requesterId: user.id,
      reason: data.reason,
      requestedClockIn: data.requestedClockIn ? new Date(data.requestedClockIn) : undefined,
      requestedClockOut: data.requestedClockOut ? new Date(data.requestedClockOut) : undefined,
      approval: {
        create: {
          type: ApprovalType.attendance_correction,
          requesterId: user.id,
          status: ApprovalStatus.pending,
          title: 'Attendance Correction Request',
          description: data.reason,
        },
      },
    },
    include: {
      requester: true,
      attendanceRecord: true,
    },
  })

  return {
    id: correction.id,
    attendanceRecordId: correction.attendanceRecordId,
    requesterId: correction.requesterId,
    requesterName: `${correction.requester.firstName} ${correction.requester.lastName}`,
    reason: correction.reason,
    requestedClockIn: correction.requestedClockIn?.toISOString() ?? null,
    requestedClockOut: correction.requestedClockOut?.toISOString() ?? null,
    status: correction.status,
    decisionNote: correction.decisionNote,
    createdAt: correction.createdAt.toISOString(),
    recordDate: toDateOnly(correction.attendanceRecord.date),
  }
}

export async function reviewCorrection(
  user: ApiUser,
  correctionId: string,
  decision: 'approved' | 'rejected',
  decisionNote?: string,
): Promise<CorrectionDto> {
  if (!hasPermission(user.permissions, 'attendance:manage')) {
    throw new AppError('You do not have permission to review corrections.', 403, 'FORBIDDEN')
  }

  const correction = await prisma.attendanceCorrection.findUnique({
    where: { id: correctionId },
    include: { attendanceRecord: true, requester: true, approval: true },
  })

  if (!correction) {
    throw new AppError('Correction request not found.', 404, 'NOT_FOUND')
  }

  if (correction.status !== ApprovalStatus.pending) {
    throw new AppError('This correction has already been reviewed.', 400, 'ALREADY_REVIEWED')
  }

  const status = decision === 'approved' ? ApprovalStatus.approved : ApprovalStatus.rejected

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.attendanceCorrection.update({
      where: { id: correctionId },
      data: {
        status,
        reviewerId: user.id,
        decisionNote,
        decidedAt: new Date(),
      },
      include: { attendanceRecord: true, requester: true },
    })

    if (correction.approval) {
      await tx.approval.update({
        where: { id: correction.approval.id },
        data: {
          status,
          deciderId: user.id,
          decidedAt: new Date(),
          decisionNote,
        },
      })
    }

    if (decision === 'approved') {
      const record = correction.attendanceRecord
      const newClockIn = correction.requestedClockIn ?? record.clockIn
      const newClockOut = correction.requestedClockOut ?? record.clockOut
      const workMinutes =
        newClockIn && newClockOut ? computeWorkMinutes(newClockIn, newClockOut) : record.workMinutes

      await tx.attendanceRecord.update({
        where: { id: record.id },
        data: {
          clockIn: newClockIn,
          clockOut: newClockOut,
          workMinutes,
          status: record.status === AttendanceStatus.absent ? AttendanceStatus.present : record.status,
        },
      })
    }

    return result
  })

  return {
    id: updated.id,
    attendanceRecordId: updated.attendanceRecordId,
    requesterId: updated.requesterId,
    requesterName: `${updated.requester.firstName} ${updated.requester.lastName}`,
    reason: updated.reason,
    requestedClockIn: updated.requestedClockIn?.toISOString() ?? null,
    requestedClockOut: updated.requestedClockOut?.toISOString() ?? null,
    status: updated.status,
    decisionNote: updated.decisionNote,
    createdAt: updated.createdAt.toISOString(),
    recordDate: toDateOnly(updated.attendanceRecord.date),
  }
}

export async function listCorrections(user: ApiUser): Promise<CorrectionDto[]> {
  const canManage = hasPermission(user.permissions, 'attendance:manage')

  const corrections = await prisma.attendanceCorrection.findMany({
    where: canManage ? {} : { requesterId: user.id },
    include: { requester: true, attendanceRecord: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return corrections.map((c) => ({
    id: c.id,
    attendanceRecordId: c.attendanceRecordId,
    requesterId: c.requesterId,
    requesterName: `${c.requester.firstName} ${c.requester.lastName}`,
    reason: c.reason,
    requestedClockIn: c.requestedClockIn?.toISOString() ?? null,
    requestedClockOut: c.requestedClockOut?.toISOString() ?? null,
    status: c.status,
    decisionNote: c.decisionNote,
    createdAt: c.createdAt.toISOString(),
    recordDate: toDateOnly(c.attendanceRecord.date),
  }))
}
