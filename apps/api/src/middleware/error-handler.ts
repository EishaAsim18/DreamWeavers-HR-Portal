import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from './auth.js'

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.status).json({ message: err.message, code: err.code })
    return
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      message: err.issues[0]?.message ?? 'Invalid request.',
      code: 'VALIDATION_ERROR',
    })
    return
  }

  console.error(err)
  res.status(500).json({ message: 'Internal server error', code: 'INTERNAL_ERROR' })
}
