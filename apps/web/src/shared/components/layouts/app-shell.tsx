import type { ReactNode } from 'react'
import { Sidebar } from '@/shared/components/layouts/sidebar'
import { MainLayout, type MainLayoutProps } from '@/shared/components/layouts/main-layout'
import {
  AiAssistantDrawer,
  CommandPalette,
  GlobalSearch,
  ModalHost,
  NotificationDrawer,
} from '@/shared/components/overlays'
import { TopProgressBar } from '@/shared/components/feedback'

export interface AppShellProps extends MainLayoutProps {
  children: ReactNode
}

/**
 * Root application shell — sidebar, main layout, global overlays.
 * Wrap authenticated routes with this component.
 */
export function AppShell({ children, ...layoutProps }: AppShellProps) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[var(--dw-color-surface-base)] focus:px-4 focus:py-2 focus:shadow-[var(--dw-shadow-md)]"
      >
        Skip to main content
      </a>
      <TopProgressBar />
      <Sidebar />
      <MainLayout {...layoutProps}>{children}</MainLayout>
      <CommandPalette />
      <GlobalSearch />
      <NotificationDrawer />
      <AiAssistantDrawer />
      <ModalHost />
    </>
  )
}
