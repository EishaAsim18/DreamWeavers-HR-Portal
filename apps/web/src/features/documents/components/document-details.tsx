import { AnimatePresence, motion } from 'framer-motion'
import {
  Clock3,
  Download,
  FolderInput,
  History,
  Lock,
  Pencil,
  Share2,
  Star,
  Trash2,
  X,
} from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import type { WorkspaceDocument } from '../types/document.types'
import { DocumentIcon, formatDocumentDate, formatFileSize } from './document-icon'

function DocumentPreview({ file }: { file: WorkspaceDocument }) {
  if (file.kind === 'image' && file.previewUrl) {
    return <img src={file.previewUrl} alt={file.name} className="max-h-64 w-full rounded-xl object-contain" />
  }

  if (file.kind === 'spreadsheet' || file.kind === 'csv') {
    return (
      <div className="w-full overflow-hidden rounded-xl border border-[var(--dw-color-border-default)] bg-white shadow-sm">
        <div className="grid grid-cols-4 bg-emerald-50 text-[8px] font-bold text-emerald-700"><span className="p-2">Employee</span><span className="p-2">Team</span><span className="p-2">Status</span><span className="p-2">Total</span></div>
        {['Ayesha Khan', 'Bilal Ahmed', 'Sana Malik', 'Raza Khan'].map((name, index) => (
          <div key={name} className="grid grid-cols-4 border-t border-slate-100 text-[8px] text-slate-500"><span className="truncate p-2">{name}</span><span className="p-2">{index % 2 ? 'People' : 'Ops'}</span><span className="p-2">Active</span><span className="p-2">{82 + index * 4}</span></div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full rounded-xl border border-[var(--dw-color-border-default)] bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
        <DocumentIcon kind={file.kind} />
        <div><p className="text-xs font-bold text-slate-800">{file.name.replace(/\.[^.]+$/, '')}</p><p className="text-[8px] uppercase tracking-widest text-slate-400">DreamWeavers HRMS</p></div>
      </div>
      <div className="space-y-2.5">
        <div className="h-2 w-5/6 rounded bg-slate-200" /><div className="h-2 w-full rounded bg-slate-100" /><div className="h-2 w-11/12 rounded bg-slate-100" /><div className="h-2 w-4/6 rounded bg-slate-100" />
        <div className="pt-2"><div className="h-2 w-3/4 rounded bg-slate-200" /><div className="mt-2 h-2 w-full rounded bg-slate-100" /><div className="mt-2 h-2 w-5/6 rounded bg-slate-100" /></div>
      </div>
    </div>
  )
}

export function DocumentDetails({
  file,
  canWrite,
  onClose,
  onStar,
  onDownload,
  onRename,
  onShare,
  onMove,
  onTrash,
  onRestore,
  onDelete,
}: {
  file: WorkspaceDocument | null
  canWrite: boolean
  onClose: () => void
  onStar: (id: string) => void
  onDownload: (file: WorkspaceDocument) => void
  onRename: (file: WorkspaceDocument) => void
  onShare: (file: WorkspaceDocument) => void
  onMove: (file: WorkspaceDocument) => void
  onTrash: (id: string) => void
  onRestore: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <AnimatePresence>
      {file && (
        <>
          <motion.button type="button" aria-label="Close document details" className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px]" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[460px] flex-col border-l border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] shadow-[var(--dw-shadow-xl)]"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 360, damping: 34 }}
          >
            <div className="flex items-center justify-between border-b border-[var(--dw-color-border-default)] px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
              <div className="min-w-0"><p className="truncate text-sm font-semibold text-[var(--dw-color-ink-primary)]">Document details</p><p className="text-[10px] text-[var(--dw-color-ink-tertiary)]">Version {file.version} · {formatFileSize(file.size)}</p></div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => onStar(file.id)} aria-label={file.starred ? 'Unstar document' : 'Star document'}><Star className={cn('size-4', file.starred && 'fill-amber-400 text-amber-500')} /></Button>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onClose} aria-label="Close"><X className="size-4" /></Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="flex min-h-72 items-center justify-center rounded-2xl border border-[var(--dw-color-border-default)] bg-gradient-to-br from-[var(--dw-color-surface-sunken)] to-[var(--dw-color-surface-base)] p-5">
                <DocumentPreview file={file} />
              </div>

              <div className="mt-5">
                <div className="flex items-start gap-3"><DocumentIcon kind={file.kind} /><div className="min-w-0"><h2 className="break-words text-base font-bold text-[var(--dw-color-ink-primary)]">{file.name}</h2><div className="mt-1 flex flex-wrap gap-1.5">{file.tags.map((tag) => <span key={tag} className="rounded-full bg-[var(--dw-color-surface-sunken)] px-2 py-0.5 text-[9px] font-medium text-[var(--dw-color-ink-tertiary)]">#{tag}</span>)}</div></div></div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)]/50 p-4 text-xs">
                <div><p className="text-[10px] uppercase tracking-wide text-[var(--dw-color-ink-tertiary)]">Owner</p><div className="mt-1.5 flex items-center gap-2"><span className="flex size-6 items-center justify-center rounded-full text-[8px] font-bold text-white" style={{ background: file.owner.color }}>{file.owner.initials}</span><span className="font-medium text-[var(--dw-color-ink-primary)]">{file.owner.name}</span></div></div>
                <div><p className="text-[10px] uppercase tracking-wide text-[var(--dw-color-ink-tertiary)]">Last updated</p><p className="mt-2 font-medium text-[var(--dw-color-ink-primary)]">{formatDocumentDate(file.updatedAt)}</p></div>
                <div><p className="text-[10px] uppercase tracking-wide text-[var(--dw-color-ink-tertiary)]">File type</p><p className="mt-2 font-medium uppercase text-[var(--dw-color-ink-primary)]">{file.extension}</p></div>
                <div><p className="text-[10px] uppercase tracking-wide text-[var(--dw-color-ink-tertiary)]">Access</p><p className="mt-2 flex items-center gap-1 font-medium text-[var(--dw-color-ink-primary)]"><Lock className="size-3" /> {file.sharedWith.length ? `${file.sharedWith.length} groups` : 'Private'}</p></div>
              </div>

              {file.sharedWith.length > 0 && <div className="mt-4"><p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--dw-color-ink-tertiary)]">Shared with</p><div className="flex flex-wrap gap-1.5">{file.sharedWith.map((target) => <span key={target} className="rounded-full border border-[var(--dw-color-brand-primary)]/20 bg-[var(--dw-color-brand-primary-muted)] px-2.5 py-1 text-[10px] font-semibold text-[var(--dw-color-brand-primary)]">{target}</span>)}</div></div>}

              <div className="mt-5"><p className="mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--dw-color-ink-tertiary)]"><History className="size-3.5" /> Version activity</p><div className="space-y-3 border-l border-[var(--dw-color-border-default)] pl-4">{[0, 1, 2].slice(0, Math.min(file.version, 3)).map((item) => <div key={item} className="relative"><span className="absolute -left-[19px] top-1 size-2 rounded-full bg-[var(--dw-color-brand-primary)] ring-2 ring-[var(--dw-color-surface-base)]" /><p className="text-xs font-medium text-[var(--dw-color-ink-primary)]">Version {file.version - item} {item === 0 && '· Current'}</p><p className="mt-0.5 flex items-center gap-1 text-[10px] text-[var(--dw-color-ink-tertiary)]"><Clock3 className="size-3" /> {item === 0 ? formatDocumentDate(file.updatedAt) : `${item + 1} weeks ago`} by {file.owner.name}</p></div>)}</div></div>
            </div>

            <div className="border-t border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              {file.status === 'trash' ? (
                canWrite ? <div className="grid grid-cols-2 gap-2"><Button variant="secondary" onClick={() => onRestore(file.id)}><History className="size-4" /> Restore</Button><Button variant="danger" onClick={() => onDelete(file.id)}><Trash2 className="size-4" /> Delete forever</Button></div> : <p className="py-2 text-center text-xs text-[var(--dw-color-ink-tertiary)]">Read-only access</p>
              ) : (
                <><div className={canWrite ? 'grid grid-cols-2 gap-2' : 'grid grid-cols-1 gap-2'}><Button onClick={() => onDownload(file)}><Download className="size-4" /> Download</Button>{canWrite && <Button variant="secondary" onClick={() => onShare(file)}><Share2 className="size-4" /> Share</Button>}</div>{canWrite && <div className="mt-2 grid grid-cols-3 gap-2"><Button variant="ghost" size="sm" onClick={() => onRename(file)}><Pencil className="size-3.5" /> Rename</Button><Button variant="ghost" size="sm" onClick={() => onMove(file)}><FolderInput className="size-3.5" /> Move</Button><Button variant="ghost" size="sm" className="text-red-500" onClick={() => onTrash(file.id)}><Trash2 className="size-3.5" /> Trash</Button></div>}</>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
