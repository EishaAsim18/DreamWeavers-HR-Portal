import {
  FileText,
  LayoutGrid,
  MessageSquare,
  Search,
  User,
} from 'lucide-react'
import { useGlobalSearch } from '@/shared/hooks'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command'
import { Badge } from '@/shared/components/ui/badge'
import type { SearchResult } from '@/shared/types'
import { useNavigate } from 'react-router-dom'

const TYPE_ICONS = {
  person: User,
  task: LayoutGrid,
  document: FileText,
  message: MessageSquare,
  page: Search,
} as const

export function GlobalSearch() {
  const navigate = useNavigate()
  const { isOpen, close, query, setQuery, results, isSearching } = useGlobalSearch()

  const handleSelect = (result: SearchResult) => {
    close()
    navigate(result.href)
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <CommandInput
        placeholder="Search everything…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {isSearching && query ? (
          <div className="py-6 text-center text-sm text-[var(--dw-color-ink-tertiary)]">
            Searching…
          </div>
        ) : (
          <>
            <CommandEmpty>
              {query ? 'No results found.' : 'Type to search across DreamWeavers'}
            </CommandEmpty>
            {results.length > 0 && (
              <CommandGroup heading="Results">
                {results.map((result) => {
                  const Icon = TYPE_ICONS[result.type]
                  return (
                    <CommandItem
                      key={result.id}
                      value={`${result.title} ${result.subtitle ?? ''}`}
                      onSelect={() => handleSelect(result)}
                    >
                      <Icon className="size-4" />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate">{result.title}</span>
                        {result.subtitle && (
                          <span className="truncate text-xs text-[var(--dw-color-ink-tertiary)]">
                            {result.subtitle}
                          </span>
                        )}
                      </div>
                      {result.meta && (
                        <Badge variant="muted" className="shrink-0">
                          {result.meta}
                        </Badge>
                      )}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
