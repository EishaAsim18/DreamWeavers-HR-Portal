import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Clock,
  LogOut,
  Moon,
  Plus,
  Sun,
  Upload,
  UserPlus,
} from 'lucide-react'
import { MAIN_NAV, ROUTES, STORAGE_KEYS } from '@/shared/constants'
import { MOCK_USERS } from '@/shared/data/mock'
import { useAuth } from '@/shared/hooks/use-auth'
import { useOverlay } from '@/shared/hooks/use-shell'
import { useKeyboardShortcut } from '@/shared/hooks/use-keyboard-shortcut'
import { useTheme } from '@/shared/hooks/use-theme'
import type { CommandItem } from '@/shared/types'

const ACTION_COMMANDS: Omit<CommandItem, 'action'>[] = [
  {
    id: 'action-clock-in',
    label: 'Clock in',
    group: 'action',
    keywords: ['attendance', 'punch'],
    icon: Clock,
    href: ROUTES.attendance,
  },
  {
    id: 'action-new-task',
    label: 'New task',
    group: 'action',
    keywords: ['create', 'todo'],
    icon: Plus,
    href: ROUTES.tasks,
  },
  {
    id: 'action-upload',
    label: 'Upload document',
    group: 'action',
    keywords: ['file', 'document'],
    icon: Upload,
    href: ROUTES.documents,
  },
  {
    id: 'action-invite',
    label: 'Invite employee',
    group: 'action',
    keywords: ['hire', 'add'],
    icon: UserPlus,
    href: ROUTES.employees,
  },
]

function saveRecentCommand(id: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.recentCommands)
    const list: string[] = raw ? JSON.parse(raw) : []
    const next = [id, ...list.filter((x) => x !== id)].slice(0, 5)
    localStorage.setItem(STORAGE_KEYS.recentCommands, JSON.stringify(next))
  } catch {
    /* ignore */
  }
}

function loadRecentCommands(pool: CommandItem[]): CommandItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.recentCommands)
    const ids: string[] = raw ? JSON.parse(raw) : []
    const map = new Map(pool.map((c) => [c.id, c]))
    return ids
      .map((id) => map.get(id))
      .filter((c): c is CommandItem => Boolean(c))
      .map((c) => ({ ...c, group: 'recent' as const }))
  } catch {
    return []
  }
}

export function useCommandPalette() {
  const navigate = useNavigate()
  const { activePanel, openPanel, closePanel, togglePanel } = useOverlay()
  const { logout } = useAuth()
  const { resolvedTheme, setTheme } = useTheme()

  useKeyboardShortcut('k', () => togglePanel('command'), { meta: true, ctrl: true })

  const navigationCommands = useMemo<CommandItem[]>(() => {
    return MAIN_NAV.flatMap((section) =>
      section.items.map((item) => ({
        id: `nav-${item.id}`,
        label: item.label,
        group: 'navigation' as const,
        href: item.href,
        icon: item.icon,
        keywords: [item.label.toLowerCase()],
      })),
    )
  }, [])

  const peopleCommands = useMemo<CommandItem[]>(() => {
    return MOCK_USERS.map((user) => ({
      id: `person-${user.id}`,
      label: `${user.firstName} ${user.lastName}`,
      group: 'people' as const,
      href: ROUTES.employeeDetail(user.id),
      keywords: [user.email, user.department ?? ''],
    }))
  }, [])

  const actionCommands = useMemo<CommandItem[]>(() => {
    const themeCommand: CommandItem = {
      id: 'action-theme',
      label: resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
      group: 'action',
      icon: resolvedTheme === 'dark' ? Sun : Moon,
      action: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
    }

    const logoutCommand: CommandItem = {
      id: 'action-logout',
      label: 'Sign out',
      group: 'action',
      icon: LogOut,
      action: () => void logout(),
    }

    return [...ACTION_COMMANDS, themeCommand, logoutCommand]
  }, [resolvedTheme, setTheme, logout])

  const allCommands = useMemo(() => {
    const pool = [...navigationCommands, ...actionCommands, ...peopleCommands]
    return [...loadRecentCommands(pool), ...pool]
  }, [navigationCommands, actionCommands, peopleCommands])

  const runCommand = useCallback(
    (item: CommandItem) => {
      closePanel()

      if (item.action) {
        void item.action()
        return
      }

      if (item.href) {
        navigate(item.href)
        saveRecentCommand(item.id)
      }
    },
    [closePanel, navigate],
  )

  return {
    isOpen: activePanel === 'command',
    open: () => openPanel('command'),
    close: closePanel,
    toggle: () => togglePanel('command'),
    commands: allCommands,
    runCommand,
  }
}
