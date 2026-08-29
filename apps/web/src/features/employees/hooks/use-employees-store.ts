import { useState, useCallback, useMemo, useEffect } from 'react'
import { toast } from 'sonner'
import type {
  Employee,
  EmployeeFilters,
  EmployeeFormData,
  EmployeesViewMode,
} from '../types/employee.types'
import { employeeFullName } from '../types/employee.types'
import { useEmployeePermissions } from './use-employee-permissions'
import { useEmployeesApi } from '../api/employees.api'

const DEFAULT_FILTERS: EmployeeFilters = {
  query: '',
  departments: [],
  roles: [],
  statuses: [],
}

export function useEmployeesStore() {
  const perms = useEmployeePermissions()
  const api = useEmployeesApi()

  // ── Server state ─────────────────────────────────────────────────────────
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ── UI state ──────────────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<EmployeesViewMode>('grid')
  const [filters, setFilters] = useState<EmployeeFilters>(DEFAULT_FILTERS)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // ── Initial data load ─────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true
    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const fetched = await api.fetchEmployees()
        if (!mounted) return
        setEmployees(fetched)
      } catch (e) {
        if (!mounted) return
        const msg = e instanceof Error ? e.message : 'Failed to load employees'
        setError(msg)
        toast.error(msg)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    void load()
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perms.userId])

  // ── Derived ───────────────────────────────────────────────────────────────
  const filteredEmployees = useMemo(() => {
    const q = filters.query.trim().toLowerCase()
    return employees.filter((e) => {
      if (q) {
        const haystack =
          `${e.firstName} ${e.lastName} ${e.email} ${e.jobTitle} ${e.department} ${e.location}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      if (filters.departments.length && !filters.departments.includes(e.department))
        return false
      if (filters.roles.length && !filters.roles.includes(e.role)) return false
      if (filters.statuses.length && !filters.statuses.includes(e.status)) return false
      return true
    })
  }, [employees, filters])

  const stats = useMemo(() => {
    const active = employees.filter((e) => e.status === 'active').length
    const hr = employees.filter((e) => e.role === 'admin').length
    const onLeave = employees.filter((e) => e.status === 'on_leave').length
    const departments = new Set(employees.map((e) => e.department)).size
    return { total: employees.length, active, hr, onLeave, departments }
  }, [employees])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.query.trim()) count++
    if (filters.departments.length) count++
    if (filters.roles.length) count++
    if (filters.statuses.length) count++
    return count
  }, [filters])

  // ── Drawer / form ─────────────────────────────────────────────────────────
  const openProfile = useCallback((employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDrawerOpen(true)
  }, [])

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false)
    setTimeout(() => setSelectedEmployee(null), 300)
  }, [])

  const openCreateForm = useCallback(() => {
    if (!perms.canCreateEmployee) {
      toast.error("You don't have permission to add employees.")
      return
    }
    setEditingEmployee(null)
    setIsFormOpen(true)
  }, [perms.canCreateEmployee])

  const openEditForm = useCallback(
    (employee: Employee) => {
      if (!perms.canEdit(employee)) {
        toast.error(
          employee.role === 'admin'
            ? 'Only the Super Admin can edit HR accounts.'
            : "You don't have permission to edit this record.",
        )
        return
      }
      setEditingEmployee(employee)
      setIsFormOpen(true)
    },
    [perms],
  )

  const closeForm = useCallback(() => {
    setIsFormOpen(false)
    setTimeout(() => setEditingEmployee(null), 300)
  }, [])

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const createEmployee = useCallback(
    async (data: EmployeeFormData) => {
      setIsSaving(true)
      try {
        const created = await api.createEmployee(data)
        setEmployees((prev) => [created, ...prev])
        toast.success(
          created.role === 'admin'
            ? `🛡️ HR account created for ${employeeFullName(created)}`
            : `🎉 ${employeeFullName(created)} added to the team`,
        )
        closeForm()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to add employee')
      } finally {
        setIsSaving(false)
      }
    },
    [api, closeForm], // eslint-disable-line react-hooks/exhaustive-deps
  )

  const updateEmployee = useCallback(
    async (id: string, updates: Partial<EmployeeFormData>) => {
      setIsSaving(true)
      try {
        const updated = await api.updateEmployee(id, updates)
        setEmployees((prev) => prev.map((e) => (e.id === id ? updated : e)))
        setSelectedEmployee((prev) => (prev?.id === id ? updated : prev))
        toast.success('Profile updated')
        closeForm()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to update employee')
      } finally {
        setIsSaving(false)
      }
    },
    [api, closeForm], // eslint-disable-line react-hooks/exhaustive-deps
  )

  const deleteEmployee = useCallback(
    async (employee: Employee) => {
      try {
        await api.deleteEmployee(employee.id)
        setEmployees((prev) => prev.filter((e) => e.id !== employee.id))
        closeDrawer()
        toast.success(`${employeeFullName(employee)} removed from directory`)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to remove employee')
      }
    },
    [api, closeDrawer], // eslint-disable-line react-hooks/exhaustive-deps
  )

  // ── Filters ───────────────────────────────────────────────────────────────
  const updateFilters = useCallback((updates: Partial<EmployeeFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }))
  }, [])

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), [])

  return {
    // Server state
    employees,
    isLoading,
    error,
    isSaving,
    // UI state
    viewMode,
    setViewMode,
    filters,
    selectedEmployee,
    isDrawerOpen,
    isFormOpen,
    editingEmployee,
    // Computed
    filteredEmployees,
    stats,
    activeFilterCount,
    // Handlers
    openProfile,
    closeDrawer,
    openCreateForm,
    openEditForm,
    closeForm,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    updateFilters,
    resetFilters,
    // Permissions
    perms,
  }
}
