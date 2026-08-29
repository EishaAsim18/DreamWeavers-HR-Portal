import { StaggerContainer, StaggerItem } from '@/shared/components/motion'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { PremiumCard } from '@/shared/components/premium/premium-card'

export function PageLoader() {
  return (
    <div className="space-y-6 p-6" aria-busy="true" aria-label="Loading page">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-9 w-56 rounded-lg" />
        <Skeleton className="h-4 w-80 max-w-full rounded-md" />
      </div>
      <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StaggerItem key={i}>
            <PremiumCard className="p-5">
              <Skeleton className="size-9 rounded-lg" />
              <Skeleton className="mt-4 h-3 w-20 rounded-md" />
              <Skeleton className="mt-2 h-8 w-16 rounded-lg" />
            </PremiumCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
      <div className="grid gap-4 lg:grid-cols-2">
        <PremiumCard className="p-5">
          <Skeleton className="mb-4 h-4 w-32 rounded-md" />
          <Skeleton className="h-[220px] w-full rounded-xl" />
        </PremiumCard>
        <PremiumCard className="p-5">
          <Skeleton className="mb-4 h-4 w-32 rounded-md" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </PremiumCard>
      </div>
    </div>
  )
}
