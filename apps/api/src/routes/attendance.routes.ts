import { Router } from 'express'
import { z } from 'zod'
import { authenticate, requirePermission, type AuthenticatedRequest } from '../middleware/auth.js'
import * as attendanceService from '../services/attendance.service.js'

const correctionSchema = z.object({
  attendanceRecordId: z.string().min(1),
  reason: z.string().min(5),
  requestedClockIn: z.string().datetime().optional(),
  requestedClockOut: z.string().datetime().optional(),
})

const reviewSchema = z.object({
  decision: z.enum(['approved', 'rejected']),
  decisionNote: z.string().optional(),
})

export const attendanceRouter = Router()

attendanceRouter.use(authenticate)

attendanceRouter.get('/today', async (req: AuthenticatedRequest, res, next) => {
  try {
    const record = await attendanceService.getTodayRecord(req.user!)
    res.json(record)
  } catch (err) {
    next(err)
  }
})

attendanceRouter.get('/stats', async (req: AuthenticatedRequest, res, next) => {
  try {
    const month = req.query.month ? Number(req.query.month) : undefined
    const year = req.query.year ? Number(req.query.year) : undefined
    const stats = await attendanceService.getStats(req.user!, month, year)
    res.json(stats)
  } catch (err) {
    next(err)
  }
})

attendanceRouter.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const filters = {
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      userId: req.query.userId as string | undefined,
    }

    const records = req.query.all === 'true'
      ? await attendanceService.listAllRecords(req.user!, filters)
      : await attendanceService.listRecords(req.user!, filters)

    res.json(records)
  } catch (err) {
    next(err)
  }
})

attendanceRouter.post(
  '/clock-in',
  requirePermission('attendance:submit'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const record = await attendanceService.clockIn(req.user!)
      res.json(record)
    } catch (err) {
      next(err)
    }
  },
)

attendanceRouter.post(
  '/clock-out',
  requirePermission('attendance:submit'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const record = await attendanceService.clockOut(req.user!)
      res.json(record)
    } catch (err) {
      next(err)
    }
  },
)

attendanceRouter.get('/corrections', async (req: AuthenticatedRequest, res, next) => {
  try {
    const corrections = await attendanceService.listCorrections(req.user!)
    res.json(corrections)
  } catch (err) {
    next(err)
  }
})

attendanceRouter.post('/corrections', async (req: AuthenticatedRequest, res, next) => {
  try {
    const body = correctionSchema.parse(req.body)
    const correction = await attendanceService.requestCorrection(req.user!, body)
    res.status(201).json(correction)
  } catch (err) {
    next(err)
  }
})

attendanceRouter.patch(
  '/corrections/:id',
  requirePermission('attendance:manage'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const body = reviewSchema.parse(req.body)
      const correction = await attendanceService.reviewCorrection(
        req.user!,
        req.params.id,
        body.decision,
        body.decisionNote,
      )
      res.json(correction)
    } catch (err) {
      next(err)
    }
  },
)
