import { AnimatePresence } from 'framer-motion'
import { useLocation, Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/shared/lib/utils'
import { Navbar, type NavbarProps } from '@/shared/components/layouts/navbar'
import { AmbientBackground, PageTransition } from '@/shared/components/motion'
import { useSidebar } from '@/shared/hooks'
import { useIsMobile } from '@/shared/hooks/use-media-query'
import { ANIMATION } from '@/shared/constants'

export interface MainLayoutProps extends NavbarProps {
  children?: ReactNode
  className?: string
  contentClassName?: string
}

export function MainLayout({
  children,
  className,
  contentClassName,
  ...navbarProps
}: MainLayoutProps) {
  const { collapsed } = useSidebar()
  const isMobile = useIsMobile()
  const location = useLocation()

  // Below `md`: no sidebar in the layout flow (off-canvas drawer instead).
  // At/above `md`: matches the fixed sidebar's actual rendered width exactly.
  const sidebarOffset = isMobile
    ? 0
    : collapsed
      ? 'var(--dw-sidebar-collapsed-width)'
      : 'var(--dw-sidebar-width)'

  return (
    <div className="relative min-h-dvh min-w-0 overflow-x-clip">
      <AmbientBackground />
      <motion.div
        className={cn('relative flex min-h-dvh min-w-0 flex-col', className)}
        animate={{ marginLeft: sidebarOffset }}
        transition={{ duration: ANIMATION.slow, ease: [0.32, 0.72, 0, 1] }}
      >
        <Navbar {...navbarProps} />
        <main className={cn('relative min-w-0 flex-1', contentClassName)} id="main-content">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              {children ?? <Outlet />}
            </PageTransition>
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  )
}
