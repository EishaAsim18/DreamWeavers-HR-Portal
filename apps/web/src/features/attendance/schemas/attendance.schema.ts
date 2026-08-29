import { z } from 'zod'

export const correctionSchema = z.object({
  attendanceRecordId: z.string().min(1, 'Record is required'),
  reason: z.string().min(5, 'Please provide a reason (min 5 characters)'),
  requestedClockIn: z.string().optional(),
  requestedClockOut: z.string().optional(),
})

export type CorrectionSchema = z.infer<typeof correctionSchema>
