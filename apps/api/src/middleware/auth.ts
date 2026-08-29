import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import { prisma } from '../lib/prisma.js'
import { getPermissions, hasAnyPermission, hasPermission, type Permission } from '../utils/permissions.js'
import { serializeUser, type ApiUser } from '../utils/serialize.js'

export interface AuthPayload {
  sub: string
  role: string
}

export interface AuthenticatedRequest extends Request {
  user?: ApiUser
}

export class AppError extends Error {
  constructor(
    message: string,
    readonly status = 400,
    readonly code?: string,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export async function authenticate(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      throw new AppError('Not authenticated.', 401, 'UNAUTHORIZED')
    }

    const token = header.slice(7)
    const payload = jwt.verify(token, config.jwtSecret) as AuthPayload

    const dbUser = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { department: true },
    })

    if (!dbUser || dbUser.status !== 'active') {
      throw new AppError('Not authenticated.', 401, 'UNAUTHORIZED')
    }

    req.user = serializeUser(dbUser)
    next()
  } catch (err) {
    if (err instanceof AppError) {
      next(err)
      return
    }
    next(new AppError('Invalid or expired token.', 401, 'UNAUTHORIZED'))
  }
}

export function requirePermission(...permissions: Permission[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Not authenticated.', 401, 'UNAUTHORIZED'))
      return
    }

    const userPerms = getPermissions(req.user.role)
    const allowed = permissions.length === 1
      ? hasPermission(userPerms, permissions[0])
      : hasAnyPermission(userPerms, permissions)

    if (!allowed) {
      next(new AppError('You do not have permission to perform this action.', 403, 'FORBIDDEN'))
      return
    }

    next()
  }
}
