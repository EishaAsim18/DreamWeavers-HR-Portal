import { UsersRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '@/shared/components/layouts'
import { Meteors } from '@/shared/components/effects/meteors'
import { EmptyState } from '@/shared/components/premium/empty-state'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useAuth } from '@/shared/hooks/use-auth'
import { ROLE_LABELS } from '@/shared/constants'
import { useEmployeesStore } from '../hooks/use-employees-store'
import { EmployeesHero } from '../components/employees-hero'
import { EmployeeStatCards } from '../components/employee-stat-cards'
import { EmployeesToolbar } from '../components/employees-toolbar'
import { EmployeeCard } from '../components/employee-card'
import { EmployeeTable } from '../components/employee-table'
import { EmployeeFormModal } from '../components/employee-form-modal'
import { EmployeeDrawer } from '../components/employee-drawer'

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] p-4"
        >
          <div className="flex items-start gap-3">
            <Skeleton className="size-12 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function EmployeesPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const store = useEmployeesStore()
  const { perms } = store

  const selected = store.selectedEmployee

  return (
    <PageContainer className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden opacity-40">
        <Meteors number={10} />
      </div>

      <EmployeesHero
        firstName={user?.firstName ?? 'there'}
        roleLabel={user ? ROLE_LABELS[user.role] : ''}
        totalCount={store.stats.total}
        canCreateEmployee={perms.canCreateEmployee}
        canCreateHR={perms.canCreateHR}
        onAddEmployee={store.openCreateForm}
      />

      <EmployeeStatCards stats={store.stats} />

      <EmployeesToolbar
        filters={store.filters}
        onFiltersChange={store.updateFilters}
        onReset={store.resetFilters}
        activeFilterCount={store.activeFilterCount}
        viewMode={store.viewMode}
        onViewModeChange={store.setViewMode}
        resultCount={store.filteredEmployees.length}
      />

      {store.isLoading ? (
        <GridSkeleton />
      ) : store.filteredEmployees.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          title="No team members found"
          description={
            store.activeFilterCount > 0
              ? 'No one matches the current filters. Try adjusting or resetting them.'
              : 'The directory is empty. Add your first team member to get started.'
          }
          action={
            store.activeFilterCount > 0 ? (
              <Button variant="secondary" onClick={store.resetFilters}>
                Reset filters
              </Button>
            ) : perms.canCreateEmployee ? (
              <Button onClick={store.openCreateForm}>Add member</Button>
            ) : undefined
          }
        />
      ) : store.viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {store.filteredEmployees.map((employee, i) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              index={i}
              canEdit={perms.canEdit(employee)}
              canDelete={perms.canDelete(employee)}
              onOpen={() => navigate(`/employees/${employee.id}`)}
              onEdit={() => store.openEditForm(employee)}
              onDelete={() => void store.deleteEmployee(employee)}
            />
          ))}
        </div>
      ) : (
        <EmployeeTable
          employees={store.filteredEmployees}
          canEdit={perms.canEdit}
          canDelete={perms.canDelete}
          onOpen={(employee) => navigate(`/employees/${employee.id}`)}
          onEdit={store.openEditForm}
          onDelete={(e) => void store.deleteEmployee(e)}
        />
      )}

      {/* Overlays */}
      <EmployeeDrawer
        employee={selected}
        open={store.isDrawerOpen}
        onClose={store.closeDrawer}
        canEdit={selected ? perms.canEdit(selected) : false}
        canDelete={selected ? perms.canDelete(selected) : false}
        onEdit={() => {
          if (selected) {
            store.closeDrawer()
            store.openEditForm(selected)
          }
        }}
        onDelete={() => {
          if (selected) void store.deleteEmployee(selected)
        }}
      />

      <EmployeeFormModal
        open={store.isFormOpen}
        onClose={store.closeForm}
        editingEmployee={store.editingEmployee}
        assignableRoles={perms.assignableRoles}
        isSaving={store.isSaving}
        onSubmit={(data) => {
          if (store.editingEmployee) {
            void store.updateEmployee(store.editingEmployee.id, data)
          } else {
            void store.createEmployee(data)
          }
        }}
      />
    </PageContainer>
  )
}
