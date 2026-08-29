import { Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AuthBackground } from '@/features/auth/components/auth-background'
import { AuthBrandPanel } from '@/features/auth/components/auth-brand-panel'
import { HeroStatue } from '@/features/auth/components/hero-statue'

export function AuthLayout() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark'),
  )

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
  }

  return (
    <div className="relative min-h-dvh">
      <AuthBackground />

      <div className="relative grid min-h-dvh lg:grid-cols-2">
        {/* Brand panel — desktop only */}
        <div className="hidden border-r border-[var(--dw-color-border-default)]/40 bg-[var(--dw-color-surface-base)]/30 backdrop-blur-[2px] lg:block">
          <AuthBrandPanel />
        </div>

        {/* Form panel */}
        <div className="relative flex min-h-dvh min-w-0 flex-col items-center justify-start px-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(4rem,calc(env(safe-area-inset-top)+3.25rem))] min-[380px]:px-4 sm:justify-center sm:px-6 sm:py-10">
          {/* Top-right controls */}
          <div className="absolute right-3 top-[calc(env(safe-area-inset-top)+0.75rem)] flex items-center gap-2 sm:right-5 sm:top-5">
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="flex size-10 items-center justify-center rounded-xl border border-[var(--dw-color-border-default)]/60 bg-[var(--dw-color-surface-base)]/80 text-[var(--dw-color-ink-tertiary)] shadow-[var(--dw-shadow-xs)] backdrop-blur-sm transition-all hover:bg-[var(--dw-color-surface-base)] hover:text-[var(--dw-color-ink-primary)] hover:shadow-[var(--dw-shadow-sm)] sm:size-8"
            >
              {isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            </button>
          </div>

          {/* Mobile hero statue — clamps down on short screens so the form isn't pushed off */}
          <div className="mb-3 max-w-full overflow-hidden max-[359px]:hidden sm:mb-4 lg:hidden">
            <HeroStatue className="h-[clamp(72px,12vh,140px)] sm:h-[clamp(110px,15vh,200px)]" />
          </div>

          <Outlet />

          <p className="mt-5 text-center text-xs text-[var(--dw-color-ink-tertiary)] sm:mt-8 lg:hidden">
            © {new Date().getFullYear()} DreamWeavers
          </p>
        </div>
      </div>
    </div>
  )
}
