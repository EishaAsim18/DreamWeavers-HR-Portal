import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { STORAGE_KEYS } from '@/shared/constants'

interface LoadingContextValue {
  isGlobalLoading: boolean
  isNavigating: boolean
  setGlobalLoading: (loading: boolean) => void
  setNavigating: (navigating: boolean) => void
}

export const LoadingContext = createContext<LoadingContextValue | null>(null)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isGlobalLoading, setGlobalLoading] = useState(false)
  const [isNavigating, setNavigating] = useState(false)

  const value = useMemo(
    () => ({
      isGlobalLoading,
      isNavigating,
      setGlobalLoading,
      setNavigating,
    }),
    [isGlobalLoading, isNavigating],
  )

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
}

export function loadSidebarCollapsed(): boolean {
  return localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === 'true'
}

export function persistSidebarCollapsed(collapsed: boolean): void {
  localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, String(collapsed))
}

interface SidebarContextValue {
  collapsed: boolean
  mobileOpen: boolean
  toggleCollapsed: () => void
  setMobileOpen: (open: boolean) => void
}

export const SidebarContext = createContext<SidebarContextValue | null>(null)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(loadSidebarCollapsed)
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev
      persistSidebarCollapsed(next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ collapsed, mobileOpen, toggleCollapsed, setMobileOpen }),
    [collapsed, mobileOpen, toggleCollapsed],
  )

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export type OverlayPanel = 'command' | 'search' | 'notifications' | 'ai' | null

interface OverlayContextValue {
  activePanel: OverlayPanel
  openPanel: (panel: Exclude<OverlayPanel, null>) => void
  closePanel: () => void
  togglePanel: (panel: Exclude<OverlayPanel, null>) => void
}

export const OverlayContext = createContext<OverlayContextValue | null>(null)

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [activePanel, setActivePanel] = useState<OverlayPanel>(null)

  const openPanel = useCallback((panel: Exclude<OverlayPanel, null>) => {
    setActivePanel(panel)
  }, [])

  const closePanel = useCallback(() => {
    setActivePanel(null)
  }, [])

  const togglePanel = useCallback((panel: Exclude<OverlayPanel, null>) => {
    setActivePanel((prev) => (prev === panel ? null : panel))
  }, [])

  const value = useMemo(
    () => ({ activePanel, openPanel, closePanel, togglePanel }),
    [activePanel, openPanel, closePanel, togglePanel],
  )

  return <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>
}

interface ModalState {
  id: string
  title: string
  description?: string
  content?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'danger'
  onConfirm?: () => void | Promise<void>
}

interface ModalContextValue {
  modal: ModalState | null
  openModal: (state: Omit<ModalState, 'id'>) => void
  closeModal: () => void
}

export const ModalContext = createContext<ModalContextValue | null>(null)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState | null>(null)

  const openModal = useCallback((state: Omit<ModalState, 'id'>) => {
    setModal({ ...state, id: crypto.randomUUID() })
  }, [])

  const closeModal = useCallback(() => {
    setModal(null)
  }, [])

  const value = useMemo(
    () => ({ modal, openModal, closeModal }),
    [modal, openModal, closeModal],
  )

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}
