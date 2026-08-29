import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { config } from '../config.js'
import { AppError } from '../middleware/auth.js'
import { serializeUser } from '../utils/serialize.js'

interface RegisterInput {
  firstName: string
  lastName: string
  email: string
  password: string
}

function createSession(user: ReturnType<typeof serializeUser>) {
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn },
  )

  return {
    user,
    accessToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60_000).toISOString(),
  }
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    include: { department: true },
  })

  if (!user) {
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS')
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS')
  }

  if (user.status !== 'active') {
    throw new AppError('Your account is not active.', 403, 'ACCOUNT_INACTIVE')
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  })

  return createSession(serializeUser(user))
}

export async function register(input: RegisterInput) {
  const email = input.email.trim().toLowerCase()
  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } })
  if (existing) {
    throw new AppError('An account with this email already exists.', 409, 'EMAIL_IN_USE')
  }

  const organization = await prisma.organization.findUnique({ where: { slug: 'dreamweavers' } })
  if (!organization) {
    throw new AppError('Organization setup is not complete.', 503, 'ORGANIZATION_UNAVAILABLE')
  }

  const department = await prisma.department.findFirst({
    where: { organizationId: organization.id, name: 'Engineering' },
  })
  const passwordHash = await bcrypt.hash(input.password, 12)
  const user = await prisma.user.create({
    data: {
      organizationId: organization.id,
      departmentId: department?.id,
      email,
      passwordHash,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      role: 'employee',
      status: 'active',
      onboardingStatus: 'in_progress',
    },
    include: { department: true },
  })

  return createSession(serializeUser(user))
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { department: true },
  })

  if (!user) {
    throw new AppError('User not found.', 404, 'NOT_FOUND')
  }

  return serializeUser(user)
}
