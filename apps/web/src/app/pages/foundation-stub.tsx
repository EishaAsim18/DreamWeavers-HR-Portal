import {
  BarChart3,
  Bell,
  Calendar,
  CheckSquare,
  Clock,
  FolderOpen,
  LayoutDashboard,
  Network,
  Settings,
  Users,
  UserCog,
  Workflow,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PageContainer, PageHeader } from '@/shared/components/layouts'
import { StaggerContainer, StaggerItem } from '@/shared/components/motion'
import {
  BentoWidget,
  CalendarPreview,
  EmployeeTablePreview,
  EmptyState,
  FormPreview,
  KanbanPreview,
  PremiumCard,
  ReportsChartPreview,
} from '@/shared/components/premium'
import {
  AdminManagementIllustration,
  AttendanceIllustration,
  AutomationsIllustration,
  CalendarIllustration,
  EmployeesIllustration,
  ReportsIllustration,
  TasksIllustration,
} from '@/shared/components/illustrations'

const MODULE_META: Record<string, { icon: LucideIcon; description: string }> = {
  Dashboard:        { icon: LayoutDashboard, description: 'Your personalized command center for the day.' },
  Employees:        { icon: Users,           description: 'Manage your team directory, profiles, and onboarding.' },
  Attendance:       { icon: Clock,           description: 'Track presence, hours, and team attendance insights.' },
  Tasks:            { icon: CheckSquare,     description: 'Organize work with lists, boards, and deadlines.' },
  Calendar:         { icon: Calendar,        description: 'Schedule events, meetings, and leave in one view.' },
  Teams:            { icon: Network,         description: 'Collaborate in dedicated team spaces.' },
  Documents:        { icon: FolderOpen,      description: 'Store, share, and manage company files securely.' },
  Reports:          { icon: BarChart3,       description: 'Build insights and export data with confidence.' },
  Automations:      { icon: Workflow,        description: 'Automate workflows powered by n8n.' },
  Settings:         { icon: Settings,        description: 'Configure your organization and preferences.' },
  Profile:          { icon: Users,           description: 'Manage your personal profile and preferences.' },
  'Admin Management': { icon: UserCog,       description: 'Create and remove Admin accounts. Super Admin only.' },
  Notifications:    { icon: Bell,            description: 'View and manage your notifications.' },
}

// ── Illustration map ──────────────────────────────────────────────────────────
function ModuleIllustration({ module }: { module: string }) {
  const map: Record<string, React.ReactNode> = {
    'Employees':       <EmployeesIllustration />,
    'Employee Profile': <EmployeesIllustration />,
    'Attendance':      <AttendanceIllustration />,
    'Tasks':           <TasksIllustration />,
    'Task Detail':     <TasksIllustration />,
    'Calendar':        <CalendarIllustration />,
    'Reports':         <ReportsIllustration />,
    'Automations':     <AutomationsIllustration />,
    'Admin Management': <AdminManagementIllustration />,
  }
  return map[module] ? (
    <div className="flex items-center justify-center py-6">{map[module]}</div>
  ) : null
}

// ── Interactive preview cards ─────────────────────────────────────────────────
function ModulePreview({ module }: { module: string }) {
  switch (module) {
    case 'Tasks':
    case 'Task Detail':
      return (
        <BentoWidget title="Board preview" noPadding>
          <div className="p-5 pt-0"><KanbanPreview dimmed /></div>
        </BentoWidget>
      )
    case 'Calendar':
      return (
        <BentoWidget title="Calendar preview">
          <CalendarPreview dimmed />
        </BentoWidget>
      )
    case 'Employees':
    case 'Employee Profile':
      return (
        <BentoWidget title="Directory preview" noPadding>
          <div className="p-5 pt-0"><EmployeeTablePreview dimmed /></div>
        </BentoWidget>
      )
    case 'Reports':
      return (
        <BentoWidget title="Analytics preview">
          <ReportsChartPreview dimmed />
        </BentoWidget>
      )
    case 'Settings':
    case 'Profile':
      return (
        <BentoWidget title="Form preview">
          <FormPreview dimmed />
        </BentoWidget>
      )
    default:
      return null
  }
}

// ── Main export ───────────────────────────────────────────────────────────────
export function FoundationStub({ module }: { module: string }) {
  const meta = MODULE_META[module] ?? {
    icon: LayoutDashboard,
    description: 'This module is ready for feature implementation.',
  }

  const illustration = <ModuleIllustration module={module} />
  const preview = <ModulePreview module={module} />
  const hasRight = Boolean(illustration || preview)

  return (
    <PageContainer>
      <PageHeader title={module} description={meta.description} />
      <StaggerContainer className={hasRight ? 'grid gap-4 lg:grid-cols-2' : undefined}>
        {/* Left — empty state */}
        <StaggerItem>
          <PremiumCard className="overflow-hidden">
            <EmptyState
              icon={meta.icon}
              overline="Coming in Phase 2"
              title={`${module} is on the roadmap`}
              description="The shell, navigation, and design system are live. Full feature implementation begins next."
            />
            {illustration}
          </PremiumCard>
        </StaggerItem>

        {/* Right — interactive preview */}
        {preview && <StaggerItem>{preview}</StaggerItem>}
      </StaggerContainer>
    </PageContainer>
  )
}
