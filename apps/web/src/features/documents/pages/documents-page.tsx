import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  Files,
  Filter,
  Folder,
  FolderOpen,
  FolderPlus,
  Grid2X2,
  HardDrive,
  Home,
  List,
  Plus,
  Search,
  Share2,
  ShieldCheck,
  Star,
  Trash2,
  Upload,
  Users,
} from 'lucide-react'
import { PageContainer, PageHeader } from '@/shared/components/layouts'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { EmptyState } from '@/shared/components/premium/empty-state'
import { cn } from '@/shared/lib/utils'
import { useDocumentsStore } from '../hooks/use-documents-store'
import type { DocumentFolder, DocumentSection, WorkspaceDocument } from '../types/document.types'
import { DOCUMENT_ACCEPT, DOCUMENT_KIND_LABELS } from '../types/document.types'
import { DocumentCard, DocumentList, FolderCard } from '../components/document-items'
import { DocumentDetails } from '../components/document-details'
import { formatFileSize } from '../components/document-icon'
import { MoveDialog, NameDialog, ShareDialog } from '../components/document-dialogs'

const SECTIONS: { id: DocumentSection; label: string; icon: typeof FolderOpen }[] = [
  { id: 'library', label: 'My Library', icon: FolderOpen },
  { id: 'shared', label: 'Shared with me', icon: Users },
  { id: 'starred', label: 'Starred', icon: Star },
  { id: 'trash', label: 'Trash', icon: Trash2 },
]

function StatCard({ icon: Icon, label, value, hint, color }: { icon: typeof Files; label: string; value: string | number; hint: string; color: string }) {
  return (
    <motion.div className="flex items-center gap-3 rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] p-3.5 shadow-[var(--dw-shadow-xs)]" whileHover={{ y: -1 }}>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl" style={{ background: `${color}16`, color }}><Icon className="size-[18px]" /></div>
      <div className="min-w-0"><p className="text-lg font-bold leading-none text-[var(--dw-color-ink-primary)]">{value}</p><p className="mt-1 text-[11px] font-medium text-[var(--dw-color-ink-secondary)]">{label}</p><p className="truncate text-[9px] text-[var(--dw-color-ink-tertiary)]">{hint}</p></div>
    </motion.div>
  )
}

