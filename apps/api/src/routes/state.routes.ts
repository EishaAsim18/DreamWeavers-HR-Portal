import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { AppError, authenticate, type AuthenticatedRequest } from '../middleware/auth.js'

const stateValueSchema = z.object({
  value: z.string().max(1_500_000),
})

const sharedExactKeys = new Set([
  'dw-calendar-tasks',
  'dw-employees',
  'dw-teams',
  'dw_documents_files_v1',
  'dw_documents_folders_v1',
  'dw_custom_reports',
])

function validateKey(raw: string): string {
  let key: string
  try {
    key = decodeURIComponent(raw)
  } catch {
    throw new AppError('Invalid state key.', 400, 'INVALID_STATE_KEY')
  }
  if (!/^dw[-_:a-zA-Z0-9.]{1,190}$/.test(key)) {
    throw new AppError('Invalid state key.', 400, 'INVALID_STATE_KEY')
  }
  return key
}

function scopeForKey(key: string, userId: string): string {
  if (
    sharedExactKeys.has(key)
    || key.startsWith('dw_team_posts_')
    || key.startsWith('dw_subtasks_')
  ) {
    return 'organization'
  }
  return `user:${userId}`
}

export const stateRouter = Router()
stateRouter.use(authenticate)

stateRouter.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const rows = await prisma.clientState.findMany({
      where: {
        organizationId: req.user!.organizationId,
        scope: { in: ['organization', `user:${req.user!.id}`] },
      },
      select: { key: true, value: true, updatedAt: true },
    })
    res.json({ states: rows })
  } catch (error) {
    next(error)
  }
})

stateRouter.put('/:key', async (req: AuthenticatedRequest, res, next) => {
  try {
    const key = validateKey(req.params.key)
    const { value } = stateValueSchema.parse(req.body)
    const scope = scopeForKey(key, req.user!.id)
    const state = await prisma.clientState.upsert({
      where: {
        organizationId_scope_key: {
          organizationId: req.user!.organizationId,
          scope,
          key,
        },
      },
      update: { value },
      create: {
        organizationId: req.user!.organizationId,
        scope,
        key,
        value,
      },
      select: { key: true, updatedAt: true },
    })
    res.json(state)
  } catch (error) {
    next(error)
  }
})

stateRouter.delete('/:key', async (req: AuthenticatedRequest, res, next) => {
  try {
    const key = validateKey(req.params.key)
    const scope = scopeForKey(key, req.user!.id)
    await prisma.clientState.deleteMany({
      where: { organizationId: req.user!.organizationId, scope, key },
    })
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})
