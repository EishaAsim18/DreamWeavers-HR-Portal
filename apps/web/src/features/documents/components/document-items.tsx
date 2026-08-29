import { motion } from 'framer-motion'
import {
  Download,
  Folder,
  Pencil,
  RotateCcw,
  Share2,
  Star,
  Trash2,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { DocumentFolder, WorkspaceDocument } from '../types/document.types'
import { DocumentIcon, formatDocumentDate, formatFileSize } from './document-icon'

interface DocumentActions {
  onOpen: (file: WorkspaceDocument) => void
  onStar: (id: string) => void
  onShare: (file: WorkspaceDocument) => void
  onDownload: (file: WorkspaceDocument) => void
  onTrash: (id: string) => void
  onRestore: (id: string) => void
  onDelete: (id: string) => void
  canWrite: boolean
  isTrash: boolean
}

function ActionButton({ label, onClick, children, danger }: { label: string; onClick: () => void; children: React.ReactNode; danger?: boolean }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      className={cn(
        'flex size-8 items-center justify-center rounded-lg border border-transparent text-[var(--dw-color-ink-tertiary)] transition-colors hover:border-[var(--dw-color-border-default)] hover:bg-[var(--dw-color-surface-base)] hover:text-[var(--dw-color-ink-primary)]',
        danger && 'hover:text-red-500',
      )}
    >
      {children}
    </button>
  )
}

export function FolderCard({
  folder,
  count,
  onOpen,
  onRename,
  onDelete,
  canWrite,
}: {
  folder: DocumentFolder
  count: number
  onOpen: () => void
  onRename: () => void
  onDelete: () => void
  canWrite: boolean
}) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
      className="group relative flex min-h-32 flex-col rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] p-4 text-left shadow-[var(--dw-shadow-xs)] transition-shadow hover:shadow-[var(--dw-shadow-md)]"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl" style={{ background: `${folder.color}18` }}>
          <Folder className="size-5" style={{ color: folder.color }} fill={`${folder.color}24`} />
        </div>
        {canWrite && (
          <div className="flex opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
            <ActionButton label="Rename folder" onClick={onRename}><Pencil className="size-3.5" /></ActionButton>
            <ActionButton label="Delete folder" onClick={onDelete} danger><Trash2 className="size-3.5" /></ActionButton>
          </div>
        )}
      </div>
      <div className="mt-auto pt-5">
        <p className="truncate text-sm font-semibold text-[var(--dw-color-ink-primary)]">{folder.name}</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-xs text-[var(--dw-color-ink-tertiary)]">{count} item{count === 1 ? '' : 's'}</span>
          {folder.team && <span className="truncate rounded-full bg-[var(--dw-color-surface-sunken)] px-2 py-0.5 text-[9px] font-semibold text-[var(--dw-color-ink-tertiary)]">{folder.team}</span>}
        </div>
      </div>
    </motion.div>
  )
}

function FileActions({ file, actions }: { file: WorkspaceDocument; actions: DocumentActions }) {
  if (actions.isTrash) {
    if (!actions.canWrite) return null
    return (
      <div className="flex items-center">
        <ActionButton label="Restore" onClick={() => actions.onRestore(file.id)}><RotateCcw className="size-3.5" /></ActionButton>
        <ActionButton label="Delete permanently" onClick={() => actions.onDelete(file.id)} danger><Trash2 className="size-3.5" /></ActionButton>
      </div>
    )
  }

  return (
    <div className="flex items-center">
      <ActionButton label={file.starred ? 'Remove from starred' : 'Add to starred'} onClick={() => actions.onStar(file.id)}>
        <Star className={cn('size-3.5', file.starred && 'fill-amber-400 text-amber-500')} />
      </ActionButton>
      {actions.canWrite && <ActionButton label="Share" onClick={() => actions.onShare(file)}><Share2 className="size-3.5" /></ActionButton>}
      <ActionButton label="Download" onClick={() => actions.onDownload(file)}><Download className="size-3.5" /></ActionButton>
      {actions.canWrite && <ActionButton label="Move to Trash" onClick={() => actions.onTrash(file.id)} danger><Trash2 className="size-3.5" /></ActionButton>}
    </div>
  )
}