export function DocumentsPage() {
  const store = useDocumentsStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [newFolderOpen, setNewFolderOpen] = useState(false)
  const [renameFile, setRenameFile] = useState<WorkspaceDocument | null>(null)
  const [renameFolder, setRenameFolder] = useState<DocumentFolder | null>(null)
  const [shareFile, setShareFile] = useState<WorkspaceDocument | null>(null)
  const [moveFile, setMoveFile] = useState<WorkspaceDocument | null>(null)

  const currentSection = SECTIONS.find((item) => item.id === store.section) ?? SECTIONS[0]
  const CurrentSectionIcon = currentSection.icon
  const hasResults = store.visibleFolders.length > 0 || store.visibleDocuments.length > 0

  const confirmFolderDelete = (folder: DocumentFolder) => {
    if (window.confirm(`Move “${folder.name}” and its contents to Trash?`)) store.deleteFolder(folder.id)
  }

  const confirmPermanentDelete = (id: string) => {
    if (window.confirm('Permanently delete this document? This cannot be undone.')) store.deletePermanently(id)
  }

  const documentActions = {
    onOpen: store.openDocument,
    onStar: store.toggleStar,
    onShare: setShareFile,
    onDownload: store.downloadDocument,
    onTrash: store.moveToTrash,
    onRestore: store.restoreDocument,
    onDelete: confirmPermanentDelete,
    canWrite: store.canWrite,
    isTrash: store.section === 'trash',
  }

  return (
    <PageContainer className="relative">
      <input ref={inputRef} type="file" accept={DOCUMENT_ACCEPT} multiple className="hidden" onChange={(event) => { if (event.target.files) store.uploadFiles(event.target.files); event.target.value = '' }} />

      <PageHeader
        title="Documents"
        description="Store, share, and manage company files securely."
        actions={store.canWrite ? (
          <>
            <Button variant="secondary" onClick={() => setNewFolderOpen(true)}><FolderPlus className="size-4" /> New folder</Button>
            <Button onClick={() => inputRef.current?.click()}><Upload className="size-4" /> Upload</Button>
          </>
        ) : undefined}
      />

      <div className="mb-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <StatCard icon={Files} label="Documents" value={store.stats.files} hint="Active company files" color="#4a7c92" />
        <StatCard icon={Folder} label="Folders" value={store.stats.folders} hint="Organized workspaces" color="#7c3aed" />
        <StatCard icon={Share2} label="Shared" value={store.stats.shared} hint="Team-accessible files" color="#059669" />
        <StatCard icon={HardDrive} label="Storage" value={formatFileSize(store.stats.storageBytes)} hint="of 5 GB workspace" color="#d97706" />
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] p-2.5 shadow-[var(--dw-shadow-sm)] lg:sticky lg:top-[calc(var(--dw-navbar-height)+1rem)]">
          <nav className="grid grid-cols-2 gap-1 lg:grid-cols-1" aria-label="Document sections">
            {SECTIONS.map((item) => {
              const Icon = item.icon
              const active = store.section === item.id
              const count = item.id === 'shared' ? store.documents.filter((file) => file.status === 'active' && file.sharedWithMe).length : item.id === 'starred' ? store.stats.starred : item.id === 'trash' ? store.documents.filter((file) => file.status === 'trash').length : store.stats.files
              return (
                <button key={item.id} type="button" onClick={() => store.setSection(item.id)} className={cn('flex min-w-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition-colors', active ? 'bg-[var(--dw-color-brand-primary-muted)] text-[var(--dw-color-brand-primary)]' : 'text-[var(--dw-color-ink-secondary)] hover:bg-[var(--dw-color-surface-sunken)]')}>
                  <Icon className="size-4 shrink-0" /><span className="truncate">{item.label}</span><span className={cn('ml-auto rounded-full px-1.5 py-0.5 text-[9px]', active ? 'bg-[var(--dw-color-brand-primary)] text-white' : 'bg-[var(--dw-color-surface-sunken)] text-[var(--dw-color-ink-tertiary)]')}>{count}</span>
                </button>
              )
            })}
          </nav>

          <div className="mt-3 hidden border-t border-[var(--dw-color-border-default)] pt-3 lg:block">
            <div className="mb-2 flex items-center justify-between px-2"><p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--dw-color-ink-tertiary)]">Folders</p>{store.canWrite && <button type="button" onClick={() => setNewFolderOpen(true)} className="text-[var(--dw-color-ink-tertiary)] hover:text-[var(--dw-color-brand-primary)]" aria-label="Create folder"><Plus className="size-3.5" /></button>}</div>
            <button type="button" onClick={() => store.openFolder(null)} className={cn('mb-0.5 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors', store.section === 'library' && !store.currentFolderId ? 'bg-[var(--dw-color-surface-sunken)] font-semibold text-[var(--dw-color-ink-primary)]' : 'text-[var(--dw-color-ink-secondary)] hover:bg-[var(--dw-color-surface-sunken)]')}><Home className="size-3.5" /> Library root</button>
            <div className="max-h-[330px] overflow-y-auto">
              {store.folders.filter((folder) => folder.parentId === null).map((folder) => (
                <div key={folder.id}>
                  <button type="button" onClick={() => store.openFolder(folder.id)} className={cn('flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors', store.currentFolderId === folder.id ? 'bg-[var(--dw-color-brand-primary-muted)] font-semibold text-[var(--dw-color-brand-primary)]' : 'text-[var(--dw-color-ink-secondary)] hover:bg-[var(--dw-color-surface-sunken)]')}><Folder className="size-3.5 shrink-0" style={{ color: folder.color }} /><span className="truncate">{folder.name}</span><span className="ml-auto text-[9px] text-[var(--dw-color-ink-tertiary)]">{store.folderItemCount(folder.id)}</span></button>
                  {store.folders.filter((child) => child.parentId === folder.id).map((child) => <button key={child.id} type="button" onClick={() => store.openFolder(child.id)} className={cn('flex w-full items-center gap-2 rounded-lg py-1.5 pl-7 pr-2 text-left text-[11px] transition-colors', store.currentFolderId === child.id ? 'bg-[var(--dw-color-brand-primary-muted)] font-semibold text-[var(--dw-color-brand-primary)]' : 'text-[var(--dw-color-ink-tertiary)] hover:bg-[var(--dw-color-surface-sunken)]')}><Folder className="size-3" style={{ color: child.color }} /><span className="truncate">{child.name}</span></button>)}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 hidden rounded-xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)]/60 p-3 lg:block">
            <div className="flex items-center gap-2"><ShieldCheck className="size-4 text-emerald-500" /><p className="text-[10px] font-semibold text-[var(--dw-color-ink-primary)]">Secure workspace</p></div>
            <p className="mt-1 text-[9px] leading-relaxed text-[var(--dw-color-ink-tertiary)]">Files are private unless explicitly shared.</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--dw-color-border-default)]"><div className="h-full rounded-full bg-[var(--dw-color-brand-primary)]" style={{ width: `${Math.min(100, store.stats.storageBytes / (5 * 1024 * 1024 * 1024) * 100)}%`, minWidth: '4%' }} /></div>
          </div>
        </aside>

        <section
          className="relative min-w-0"
          onDragEnter={(event) => { event.preventDefault(); if (store.canWrite) setDragging(true) }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false) }}
          onDrop={(event) => { event.preventDefault(); setDragging(false); if (event.dataTransfer.files.length) store.uploadFiles(event.dataTransfer.files) }}
        >
          <AnimatePresence>{dragging && <motion.div className="absolute inset-0 z-30 flex min-h-72 items-center justify-center rounded-2xl border-2 border-dashed border-[var(--dw-color-brand-primary)] bg-[var(--dw-color-brand-primary-muted)]/95 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="text-center"><div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[var(--dw-color-brand-primary)] text-white shadow-[var(--dw-shadow-brand)]"><Upload className="size-6" /></div><p className="mt-3 text-sm font-bold text-[var(--dw-color-ink-primary)]">Drop files to upload</p><p className="mt-1 text-xs text-[var(--dw-color-ink-secondary)]">PDF, DOCX, XLSX, PNG, JPG or CSV · 25MB max</p></div></motion.div>}</AnimatePresence>

          <div className="mb-3 space-y-3 rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] p-3 shadow-[var(--dw-shadow-sm)]">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[180px] flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--dw-color-ink-tertiary)]" /><Input value={store.query} onChange={(event) => store.setQuery(event.target.value)} placeholder="Search documents, owners, or tags…" className="pl-9" /></div>
              <div className="relative"><Filter className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[var(--dw-color-ink-tertiary)]" /><select value={store.typeFilter} onChange={(event) => store.setTypeFilter(event.target.value as typeof store.typeFilter)} className="h-9 rounded-lg border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] pl-8 pr-7 text-xs text-[var(--dw-color-ink-secondary)] outline-none focus:border-[var(--dw-color-brand-primary)]"><option value="all">All types</option>{Object.entries(DOCUMENT_KIND_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
              <select value={store.sort} onChange={(event) => store.setSort(event.target.value as typeof store.sort)} className="h-9 rounded-lg border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] px-2.5 text-xs text-[var(--dw-color-ink-secondary)] outline-none focus:border-[var(--dw-color-brand-primary)]"><option value="updated">Recently updated</option><option value="name">Name A–Z</option><option value="size">Largest first</option></select>
              <div className="flex items-center rounded-lg border border-[var(--dw-color-border-default)] p-0.5"><button type="button" onClick={() => store.setView('grid')} className={cn('flex size-8 items-center justify-center rounded-md', store.view === 'grid' ? 'bg-[var(--dw-color-brand-primary)] text-white' : 'text-[var(--dw-color-ink-tertiary)] hover:bg-[var(--dw-color-surface-sunken)]')} aria-label="Grid view"><Grid2X2 className="size-3.5" /></button><button type="button" onClick={() => store.setView('list')} className={cn('flex size-8 items-center justify-center rounded-md', store.view === 'list' ? 'bg-[var(--dw-color-brand-primary)] text-white' : 'text-[var(--dw-color-ink-tertiary)] hover:bg-[var(--dw-color-surface-sunken)]')} aria-label="List view"><List className="size-3.5" /></button></div>
            </div>

            <div className="flex min-w-0 items-center gap-1 overflow-x-auto text-xs no-scrollbar">
              {store.section === 'library' ? <><button type="button" onClick={() => store.openFolder(null)} className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[var(--dw-color-ink-tertiary)] hover:bg-[var(--dw-color-surface-sunken)]"><Home className="size-3" /> Library</button>{store.breadcrumb.map((folder) => <span key={folder.id} className="flex shrink-0 items-center gap-1"><ChevronRight className="size-3 text-[var(--dw-color-ink-tertiary)]" /><button type="button" onClick={() => store.openFolder(folder.id)} className="max-w-40 truncate rounded-lg px-2 py-1 font-medium text-[var(--dw-color-ink-secondary)] hover:bg-[var(--dw-color-surface-sunken)]">{folder.name}</button></span>)}</> : <span className="flex items-center gap-2 px-2 py-1 font-semibold text-[var(--dw-color-ink-secondary)]"><CurrentSectionIcon className="size-3.5" /> {currentSection.label}</span>}
              <span className="ml-auto shrink-0 text-[10px] text-[var(--dw-color-ink-tertiary)]">{store.visibleFolders.length + store.visibleDocuments.length} items</span>
            </div>
          </div>

          <AnimatePresence>
            {store.uploadQueue.length > 0 && <motion.div className="mb-3 space-y-2 rounded-2xl border border-[var(--dw-color-brand-primary)]/20 bg-[var(--dw-color-brand-primary-muted)]/50 p-3" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><p className="text-[10px] font-bold uppercase tracking-wider text-[var(--dw-color-brand-primary)]">Uploading</p>{store.uploadQueue.map((item) => <div key={item.id}><div className="mb-1 flex items-center justify-between gap-2"><span className="truncate text-xs font-medium text-[var(--dw-color-ink-primary)]">{item.name}</span><span className="text-[10px] text-[var(--dw-color-ink-tertiary)]">{item.progress}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-[var(--dw-color-border-default)]"><motion.div className="h-full rounded-full bg-[var(--dw-color-brand-primary)]" animate={{ width: `${item.progress}%` }} /></div></div>)}</motion.div>}
          </AnimatePresence>

          {!hasResults ? (
            <div className="rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] shadow-[var(--dw-shadow-sm)]"><EmptyState icon={store.query ? Search : store.section === 'trash' ? Trash2 : FolderOpen} overline={store.query ? 'No matches' : currentSection.label} title={store.query ? `No results for “${store.query}”` : store.section === 'trash' ? 'Trash is empty' : 'Your library is empty'} description={store.query ? 'Try another search term or clear your filters.' : store.section === 'trash' ? 'Deleted documents will appear here.' : 'Upload a document or create a folder to start organizing your workspace.'} action={store.query ? <Button variant="secondary" onClick={() => { store.setQuery(''); store.setTypeFilter('all') }}>Clear filters</Button> : store.canWrite && store.section === 'library' ? <Button onClick={() => inputRef.current?.click()}><Upload className="size-4" /> Upload document</Button> : undefined} /></div>
          ) : (
            <div className="space-y-5">
              {store.visibleFolders.length > 0 && <div><div className="mb-2 flex items-center gap-2"><Folder className="size-4 text-[var(--dw-color-brand-primary)]" /><h2 className="text-xs font-bold uppercase tracking-wider text-[var(--dw-color-ink-secondary)]">Folders</h2></div><div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-3">{store.visibleFolders.map((folder) => <FolderCard key={folder.id} folder={folder} count={store.folderItemCount(folder.id)} canWrite={store.canWrite} onOpen={() => store.openFolder(folder.id)} onRename={() => setRenameFolder(folder)} onDelete={() => confirmFolderDelete(folder)} />)}</div></div>}
              {store.visibleDocuments.length > 0 && <div><div className="mb-2 flex items-center gap-2"><Files className="size-4 text-[var(--dw-color-brand-primary)]" /><h2 className="text-xs font-bold uppercase tracking-wider text-[var(--dw-color-ink-secondary)]">Files</h2><span className="text-[10px] text-[var(--dw-color-ink-tertiary)]">{store.visibleDocuments.length}</span></div>{store.view === 'grid' ? <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-3">{store.visibleDocuments.map((file) => <DocumentCard key={file.id} file={file} actions={documentActions} />)}</div> : <DocumentList files={store.visibleDocuments} actions={documentActions} />}</div>}
            </div>
          )}
        </section>
      </div>

      <DocumentDetails file={store.selectedDocument} canWrite={store.canWrite} onClose={store.closeDocument} onStar={store.toggleStar} onDownload={store.downloadDocument} onRename={setRenameFile} onShare={setShareFile} onMove={setMoveFile} onTrash={store.moveToTrash} onRestore={store.restoreDocument} onDelete={confirmPermanentDelete} />
      <NameDialog open={newFolderOpen} title="Create folder" description={`Add a folder${store.currentFolder ? ` inside ${store.currentFolder.name}` : ' to your library'}.`} label="Folder name" submitLabel="Create folder" onClose={() => setNewFolderOpen(false)} onSubmit={store.createFolder} />
      <NameDialog open={Boolean(renameFile)} title="Rename document" description="Keep the file extension so the document remains recognizable." label="Document name" initialValue={renameFile?.name} submitLabel="Save name" onClose={() => setRenameFile(null)} onSubmit={(name) => renameFile && store.renameDocument(renameFile.id, name)} />
      <NameDialog open={Boolean(renameFolder)} title="Rename folder" description="Choose a clear name your team can recognize." label="Folder name" initialValue={renameFolder?.name} submitLabel="Save name" onClose={() => setRenameFolder(null)} onSubmit={(name) => renameFolder && store.renameFolder(renameFolder.id, name)} />
      <ShareDialog file={shareFile} onClose={() => setShareFile(null)} onSave={(recipients) => shareFile && store.shareDocument(shareFile.id, recipients)} />
      <MoveDialog file={moveFile} folders={store.folders} onClose={() => setMoveFile(null)} onMove={(folderId) => moveFile && store.moveDocument(moveFile.id, folderId)} />
    </PageContainer>
  )
}
