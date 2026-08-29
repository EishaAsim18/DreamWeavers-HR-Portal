import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/shared/hooks/use-auth'
import { MOCK_DOCUMENT_FOLDERS, MOCK_DOCUMENTS } from '../data/documents.mock'
import {
  DOCUMENT_MAX_BYTES,
  type DocumentFolder,
  type DocumentKind,
  type DocumentSection,
  type DocumentSort,
  type DocumentTypeFilter,
  type DocumentView,
  type UploadQueueItem,
  type WorkspaceDocument,
} from '../types/document.types'

const FILES_STORAGE_KEY = 'dw_documents_files_v1'
const FOLDERS_STORAGE_KEY = 'dw_documents_folders_v1'

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function createId(prefix: string): string {
  return `${prefix}_${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now()}`
}

function detectKind(file: File): DocumentKind | null {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (extension === 'pdf') return 'pdf'
  if (extension === 'doc' || extension === 'docx') return 'document'
  if (extension === 'xls' || extension === 'xlsx') return 'spreadsheet'
  if (extension === 'png' || extension === 'jpg' || extension === 'jpeg') return 'image'
  if (extension === 'csv') return 'csv'
  return null
}

function initials(firstName?: string, lastName?: string): string {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || 'ME'
}

export function useDocumentsStore() {
  const { user, canAccessPermission } = useAuth()
  const canWrite = canAccessPermission('documents:write')

  const [documents, setDocuments] = useState<WorkspaceDocument[]>(() =>
    loadStored(FILES_STORAGE_KEY, MOCK_DOCUMENTS),
  )
  const [folders, setFolders] = useState<DocumentFolder[]>(() =>
    loadStored(FOLDERS_STORAGE_KEY, MOCK_DOCUMENT_FOLDERS),
  )
  const [section, setSectionState] = useState<DocumentSection>('library')
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<DocumentTypeFilter>('all')
  const [sort, setSort] = useState<DocumentSort>('updated')
  const [view, setView] = useState<DocumentView>('grid')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([])

  useEffect(() => {
    const serializable = documents.map(({ sourceFile: _sourceFile, previewUrl: _previewUrl, ...file }) => file)
    window.localStorage.setItem(FILES_STORAGE_KEY, JSON.stringify(serializable))
  }, [documents])

  useEffect(() => {
    window.localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders))
  }, [folders])

  const selectedDocument = useMemo(
    () => documents.find((file) => file.id === selectedId) ?? null,
    [documents, selectedId],
  )

  const currentFolder = useMemo(
    () => folders.find((folder) => folder.id === currentFolderId) ?? null,
    [folders, currentFolderId],
  )

  const breadcrumb = useMemo(() => {
    const chain: DocumentFolder[] = []
    let cursor = currentFolder
    while (cursor) {
      chain.unshift(cursor)
      cursor = folders.find((folder) => folder.id === cursor?.parentId) ?? null
    }
    return chain
  }, [currentFolder, folders])

  const visibleFolders = useMemo(() => {
    if (section !== 'library') return []
    const normalizedQuery = query.trim().toLowerCase()
    return folders
      .filter((folder) => folder.parentId === currentFolderId)
      .filter((folder) => !normalizedQuery || folder.name.toLowerCase().includes(normalizedQuery))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [currentFolderId, folders, query, section])

  const visibleDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const result = documents.filter((file) => {
      if (section === 'trash') {
        if (file.status !== 'trash') return false
      } else if (file.status !== 'active') return false

      if (section === 'library' && file.folderId !== currentFolderId) return false
      if (section === 'shared' && !file.sharedWithMe) return false
      if (section === 'starred' && !file.starred) return false
      if (typeFilter !== 'all' && file.kind !== typeFilter) return false
      if (!normalizedQuery) return true
      return [file.name, file.owner.name, ...file.tags]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    })

    return result.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'size') return b.size - a.size
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }, [currentFolderId, documents, query, section, sort, typeFilter])

  const stats = useMemo(() => {
    const active = documents.filter((file) => file.status === 'active')
    return {
      files: active.length,
      folders: folders.length,
      shared: active.filter((file) => file.sharedWithMe || file.sharedWith.length > 0).length,
      starred: active.filter((file) => file.starred).length,
      storageBytes: active.reduce((sum, file) => sum + file.size, 0),
    }
  }, [documents, folders])

  const folderItemCount = useCallback(
    (folderId: string) =>
      documents.filter((file) => file.status === 'active' && file.folderId === folderId).length +
      folders.filter((folder) => folder.parentId === folderId).length,
    [documents, folders],
  )

  const setSection = useCallback((next: DocumentSection) => {
    setSectionState(next)
    setCurrentFolderId(null)
    setSelectedId(null)
  }, [])

  const openFolder = useCallback((id: string | null) => {
    setSectionState('library')
    setCurrentFolderId(id)
  }, [])

  const createFolder = useCallback((name: string) => {
    if (!canWrite) return toast.error("You don't have permission to create folders.")
    const cleaned = name.trim()
    if (!cleaned) return
    if (folders.some((folder) => folder.parentId === currentFolderId && folder.name.toLowerCase() === cleaned.toLowerCase())) {
      toast.error('A folder with that name already exists here.')
      return
    }
    setFolders((current) => [
      ...current,
      {
        id: createId('fld'),
        name: cleaned,
        parentId: currentFolderId,
        color: '#4a7c92',
        createdAt: new Date().toISOString(),
      },
    ])
    toast.success(`Folder “${cleaned}” created`)
  }, [canWrite, currentFolderId, folders])

  const renameFolder = useCallback((id: string, name: string) => {
    const cleaned = name.trim()
    if (!cleaned) return
    setFolders((current) => current.map((folder) => folder.id === id ? { ...folder, name: cleaned } : folder))
    toast.success('Folder renamed')
  }, [])

  const deleteFolder = useCallback((id: string) => {
    const childIds = new Set<string>([id])
    let expanded = true
    while (expanded) {
      expanded = false
      folders.forEach((folder) => {
        if (folder.parentId && childIds.has(folder.parentId) && !childIds.has(folder.id)) {
          childIds.add(folder.id)
          expanded = true
        }
      })
    }
    setDocuments((current) => current.map((file) => file.folderId && childIds.has(file.folderId) ? { ...file, status: 'trash' } : file))
    setFolders((current) => current.filter((folder) => !childIds.has(folder.id)))
    if (currentFolderId && childIds.has(currentFolderId)) setCurrentFolderId(null)
    toast.success('Folder moved to Trash')
  }, [currentFolderId, folders])

  const uploadFiles = useCallback((incoming: FileList | File[]) => {
    if (!canWrite) return toast.error("You don't have permission to upload documents.")
    const accepted: { file: File; kind: DocumentKind; queueId: string }[] = []
    Array.from(incoming).forEach((file) => {
      const kind = detectKind(file)
      if (!kind) {
        toast.error(`${file.name}: unsupported file type`)
        return
      }
      if (file.size > DOCUMENT_MAX_BYTES) {
        toast.error(`${file.name}: file exceeds the 25MB limit`)
        return
      }
      accepted.push({ file, kind, queueId: createId('upload') })
    })
    if (!accepted.length) return

    setUploadQueue((current) => [
      ...current,
      ...accepted.map(({ file, queueId }) => ({ id: queueId, name: file.name, progress: 18 })),
    ])

    window.setTimeout(() => {
      setUploadQueue((current) => current.map((item) => accepted.some((upload) => upload.queueId === item.id) ? { ...item, progress: 64 } : item))
    }, 220)

    window.setTimeout(() => {
      const now = new Date().toISOString()
      const uploaded: WorkspaceDocument[] = accepted.map(({ file, kind }) => ({
        id: createId('doc'),
        name: file.name,
        kind,
        extension: file.name.split('.').pop()?.toLowerCase() ?? '',
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
        folderId: section === 'library' ? currentFolderId : null,
        owner: {
          name: user ? `${user.firstName} ${user.lastName}` : 'You',
          initials: initials(user?.firstName, user?.lastName),
          color: '#4a7c92',
        },
        createdAt: now,
        updatedAt: now,
        version: 1,
        tags: ['uploaded'],
        starred: false,
        sharedWithMe: false,
        sharedWith: [],
        status: 'active',
        previewUrl: kind === 'image' ? URL.createObjectURL(file) : undefined,
        sourceFile: file,
      }))
      setUploadQueue((current) => current.filter((item) => !accepted.some((upload) => upload.queueId === item.id)))
      setDocuments((current) => [...uploaded, ...current])
      setSectionState('library')
      toast.success(`${uploaded.length} file${uploaded.length === 1 ? '' : 's'} uploaded`)
    }, 760)
  }, [canWrite, currentFolderId, section, user])

  const updateDocument = useCallback((id: string, updates: Partial<WorkspaceDocument>) => {
    setDocuments((current) => current.map((file) => file.id === id ? { ...file, ...updates, updatedAt: new Date().toISOString() } : file))
  }, [])

  const toggleStar = useCallback((id: string) => {
    setDocuments((current) => current.map((file) => file.id === id ? { ...file, starred: !file.starred } : file))
  }, [])

  const renameDocument = useCallback((id: string, name: string) => {
    const cleaned = name.trim()
    if (!cleaned) return
    updateDocument(id, { name: cleaned, version: (documents.find((file) => file.id === id)?.version ?? 1) + 1 })
    toast.success('Document renamed')
  }, [documents, updateDocument])

  const shareDocument = useCallback((id: string, recipients: string[]) => {
    updateDocument(id, { sharedWith: recipients })
    toast.success(recipients.length ? 'Sharing updated' : 'Document is now private')
  }, [updateDocument])

  const moveDocument = useCallback((id: string, folderId: string | null) => {
    updateDocument(id, { folderId })
    toast.success('Document moved')
  }, [updateDocument])

  const moveToTrash = useCallback((id: string) => {
    updateDocument(id, { status: 'trash' })
    setSelectedId(null)
    toast.success('Moved to Trash')
  }, [updateDocument])

  const restoreDocument = useCallback((id: string) => {
    updateDocument(id, { status: 'active' })
    toast.success('Document restored')
  }, [updateDocument])

  const deletePermanently = useCallback((id: string) => {
    setDocuments((current) => current.filter((file) => file.id !== id))
    setSelectedId(null)
    toast.success('Document permanently deleted')
  }, [])

  const downloadDocument = useCallback((file: WorkspaceDocument) => {
    const blob = file.sourceFile ?? new Blob(
      [`DreamWeavers HRMS demo download\n\n${file.name}\nVersion ${file.version}\nOwner: ${file.owner.name}`],
      { type: file.mimeType || 'text/plain' },
    )
    const url = URL.createObjectURL(blob)
    const anchor = window.document.createElement('a')
    anchor.href = url
    anchor.download = file.name
    anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 500)
    toast.success('Download started')
  }, [])

  return {
    documents,
    folders,
    section,
    setSection,
    currentFolderId,
    currentFolder,
    openFolder,
    breadcrumb,
    query,
    setQuery,
    typeFilter,
    setTypeFilter,
    sort,
    setSort,
    view,
    setView,
    selectedDocument,
    openDocument: (file: WorkspaceDocument) => setSelectedId(file.id),
    closeDocument: () => setSelectedId(null),
    uploadQueue,
    visibleFolders,
    visibleDocuments,
    stats,
    folderItemCount,
    canWrite,
    createFolder,
    renameFolder,
    deleteFolder,
    uploadFiles,
    toggleStar,
    renameDocument,
    shareDocument,
    moveDocument,
    moveToTrash,
    restoreDocument,
    deletePermanently,
    downloadDocument,
  }
}
