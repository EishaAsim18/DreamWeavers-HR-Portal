export type DocumentKind = 'pdf' | 'document' | 'spreadsheet' | 'image' | 'csv'

export type DocumentSection = 'library' | 'shared' | 'starred' | 'trash'
export type DocumentView = 'grid' | 'list'
export type DocumentSort = 'updated' | 'name' | 'size'
export type DocumentTypeFilter = 'all' | DocumentKind

export interface DocumentOwner {
  name: string
  initials: string
  color: string
}

export interface DocumentFolder {
  id: string
  name: string
  parentId: string | null
  color: string
  createdAt: string
  team?: string
}

export interface WorkspaceDocument {
  id: string
  name: string
  kind: DocumentKind
  extension: string
  mimeType: string
  size: number
  folderId: string | null
  owner: DocumentOwner
  createdAt: string
  updatedAt: string
  version: number
  tags: string[]
  starred: boolean
  sharedWithMe: boolean
  sharedWith: string[]
  status: 'active' | 'trash'
  previewUrl?: string
  sourceFile?: File
}

export interface UploadQueueItem {
  id: string
  name: string
  progress: number
}

export const DOCUMENT_ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.csv'
export const DOCUMENT_MAX_BYTES = 25 * 1024 * 1024

export const DOCUMENT_KIND_LABELS: Record<DocumentKind, string> = {
  pdf: 'PDF',
  document: 'Document',
  spreadsheet: 'Spreadsheet',
  image: 'Image',
  csv: 'CSV',
}
