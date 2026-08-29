import { Suspense } from 'react'
import { createBrowserRouter, Link, Navigate, Outlet } from 'react-router-dom'
import { AppShell, PageContainer } from '@/shared/components/layouts'
import { PageLoader } from '@/shared/components/feedback'
import { ErrorState } from '@/shared/components/premium'
import { Button } from '@/shared/components/ui/button'
import { ProtectedRoute, RoleRoute, SuperAdminRoute } from '@/app/router/guards'
import { ROUTES } from '@/shared/constants'
import { DashboardPage } from '@/features/dashboard/pages/dashboard-page'
import { CalendarPage } from '@/features/calendar'
import { TaskDetailPage, TasksPage } from '@/features/tasks'
import { EmployeeProfilePage, EmployeesPage } from '@/features/employees'
import { TeamSpacePage, TeamsPage } from '@/features/teams'
import { AttendancePage } from '@/features/attendance'
import { DocumentsPage } from '@/features/documents'
import { ReportsPage } from '@/features/reports'
import { AdminManagementPage } from '@/features/admin-management'
import { SettingsPage } from '@/features/settings'
import { NotificationsPage } from '@/features/notifications'
import { ProfilePage } from '@/features/profile'
import { AuthLayout, ForgotPasswordPage, LoginPage, SignupPage } from '@/features/auth'

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
