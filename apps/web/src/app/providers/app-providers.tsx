import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/shared/components/ui/tooltip'
import { ErrorBoundary } from '@/shared/components/feedback'
import {
  AuthProvider,
  LoadingProvider,
  ModalProvider,
  OverlayProvider,
  SidebarProvider,
  ThemeProvider,
} from '@/shared/contexts'
import { queryClient } from '@/shared/lib/query-client'
import { router } from '@/app/router/routes'

export function AppProviders() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <LoadingProvider>
              <SidebarProvider>
                <OverlayProvider>
                  <ModalProvider>
                    <TooltipProvider>
                      <RouterProvider router={router} />
                      <Toaster
                        position="bottom-right"
                        toastOptions={{
                          classNames: {
                            toast:
                              'rounded-lg shadow-[var(--dw-shadow-lg)] border-none bg-[var(--dw-color-ink-primary)] text-white',
                          },
                        }}
                        closeButton
                        richColors
                      />
                    </TooltipProvider>
                  </ModalProvider>
                </OverlayProvider>
              </SidebarProvider>
            </LoadingProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
