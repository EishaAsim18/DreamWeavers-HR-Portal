import { Suspense, lazy } from 'react'
import { createBrowserRouter, Link, Navigate, Outlet } from 'react-router-dom'
import { AppShell, PageContainer } from '@/shared/components/layouts'
import { PageLoader } from '@/shared/components/feedback'
import { ErrorState } from '@/shared/components/premium'
import { Button } from '@/shared/components/ui/button'
import { ProtectedRoute, RoleRoute, SuperAdminRoute } from '@/app/router/guards'
import { ROUTES } from '@/shared/constants'

const DashboardPage = lazy(() => import('@/features/dashboard/pages/dashboard-page').then((module) => ({ default: module.DashboardPage })))
const CalendarPage = lazy(() => import('@/features/calendar').then((module) => ({ default: module.CalendarPage })))
const TasksPage = lazy(() => import('@/features/tasks').then((module) => ({ default: module.TasksPage })))
const TaskDetailPage = lazy(() => import('@/features/tasks').then((module) => ({ default: module.TaskDetailPage })))
const EmployeesPage = lazy(() => import('@/features/employees').then((module) => ({ default: module.EmployeesPage })))
const EmployeeProfilePage = lazy(() => import('@/features/employees').then((module) => ({ default: module.EmployeeProfilePage })))
const TeamsPage = lazy(() => import('@/features/teams').then((module) => ({ default: module.TeamsPage })))
const TeamSpacePage = lazy(() => import('@/features/teams').then((module) => ({ default: module.TeamSpacePage })))
const AttendancePage = lazy(() => import('@/features/attendance').then((module) => ({ default: module.AttendancePage })))
const DocumentsPage = lazy(() => import('@/features/documents').then((module) => ({ default: module.DocumentsPage })))
const ReportsPage = lazy(() => import('@/features/reports').then((module) => ({ default: module.ReportsPage })))
const AdminManagementPage = lazy(() => import('@/features/admin-management').then((module) => ({ default: module.AdminManagementPage })))
const SettingsPage = lazy(() => import('@/features/settings').then((module) => ({ default: module.SettingsPage })))
const NotificationsPage = lazy(() => import('@/features/notifications').then((module) => ({ default: module.NotificationsPage })))
const ProfilePage = lazy(() => import('@/features/profile').then((module) => ({ default: module.ProfilePage })))
const AuthLayout = lazy(() => import('@/features/auth').then((module) => ({ default: module.AuthLayout })))
const ForgotPasswordPage = lazy(() => import('@/features/auth').then((module) => ({ default: module.ForgotPasswordPage })))
const LoginPage = lazy(() => import('@/features/auth').then((module) => ({ default: module.LoginPage })))
const SignupPage = lazy(() => import('@/features/auth').then((module) => ({ default: module.SignupPage })))

function AppLayout() {
  return (
    <ProtectedRoute>
      <AppShell>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </AppShell>
    </ProtectedRoute>
  )
}

function NotFoundPage() {
  return (
    <PageContainer>
      <ErrorState
        title="Page not found"
        description="This page doesn't exist or you may not have access. Use ⌘K to navigate anywhere in DreamWeavers."
        action={
          <Button asChild>
            <Link to={ROUTES.dashboard}>Back to dashboard</Link>
          </Button>
        }
      />
    </PageContainer>
  )
}

export const router = createBrowserRouter([
  // ── Public routes ────────────────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.login, element: <LoginPage /> },
      { path: ROUTES.signup, element: <SignupPage /> },
      { path: ROUTES.forgotPassword, element: <ForgotPasswordPage /> },
    ],
  },

  // ── Protected routes ─────────────────────────────────────────────────────
  {
    path: '/',
    element: <AppLayout />,
    children: [
      // First route is ALWAYS the login page. Already-authenticated users
      // are bounced from /login to the dashboard by LoginPage itself.
      { index: true, element: <Navigate to={ROUTES.login} replace /> },

      // Dashboard — all roles
      {
        path: ROUTES.dashboard.slice(1),
        element: <DashboardPage />,
      },

      // ── Employee directory (admin+) ──────────────────────────────────────
      {
        path: ROUTES.employees.slice(1),
        element: (
          <RoleRoute
            roles={['super_admin', 'admin']}
            permissions={['employees:read']}
            deniedMessage="Employee directory access requires HR or Super Admin role."
          >
            <EmployeesPage />
          </RoleRoute>
        ),
      },
      {
        path: 'employees/:id',
        element: (
          <RoleRoute
            roles={['super_admin', 'admin']}
            permissions={['employees:read']}
          >
            <EmployeeProfilePage />
          </RoleRoute>
        ),
      },

      // ── Attendance (all roles — scoped by permissions in the page) ───────
      {
        path: ROUTES.attendance.slice(1),
        element: (
          <RoleRoute permissions={['attendance:read_own', 'attendance:read_all']}>
            <AttendancePage />
          </RoleRoute>
        ),
      },

      // ── Tasks (all roles — scoped by permissions in the page) ────────────
      {
        path: ROUTES.tasks.slice(1),
        element: (
          <RoleRoute permissions={['tasks:read_own', 'tasks:read_all']}>
            <TasksPage />
          </RoleRoute>
        ),
      },
      {
        path: 'tasks/:id',
        element: (
          <RoleRoute permissions={['tasks:read_own', 'tasks:read_all']}>
            <TaskDetailPage />
          </RoleRoute>
        ),
      },

      // ── Calendar — all roles ─────────────────────────────────────────────
      {
        path: ROUTES.calendar.slice(1),
        element: <CalendarPage />,
      },

      // ── Teams (all roles read; write/delete scoped by permissions in the page) ──
      {
        path: ROUTES.teams.slice(1),
        element: (
          <RoleRoute permissions={['teams:read']}>
            <TeamsPage />
          </RoleRoute>
        ),
      },
      {
        path: 'teams/:id',
        element: <TeamSpacePage />,
      },

      // ── Documents — all roles (write gated in the page) ──────────────────
      {
        path: ROUTES.documents.slice(1),
        element: (
          <RoleRoute permissions={['documents:read']}>
            <DocumentsPage />
          </RoleRoute>
        ),
      },

      // ── Reports (admin+) ─────────────────────────────────────────────────
      {
        path: ROUTES.reports.slice(1),
        element: (
          <RoleRoute
            roles={['super_admin', 'admin']}
            permissions={['reports:read']}
            deniedMessage="Reports access requires Admin or Super Admin role."
          >
            <ReportsPage />
          </RoleRoute>
        ),
      },

      // ── Admin Management (super_admin ONLY) ──────────────────────────────
      {
        path: ROUTES.adminManagement.slice(1),
        element: (
          <SuperAdminRoute>
            <AdminManagementPage />
          </SuperAdminRoute>
        ),
      },

      // ── Settings (all roles — content scoped by role in the page) ────────
      {
        path: ROUTES.settings.slice(1),
        element: (
          <RoleRoute permissions={['settings:profile']}>
            <SettingsPage />
          </RoleRoute>
        ),
      },

      // ── Notifications — all roles ────────────────────────────────────────
      {
        path: ROUTES.notifications.slice(1),
        element: <NotificationsPage />,
      },

      // ── Profile (own) — all roles ────────────────────────────────────────
      {
        path: ROUTES.profile.slice(1),
        element: (
          <RoleRoute permissions={['profile:read']}>
            <ProfilePage />
          </RoleRoute>
        ),
      },

      // ── 404 ──────────────────────────────────────────────────────────────
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
