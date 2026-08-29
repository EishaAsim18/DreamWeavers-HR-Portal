import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Users2 } from 'lucide-react'
import { PageContainer } from '@/shared/components/layouts'
import { AmbientBackground } from '@/shared/components/motion/motion-primitives'
import { Meteors } from '@/shared/components/effects/meteors'
import { useAuth } from '@/shared/hooks/use-auth'
import { useTeamsStore } from '../hooks/use-teams-store'
import { TeamsHeroBanner } from '../components/teams-decor'
import { TeamStatCards } from '../components/team-stat-cards'
import { TeamsToolbar } from '../components/teams-toolbar'
import { TeamCard } from '../components/team-card'
import { TeamDrawer } from '../components/team-drawer'
import { TeamFormModal } from '../components/team-form-modal'

function TeamsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-[220px] animate-pulse rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)]"
        />
      ))}
    </div>
  )
}

export function TeamsPage() {
  const navigate = useNavigate()
  const store = useTeamsStore()
  const { user } = useAuth()
  const { perms } = store

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.firstName ?? ''
  const roleLabel =
    perms.role === 'super_admin' ? '👑 Super Admin' : perms.role === 'admin' ? '🛡️ HR' : '👤 My Teams'

  const statsForCards = useMemo(
    () => ({
      totalTeams: store.stats.totalTeams,
      totalMembers: store.stats.totalMembers,
      managers: store.stats.managers,
      avgSize: store.stats.avgSize,
      unassigned: store.stats.unassigned,
    }),
    [store.stats],
  )

  return (
    <PageContainer className="relative">
      <AmbientBackground />
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
        <Meteors number={8} />
      </div>

      <TeamsHeroBanner
        greeting={greeting}
        firstName={firstName}
        roleLabel={roleLabel}
        teamCount={store.teams.length}
        isLoading={store.isLoading}
      />

      <TeamStatCards stats={statsForCards} />

      <div className="flex flex-col gap-3">
        <TeamsToolbar
          search={store.search}
          onSearchChange={store.setSearch}
          teamCount={store.filteredTeams.length}
          unassignedCount={store.stats.unassigned}
          canManageTeams={perms.canManageTeams}
          onNewTeam={store.openCreateForm}
        />

        <AnimatePresence mode="wait">
          {store.isLoading ? (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TeamsSkeleton />
            </motion.div>
          ) : store.filteredTeams.length === 0 ? (
            <motion.div
              key="empty"
              className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] py-20 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                className="flex size-20 items-center justify-center rounded-3xl border border-[var(--dw-color-border-default)] bg-gradient-to-br from-[#f3edfb] to-[var(--dw-color-surface-sunken)] shadow-lg"
                animate={{ rotate: [0, 5, -5, 0], y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Users2 className="size-8 text-[#7c3aed]" />
              </motion.div>
              <div>
                <p className="text-sm font-bold text-[var(--dw-color-ink-secondary)]">
                  {store.teams.length === 0 ? 'No teams yet' : 'No teams match your search'}
                </p>
                <p className="text-xs text-[var(--dw-color-ink-tertiary)]">
                  {store.teams.length === 0
                    ? 'Create your first team to start organizing the org.'
                    : 'Try a different name or clear your search.'}
                </p>
              </div>
              {perms.canManageTeams && store.teams.length === 0 && (
                <motion.button
                  onClick={store.openCreateForm}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] px-5 py-2.5 text-xs font-bold text-white shadow-[0_4px_14px_rgba(124,58,237,0.3)]"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Plus className="size-3.5" />
                  Create a team
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {store.filteredTeams.map((team, i) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  index={i}
                  canEdit={perms.canEditTeam(team)}
                  canDelete={perms.canDeleteTeam(team)}
                  isBusy={store.busyTeamIds.has(team.id)}
                  onOpen={(team) => navigate(`/teams/${team.id}`)}
                  onEdit={store.openEditForm}
                  onDelete={(t) => store.deleteTeam(t.id)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <TeamDrawer
        team={store.selectedTeam}
        isOpen={store.isDrawerOpen}
        onClose={store.closeDrawer}
        perms={perms}
        store={store}
      />

      <TeamFormModal
        isOpen={store.isFormOpen}
        onClose={store.closeForm}
        editingTeam={store.editingTeam}
        onCreate={store.createTeam}
        onUpdate={store.updateTeam}
      />
    </PageContainer>
  )
}
