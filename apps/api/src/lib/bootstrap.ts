import bcrypt from 'bcryptjs'
import { Role } from '@dreamweavers/database'
import { prisma } from './prisma.js'

export async function ensureSeedData(): Promise<void> {
  const password = process.env.SEED_DEFAULT_PASSWORD ?? 'change-this-before-deploying'
  const superAdminEmail = (process.env.SEED_ADMIN_EMAIL ?? process.env.ADMIN_EMAIL ?? 'dweavers788@gmail.com').toLowerCase()
  const passwordHash = await bcrypt.hash(password, 12)

  const organization = await prisma.organization.upsert({
    where: { slug: 'dreamweavers' },
    update: {},
    create: {
      name: 'DreamWeavers',
      slug: 'dreamweavers',
      timezone: 'Asia/Karachi',
      locale: 'en-PK',
      website: 'https://dreamweavers.com',
      settings: {
        create: {
          workWeekStart: 1,
          workDayStart: '09:00',
          workDayEnd: '18:00',
          lateThresholdMinutes: 15,
          defaultLeaveDaysPerYear: 20,
        },
      },
    },
  })

  const executive = await prisma.department.upsert({
    where: {
      organizationId_name: { organizationId: organization.id, name: 'Executive' },
    },
    update: {},
    create: {
      organizationId: organization.id,
      name: 'Executive',
      description: 'Leadership and strategy',
    },
  })

  const hr = await prisma.department.upsert({
    where: {
      organizationId_name: { organizationId: organization.id, name: 'Human Resources' },
    },
    update: {},
    create: {
      organizationId: organization.id,
      name: 'Human Resources',
      description: 'People operations and compliance',
    },
  })

  const engineering = await prisma.department.upsert({
    where: {
      organizationId_name: { organizationId: organization.id, name: 'Engineering' },
    },
    update: {},
    create: {
      organizationId: organization.id,
      name: 'Engineering',
      description: 'Product development',
    },
  })

  const superAdmin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: { passwordHash, role: Role.super_admin, status: 'active' },
    create: {
      organizationId: organization.id,
      email: superAdminEmail,
      passwordHash,
      firstName: 'Ayesha',
      lastName: 'Siddiqui',
      role: Role.super_admin,
      jobTitle: 'Chief Technology Officer',
      departmentId: executive.id,
    },
  })

  const admin = await prisma.user.upsert({
    where: { email: 'admin@dreamweavers.com' },
    update: { passwordHash, role: Role.admin, status: 'active' },
    create: {
      organizationId: organization.id,
      email: 'admin@dreamweavers.com',
      passwordHash,
      firstName: 'Omar',
      lastName: 'Farooq',
      role: Role.admin,
      jobTitle: 'HR Director',
      departmentId: hr.id,
      managerId: superAdmin.id,
    },
  })

  const employee = await prisma.user.upsert({
    where: { email: 'employee@dreamweavers.com' },
    update: { passwordHash, role: Role.employee, status: 'active' },
    create: {
      organizationId: organization.id,
      email: 'employee@dreamweavers.com',
      passwordHash,
      firstName: 'Zara',
      lastName: 'Malik',
      role: Role.employee,
      jobTitle: 'Software Engineer',
      departmentId: engineering.id,
      managerId: admin.id,
      hireDate: new Date('2024-03-15'),
    },
  })

  await prisma.department.update({
    where: { id: executive.id },
    data: { headId: superAdmin.id },
  })

  await prisma.department.update({
    where: { id: hr.id },
    data: { headId: admin.id },
  })

  await prisma.leaveType.upsert({
    where: {
      organizationId_code: { organizationId: organization.id, code: 'ANNUAL' },
    },
    update: {},
    create: {
      organizationId: organization.id,
      name: 'Annual Leave',
      code: 'ANNUAL',
      defaultDays: 20,
      color: '#4A7C92',
    },
  })

  await prisma.leaveType.upsert({
    where: {
      organizationId_code: { organizationId: organization.id, code: 'SICK' },
    },
    update: {},
    create: {
      organizationId: organization.id,
      name: 'Sick Leave',
      code: 'SICK',
      defaultDays: 10,
      color: '#E07A5F',
    },
  })

  const year = new Date().getFullYear()
  for (const user of [superAdmin, admin, employee]) {
    await prisma.leaveBalance.upsert({
      where: {
        userId_leaveTypeId_year: {
          userId: user.id,
          leaveTypeId: (await prisma.leaveType.findFirst({ where: { organizationId: organization.id, code: 'ANNUAL' } }))!.id,
          year,
        },
      },
      update: {},
      create: {
        userId: user.id,
        leaveTypeId: (await prisma.leaveType.findFirst({ where: { organizationId: organization.id, code: 'ANNUAL' } }))!.id,
        year,
        allocated: 20,
        used: user.id === employee.id ? 3 : 0,
        pending: user.id === employee.id ? 5 : 0,
      },
    })

    await prisma.leaveBalance.upsert({
      where: {
        userId_leaveTypeId_year: {
          userId: user.id,
          leaveTypeId: (await prisma.leaveType.findFirst({ where: { organizationId: organization.id, code: 'SICK' } }))!.id,
          year,
        },
      },
      update: {},
      create: {
        userId: user.id,
        leaveTypeId: (await prisma.leaveType.findFirst({ where: { organizationId: organization.id, code: 'SICK' } }))!.id,
        year,
        allocated: 10,
        used: 0,
      },
    })
  }
}
