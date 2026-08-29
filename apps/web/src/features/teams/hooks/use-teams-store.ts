import { useState, useCallback, useMemo, useEffect } from 'react'
import { toast } from 'sonner'
import { CALENDAR_PEOPLE } from '@/features/calendar/data/calendar.mock'
import type { Team, TeamFormData, TeamMemberFormData } from '../types/team.types'
import { useTeamPermissions } from './use-team-permissions'
import { useTeamsApi } from '../api/teams.api'

export function useTeamsStore() {
  const perms = useTeamPermissions()
  const api = useTeamsApi()

  // ── Server state ─────────────────────────────────────────────────────────
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyTeamIds, setBusyTeamIds] = useState<Set<string>>(new Set())

  // ── UI state ──────────────────────────────────────────────────────────────
  const [search, setSearch] = useState('')
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)

  // ── Initial data load ─────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true
    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const fetched = await api.fetchTeams()
        if (!mounted) return
        setTeams(fetched)
      } catch (e) {
        if (!mounted) return
        const msg = e instanceof Error ? e.message : 'Failed to load teams'
        setError(msg)
        toast.error(msg)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    void load()
    return () => { mounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perms.userId])

  const setTeamBusy = (id: string, busy: boolean) => {
    setBusyTeamIds((prev) => {
      const next = new Set(prev)
      if (busy) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const refreshTeam = (updated: Team) => {
    setTeams((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
  }

  // ── Derived ───────────────────────────────────────────────────────────────
  const selectedTeam = useMemo(
    () => teams.find((t) => t.id === selectedTeamId) ?? null,
    [teams, selectedTeamId],
  )

  const filteredTeams = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return teams
    return teams.filter((t) => {
      if (t.name.toLowerCase().includes(q)) return true
      if (t.description.toLowerCase().includes(q)) return true
      return t.members.some((m) => {
        const person = CALENDAR_PEOPLE.find((p) => p.id === m.employeeId)
        return person?.name.toLowerCase().includes(q)
      })
    })
  }, [teams, search])

  const memberEmployeeIds = useMemo(
    () => new Set(teams.flatMap((t) => t.members.map((m) => m.employeeId))),
    [teams],
  )

  const unassignedPeople = useMemo(
    () => CALENDAR_PEOPLE.filter((p) => !memberEmployeeIds.has(p.id)),
    [memberEmployeeIds],
  )

  const stats = useMemo(() => {
    const totalMembers = teams.reduce((sum, t) => sum + t.members.length, 0)
    return {
      totalTeams: teams.length,
      totalMembers,
      managers: new Set(teams.map((t) => t.managerId)).size,
      avgSize: teams.length ? Math.round((totalMembers / teams.length) * 10) / 10 : 0,
      unassigned: unassignedPeople.length,
    }
  }, [teams, unassignedPeople])

  // ── Drawer / Form ─────────────────────────────────────────────────────────
  const openTeam = useCallback((team: Team) => {
    setSelectedTeamId(team.id)
    setIsDrawerOpen(true)
  }, [])

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false)
    setTimeout(() => setSelectedTeamId(null), 300)
  }, [])

  const openCreateForm = useCallback(() => {
    if (!perms.canManageTeams) {
      toast.error("You don't have permission to create teams.")
      return
    }
    setEditingTeam(null)
    setIsFormOpen(true)
  }, [perms.canManageTeams])

  const openEditForm = useCallback((team: Team) => {
    if (!perms.canEditTeam(team)) {
      toast.error("You don't have permission to edit this team.")
      return
    }
    setEditingTeam(team)
    setIsFormOpen(true)
  }, [perms])

  const closeForm = useCallback(() => {
    setIsFormOpen(false)
    setTimeout(() => setEditingTeam(null), 300)
  }, [])

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const createTeam = useCallback(async (data: TeamFormData) => {
    try {
      const created = await api.createTeam(data)
      setTeams((prev) => [created, ...prev])
      toast.success(`✅ ${created.name} created`)
      closeForm()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create team')
    }
  }, [api, closeForm])

  const updateTeam = useCallback(async (id: string, updates: Partial<Pick<TeamFormData, 'name' | 'description' | 'color'>>) => {
    setTeamBusy(id, true)
    try {
      const updated = await api.updateTeam(id, updates)
      refreshTeam(updated)
      toast.success('Team updated')
      closeForm()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update team')
    } finally {
      setTeamBusy(id, false)
    }
  }, [api, closeForm]) // eslint-disable-line react-hooks/exhaustive-deps

  const deleteTeam = useCallback(async (id: string) => {
    setTeamBusy(id, true)
    try {
      await api.deleteTeam(id)
      setTeams((prev) => prev.filter((t) => t.id !== id))
      closeDrawer()
      toast.success('Team deleted')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete team')
    } finally {
      setTeamBusy(id, false)
    }
  }, [api, closeDrawer])

  const addMember = useCallback(async (teamId: string, member: TeamMemberFormData) => {
    setTeamBusy(teamId, true)
    try {
      const updated = await api.addMember(teamId, member)
      refreshTeam(updated)
      toast.success('Member added to team')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to add member')
    } finally {
      setTeamBusy(teamId, false)
    }
  }, [api]) // eslint-disable-line react-hooks/exhaustive-deps

  const removeMember = useCallback(async (teamId: string, employeeId: string) => {
    setTeamBusy(teamId, true)
    try {
      const updated = await api.removeMember(teamId, employeeId)
      refreshTeam(updated)
      toast.success('Member removed from team')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to remove member')
    } finally {
      setTeamBusy(teamId, false)
    }
  }, [api]) // eslint-disable-line react-hooks/exhaustive-deps

  const changeManager = useCallback(async (teamId: string, newManagerId: string) => {
    setTeamBusy(teamId, true)
    try {
      const updated = await api.changeManager(teamId, newManagerId)
      refreshTeam(updated)
      toast.success('Manager updated')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to change manager')
    } finally {
      setTeamBusy(teamId, false)
    }
  }, [api]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateMemberRole = useCallback(async (teamId: string, employeeId: string, role: string) => {
    try {
      const updated = await api.updateMemberRole(teamId, employeeId, role)
      refreshTeam(updated)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update role')
    }
  }, [api]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // Server state
    teams,
    isLoading,
    error,
    busyTeamIds,
    // UI state
    search,
    setSearch,
    selectedTeam,
    isDrawerOpen,
    isFormOpen,
    editingTeam,
    // Computed
    filteredTeams,
    unassignedPeople,
    stats,
    // Handlers
    openTeam,
    closeDrawer,
    openCreateForm,
    openEditForm,
    closeForm,
    createTeam,
    updateTeam,
    deleteTeam,
    addMember,
    removeMember,
    changeManager,
    updateMemberRole,
    // Permissions
    perms,
  }
}
