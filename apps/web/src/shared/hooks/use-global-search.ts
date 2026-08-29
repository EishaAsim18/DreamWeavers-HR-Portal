import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { mockGlobalSearch } from '@/shared/api'
import { QUERY_KEYS } from '@/shared/constants'
import { useDebounce } from '@/shared/hooks/use-debounce'
import { useOverlay } from '@/shared/hooks/use-shell'
import { useKeyboardShortcut } from '@/shared/hooks/use-keyboard-shortcut'

export function useGlobalSearch() {
  const { activePanel, openPanel, closePanel } = useOverlay()
  const [query, setQuery] = useState('')

  const debouncedQuery = useDebounce(query, 300)

  const searchQuery = useQuery({
    queryKey: QUERY_KEYS.search(debouncedQuery),
    queryFn: () => mockGlobalSearch(debouncedQuery),
    enabled: activePanel === 'search' && debouncedQuery.length > 0,
  })

  useKeyboardShortcut('/', () => openPanel('search'))

  return {
    isOpen: activePanel === 'search',
    open: () => openPanel('search'),
    close: closePanel,
    query,
    setQuery,
    results: searchQuery.data ?? [],
    isSearching: searchQuery.isFetching,
  }
}
