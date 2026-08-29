import { useCommandPalette } from '@/shared/hooks'
import {
  CommandDialog,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command'
import { Kbd } from '@/shared/components/ui/kbd'
import type { CommandItem as CommandItemType } from '@/shared/types'

const GROUP_LABELS: Record<CommandItemType['group'], string> = {
  recent: 'Recent',
  navigation: 'Navigation',
  action: 'Actions',
  people: 'People',
  ai: 'AI',
}

export function CommandPalette() {
  const { isOpen, close, commands, runCommand } = useCommandPalette()

  const groups = (['recent', 'navigation', 'action', 'people', 'ai'] as const).map(
    (group) => ({
      group,
      items: commands.filter((c) => c.group === group),
    }),
  )

  return (
    <CommandDialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <CommandInput placeholder="Search commands, pages, people…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {groups.map(
          ({ group, items }) =>
            items.length > 0 && (
              <CommandGroup key={group} heading={GROUP_LABELS[group]}>
                {items.map((item) => {
                  const Icon = item.icon
                  return (
                    <CommandItem
                      key={item.id}
                      value={[item.label, ...(item.keywords ?? [])].join(' ')}
                      onSelect={() => runCommand(item)}
                    >
                      {Icon && <Icon className="size-4" />}
                      <span>{item.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ),
        )}
      </CommandList>
      <CommandFooter>
        <span className="flex items-center gap-1">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> navigate
        </span>
        <span className="flex items-center gap-1">
          <Kbd>↵</Kbd> select · <Kbd>esc</Kbd> close
        </span>
      </CommandFooter>
    </CommandDialog>
  )
}
