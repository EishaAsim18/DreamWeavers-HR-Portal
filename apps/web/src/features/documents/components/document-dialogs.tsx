import { useEffect, useState } from 'react'
import { Check, Folder, Share2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/shared/lib/utils'
import type { DocumentFolder, WorkspaceDocument } from '../types/document.types'

export function NameDialog({
  open,
  title,
  description,
  label,
  initialValue = '',
  submitLabel,
  onClose,
  onSubmit,
}: {
  open: boolean
  title: string
  description: string
  label: string
  initialValue?: string
  submitLabel: string
  onClose: () => void
  onSubmit: (value: string) => void
}) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    if (open) setValue(initialValue)
  }, [initialValue, open])

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (!value.trim()) return
            onSubmit(value.trim())
            onClose()
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="document-name" className="mb-1.5 block text-xs font-semibold text-[var(--dw-color-ink-secondary)]">{label}</label>
            <Input id="document-name" value={value} onChange={(event) => setValue(event.target.value)} autoFocus />
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={!value.trim()}>{submitLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const SHARE_TARGETS = ['Everyone', 'HR Team', 'Managers', 'Finance', 'Leadership']

export function ShareDialog({
  file,
  onClose,
  onSave,
}: {
  file: WorkspaceDocument | null
  onClose: () => void
  onSave: (recipients: string[]) => void
}) {
  const [recipients, setRecipients] = useState<string[]>([])

  useEffect(() => {
    setRecipients(file?.sharedWith ?? [])
  }, [file])

  const toggle = (target: string) => {
    setRecipients((current) => current.includes(target) ? current.filter((item) => item !== target) : [...current, target])
  }

  return (
    <Dialog open={Boolean(file)} onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share document</DialogTitle>
          <DialogDescription>Choose who can view “{file?.name}”. Changes are applied immediately in this workspace.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {SHARE_TARGETS.map((target) => {
            const active = recipients.includes(target)
            return (
              <button
                key={target}
                type="button"
                onClick={() => toggle(target)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors',
                  active ? 'border-[var(--dw-color-brand-primary)]/40 bg-[var(--dw-color-brand-primary-muted)]' : 'border-[var(--dw-color-border-default)] hover:bg-[var(--dw-color-surface-sunken)]',
                )}
              >
                <span className={cn('flex size-8 items-center justify-center rounded-lg', active ? 'bg-[var(--dw-color-brand-primary)] text-white' : 'bg-[var(--dw-color-surface-sunken)] text-[var(--dw-color-ink-tertiary)]')}>
                  <Share2 className="size-4" />
                </span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-medium text-[var(--dw-color-ink-primary)]">{target}</span><span className="block text-[11px] text-[var(--dw-color-ink-tertiary)]">View and download access</span></span>
                <span className={cn('flex size-5 items-center justify-center rounded-full border', active ? 'border-[var(--dw-color-brand-primary)] bg-[var(--dw-color-brand-primary)] text-white' : 'border-[var(--dw-color-border-strong)]')}>
                  {active && <Check className="size-3" />}
                </span>
              </button>
            )
          })}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onSave(recipients); onClose() }}>Save access</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function MoveDialog({
  file,
  folders,
  onClose,
  onMove,
}: {
  file: WorkspaceDocument | null
  folders: DocumentFolder[]
  onClose: () => void
  onMove: (folderId: string | null) => void
}) {
  const [folderId, setFolderId] = useState<string | null>(null)

  useEffect(() => {
    setFolderId(file?.folderId ?? null)
  }, [file])

  return (
    <Dialog open={Boolean(file)} onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move document</DialogTitle>
          <DialogDescription>Select a destination for “{file?.name}”.</DialogDescription>
        </DialogHeader>
        <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
          {[{ id: null, name: 'Library root', color: '#4a7c92' }, ...folders].map((folder) => {
            const active = folderId === folder.id
            return (
              <button
                key={folder.id ?? 'root'}
                type="button"
                onClick={() => setFolderId(folder.id)}
                className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors', active ? 'bg-[var(--dw-color-brand-primary-muted)] text-[var(--dw-color-brand-primary)]' : 'hover:bg-[var(--dw-color-surface-sunken)]')}
              >
                <Folder className="size-4" style={{ color: folder.color }} />
                <span className="flex-1 text-sm font-medium">{folder.name}</span>
                {active && <Check className="size-4" />}
              </button>
            )
          })}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onMove(folderId); onClose() }}>Move here</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
