import { CalendarClock } from 'lucide-react'
import { PageContainer } from '@/shared/components/layouts'
import { Meteors } from '@/shared/components/effects/meteors'
import { EmptyState } from '@/shared/components/premium/empty-state'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useAuth } from '@/shared/hooks/use-auth'
import { ROLE_LABELS } from '@/shared/constants'
import { useAttendanceStore } from '../hooks/use-attendance-store'
import { AttendanceHero } from '../components/attendance-hero'
import { AttendanceStatCards } from '../components/attendance-stat-cards'
import { ClockWidget } from '../components/clock-widget'
import { AttendanceHistoryTable } from '../components/attendance-history-table'
import { CorrectionModal } from '../components/correction-modal'
import { CorrectionsPanel } from '../components/corrections-panel'

function PageSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-40 w-full rounded-3xl" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-56 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  )
}

export function AttendancePage() {
  const { user } = useAuth()
  const store = useAttendanceStore()
  const { perms } = store

  return (
    <PageContainer className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden opacity-40">
        <Meteors number={10} />
      </div>

      <AttendanceHero
        firstName={user?.firstName ?? 'there'}
        roleLabel={user ? ROLE_LABELS[user.role] : ''}
        clockedIn={store.clockedIn}
      />

      {store.isLoading ? (
        <PageSkeleton />
      ) : (
        <>
          <AttendanceStatCards stats={store.stats} />

          <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <ClockWidget
                record={store.todayRecord}
                clockedIn={store.clockedIn}
                isPunching={store.isPunching}
                canSubmit={perms.canSubmit}
                onClockIn={() => void store.clockIn()}
                onClockOut={() => void store.clockOut()}
              />
            </div>

            <div className="lg:col-span-3">
              {store.pendingCorrections.length > 0 && (
                <div className="mb-5">
                  <CorrectionsPanel
                    corrections={store.pendingCorrections}
                    canManage={perms.canManage}
                    onReview={(id, decision) => void store.reviewCorrection(id, decision)}
                  />
                </div>
              )}

              <div>
                <h2 className="mb-3 text-sm font-semibold text-[var(--dw-color-ink-primary)]">
                  {perms.canViewAll ? 'Team Attendance' : 'My Attendance History'}
                </h2>
                {store.records.length === 0 ? (
                  <EmptyState
                    icon={CalendarClock}
                    title="No records yet"
                    description="Your attendance history will appear here once you start clocking in."
                  />
                ) : (
                  <AttendanceHistoryTable
                    records={store.records}
                    showEmployee={perms.canViewAll}
                    canRequestCorrection={!perms.canViewAll}
                    onRequestCorrection={store.openCorrection}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <CorrectionModal
        open={store.isCorrectionOpen}
        record={store.selectedRecord}
        onClose={store.closeCorrection}
        onSubmit={(data) => void store.submitCorrection(data)}
      />
    </PageContainer>
  )
}
