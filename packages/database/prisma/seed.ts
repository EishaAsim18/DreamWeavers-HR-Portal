import {
  PrismaClient,
  Role,
  NotificationCategory,
  AttendanceStatus,
  LeaveStatus,
  ApprovalType,
  ApprovalStatus,
  TaskStatus,
  TaskPriority,
  ReportCategory,
} from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const DEFAULT_PASSWORD = process.env.SEED_DEFAULT_PASSWORD ?? 'password123'
const SUPER_ADMIN_EMAIL = (process.env.SEED_ADMIN_EMAIL ?? 'dweavers788@gmail.com').toLowerCase()

async function main() {
  console.log('🌱 Seeding DreamWeavers HRMS database…')

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12)

  const org = await prisma.organization.upsert({
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
      organizationId_name: { organizationId: org.id, name: 'Executive' },
    },
    update: {},
    create: {
      organizationId: org.id,
      name: 'Executive',
      description: 'Leadership and strategy',
    },
  })

  const hr = await prisma.department.upsert({
    where: {
      organizationId_name: { organizationId: org.id, name: 'Human Resources' },
    },
    update: {},
    create: {
      organizationId: org.id,
      name: 'Human Resources',
      description: 'People operations and compliance',
    },
  })

  const engineering = await prisma.department.upsert({
    where: {
      organizationId_name: { organizationId: org.id, name: 'Engineering' },
    },
    update: {},
    create: {
      organizationId: org.id,
      name: 'Engineering',
      description: 'Product development',
    },
  })

  const superAdmin = await prisma.user.upsert({
    where: { email: SUPER_ADMIN_EMAIL },
    update: { passwordHash, role: Role.super_admin, status: 'active' },
    create: {
      organizationId: org.id,
      email: SUPER_ADMIN_EMAIL,
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
    update: {},
    create: {
      organizationId: org.id,
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
    update: {},
    create: {
      organizationId: org.id,
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

  const annualLeave = await prisma.leaveType.upsert({
    where: {
      organizationId_code: { organizationId: org.id, code: 'ANNUAL' },
    },
    update: {},
    create: {
      organizationId: org.id,
      name: 'Annual Leave',
      code: 'ANNUAL',
      defaultDays: 20,
      color: '#4A7C92',
    },
  })

  const sickLeave = await prisma.leaveType.upsert({
    where: {
      organizationId_code: { organizationId: org.id, code: 'SICK' },
    },
    update: {},
    create: {
      organizationId: org.id,
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
          leaveTypeId: annualLeave.id,
          year,
        },
      },
      update: {},
      create: {
        userId: user.id,
        leaveTypeId: annualLeave.id,
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
          leaveTypeId: sickLeave.id,
          year,
        },
      },
      update: {},
      create: {
        userId: user.id,
        leaveTypeId: sickLeave.id,
        year,
        allocated: 10,
        used: 0,
      },
    })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const clockIn = new Date(today)
  clockIn.setHours(9, 2, 0, 0)

  await prisma.attendanceRecord.upsert({
    where: {
      userId_date: { userId: employee.id, date: today },
    },
    update: {},
    create: {
      userId: employee.id,
      date: today,
      status: AttendanceStatus.present,
      clockIn,
      workMinutes: 0,
      punches: {
        create: { punchedAt: clockIn, type: 'in', source: 'web' },
      },
    },
  })

  const leaveStart = new Date()
  leaveStart.setDate(leaveStart.getDate() + 7)
  leaveStart.setHours(0, 0, 0, 0)

  const leaveEnd = new Date(leaveStart)
  leaveEnd.setDate(leaveEnd.getDate() + 4)

  const existingLeave = await prisma.leaveRequest.findFirst({
    where: {
      requesterId: employee.id,
      status: LeaveStatus.pending,
    },
  })

  if (!existingLeave) {
    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        requesterId: employee.id,
        leaveTypeId: annualLeave.id,
        reviewerId: admin.id,
        startDate: leaveStart,
        endDate: leaveEnd,
        totalDays: 5,
        reason: 'Family vacation',
        status: LeaveStatus.pending,
        approval: {
          create: {
            type: ApprovalType.leave,
            status: ApprovalStatus.pending,
            title: 'Leave request from Zara Malik',
            description: `Annual leave · ${formatDate(leaveStart)} – ${formatDate(leaveEnd)}`,
            requesterId: employee.id,
            assigneeId: admin.id,
          },
        },
      },
    })

    await prisma.notification.create({
      data: {
        userId: admin.id,
        category: NotificationCategory.approval,
        title: 'Leave request from Zara Malik',
        description: `Annual leave · ${formatDate(leaveStart)} – ${formatDate(leaveEnd)}`,
        href: '/attendance',
        metadata: { leaveRequestId: leaveRequest.id },
      },
    })
  }

  const project = await prisma.project.upsert({
    where: { id: 'seed-project-onboarding' },
    update: {},
    create: {
      id: 'seed-project-onboarding',
      organizationId: org.id,
      name: 'Q3 Onboarding',
      description: 'New hire onboarding documentation and tasks',
      color: '#4A7C92',
    },
  })

  const existingTask = await prisma.task.findFirst({
    where: { title: 'Review Q3 onboarding documentation' },
  })

  if (!existingTask) {
    await prisma.task.create({
      data: {
        title: 'Review Q3 onboarding documentation',
        description: 'Review and sign off on updated onboarding docs',
        status: TaskStatus.todo,
        priority: TaskPriority.medium,
        projectId: project.id,
        assigneeId: employee.id,
        createdById: admin.id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
    })

    await prisma.notification.create({
      data: {
        userId: employee.id,
        category: NotificationCategory.task,
        title: 'Task assigned to you',
        description: 'Review Q3 onboarding documentation',
        href: '/tasks',
      },
    })
  }

  const engineeringTeam = await prisma.team.upsert({
    where: {
      organizationId_name: { organizationId: org.id, name: 'Engineering' },
    },
    update: {},
    create: {
      organizationId: org.id,
      name: 'Engineering',
      description: 'Product engineering team',
      leadId: admin.id,
      members: {
        create: [
          { userId: employee.id, role: 'member' },
          { userId: admin.id, role: 'admin' },
        ],
      },
    },
  })

  await prisma.report.upsert({
    where: { id: 'seed-report-attendance' },
    update: {},
    create: {
      id: 'seed-report-attendance',
      organizationId: org.id,
      name: 'Monthly Attendance Summary',
      description: 'Headcount attendance breakdown by department',
      category: ReportCategory.attendance,
      queryConfig: { groupBy: 'department', period: 'month' },
    },
  })

  await prisma.auditLog.create({
    data: {
      organizationId: org.id,
      actorId: superAdmin.id,
      action: 'create',
      entityType: 'organization',
      entityId: org.id,
      summary: 'Database seeded with initial organization and users',
    },
  })

  console.log('✅ Seed complete')
  console.log('')
  console.log('Organization:', org.name)
  console.log('Departments:  Executive, Human Resources, Engineering')
  console.log('Team:         Engineering (' + engineeringTeam.name + ')')
  console.log('')
  console.log('Login accounts (password configured by environment):')
  console.log(`  ${SUPER_ADMIN_EMAIL}  — Super Admin`)
  console.log('  admin@dreamweavers.com       — Admin')
  console.log('  employee@dreamweavers.com    — Employee')
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-PK', {
    month: 'short',
    day: 'numeric',
  })
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