export function DocumentCard({ file, actions }: { file: WorkspaceDocument; actions: DocumentActions }) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={() => actions.onOpen(file)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          actions.onOpen(file)
        }
      }}
      className="group relative flex min-h-44 flex-col overflow-hidden rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] text-left shadow-[var(--dw-shadow-xs)] transition-shadow hover:shadow-[var(--dw-shadow-md)]"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="relative flex min-h-24 items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--dw-color-surface-sunken)] to-[var(--dw-color-surface-base)]">
        {file.kind === 'image' && file.previewUrl ? (
          <img src={file.previewUrl} alt="" className="h-24 w-full object-cover" />
        ) : (
          <DocumentIcon kind={file.kind} className="size-14" />
        )}
        <div className="absolute right-2 top-2 flex rounded-xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)]/90 p-0.5 opacity-100 shadow-sm backdrop-blur transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          <FileActions file={file} actions={actions} />
        </div>
      </div>
      <div className="flex w-full min-w-0 flex-1 flex-col p-3.5">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--dw-color-ink-primary)]">{file.name}</p>
            <p className="mt-1 text-[11px] text-[var(--dw-color-ink-tertiary)]">{formatFileSize(file.size)} · {formatDocumentDate(file.updatedAt)}</p>
          </div>
          {file.starred && <Star className="mt-0.5 size-3.5 shrink-0 fill-amber-400 text-amber-500" />}
        </div>
        <div className="mt-auto flex items-center gap-2 pt-3">
          <span className="flex size-5 items-center justify-center rounded-full text-[8px] font-bold text-white" style={{ background: file.owner.color }}>{file.owner.initials}</span>
          <span className="truncate text-[10px] text-[var(--dw-color-ink-tertiary)]">{file.owner.name}</span>
          {file.sharedWith.length > 0 && <Share2 className="ml-auto size-3 text-[var(--dw-color-brand-primary)]" />}
        </div>
      </div>
    </motion.div>
  )
}

export function DocumentList({ files, actions }: { files: WorkspaceDocument[]; actions: DocumentActions }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead className="bg-[var(--dw-color-surface-sunken)]/70 text-[10px] font-semibold uppercase tracking-wider text-[var(--dw-color-ink-tertiary)]">
            <tr>
              <th className="px-4 py-3">Name</th><th className="px-3 py-3">Owner</th><th className="px-3 py-3">Updated</th><th className="px-3 py-3">Size</th><th className="px-3 py-3">Version</th><th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--dw-color-border-default)]">
            {files.map((file) => (
              <tr key={file.id} onClick={() => actions.onOpen(file)} className="cursor-pointer transition-colors hover:bg-[var(--dw-color-surface-sunken)]/60">
                <td className="px-4 py-3"><div className="flex items-center gap-3"><DocumentIcon kind={file.kind} className="size-9" /><div className="min-w-0"><p className="max-w-[270px] truncate text-sm font-medium text-[var(--dw-color-ink-primary)]">{file.name}</p><p className="text-[10px] uppercase text-[var(--dw-color-ink-tertiary)]">{file.extension}</p></div>{file.starred && <Star className="size-3.5 fill-amber-400 text-amber-500" />}</div></td>
                <td className="px-3 py-3"><div className="flex items-center gap-2"><span className="flex size-6 items-center justify-center rounded-full text-[8px] font-bold text-white" style={{ background: file.owner.color }}>{file.owner.initials}</span><span className="text-xs text-[var(--dw-color-ink-secondary)]">{file.owner.name}</span></div></td>
                <td className="px-3 py-3 text-xs text-[var(--dw-color-ink-tertiary)]">{formatDocumentDate(file.updatedAt)}</td>
                <td className="px-3 py-3 text-xs text-[var(--dw-color-ink-tertiary)]">{formatFileSize(file.size)}</td>
                <td className="px-3 py-3"><span className="rounded-full bg-[var(--dw-color-surface-sunken)] px-2 py-0.5 text-[10px] font-semibold text-[var(--dw-color-ink-secondary)]">v{file.version}</span></td>
                <td className="px-3 py-3"><div className="flex justify-end"><FileActions file={file} actions={actions} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
