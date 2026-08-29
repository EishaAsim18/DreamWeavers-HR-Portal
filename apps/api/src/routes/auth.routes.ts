import { Router } from 'express'
import { z } from 'zod'
import { authenticate, type AuthenticatedRequest } from '../middleware/auth.js'
import * as authService from '../services/auth.service.js'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const registerSchema = z.object({
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

export const authRouter = Router()

authRouter.post('/login', async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body)
    const session = await authService.login(body.email, body.password)
    res.json(session)
  } catch (err) {
    next(err)
  }
})

authRouter.post('/register', async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body)
    const session = await authService.register(body)
    res.status(201).json(session)
  } catch (err) {
    next(err)
  }
})

authRouter.get('/me', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = await authService.getMe(req.user!.id)
    res.json(user)
  } catch (err) {
    next(err)
  }
})
