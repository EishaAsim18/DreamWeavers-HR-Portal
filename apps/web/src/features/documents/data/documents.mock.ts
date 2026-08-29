import type { DocumentFolder, WorkspaceDocument } from '../types/document.types'

const OWNERS = {
  ali: { name: 'Ali Raza', initials: 'AR', color: '#4a7c92' },
  sana: { name: 'Sana Malik', initials: 'SM', color: '#7c3aed' },
  bilal: { name: 'Bilal Ahmed', initials: 'BA', color: '#059669' },
  ayesha: { name: 'Ayesha Khan', initials: 'AK', color: '#d97706' },
}

export const MOCK_DOCUMENT_FOLDERS: DocumentFolder[] = [
  { id: 'fld-company', name: 'Company Resources', parentId: null, color: '#4a7c92', createdAt: '2026-03-10T09:00:00.000Z', team: 'Everyone' },
  { id: 'fld-people', name: 'People & HR', parentId: null, color: '#7c3aed', createdAt: '2026-04-18T11:30:00.000Z', team: 'HR Team' },
  { id: 'fld-finance', name: 'Finance', parentId: null, color: '#059669', createdAt: '2026-05-02T08:15:00.000Z', team: 'Finance' },
  { id: 'fld-templates', name: 'Templates', parentId: null, color: '#d97706', createdAt: '2026-05-14T13:00:00.000Z', team: 'Everyone' },
  { id: 'fld-policies', name: 'Policies', parentId: 'fld-company', color: '#0891b2', createdAt: '2026-05-20T10:00:00.000Z' },
  { id: 'fld-onboarding', name: 'Onboarding', parentId: 'fld-people', color: '#e11d48', createdAt: '2026-06-01T10:00:00.000Z' },
]

export const MOCK_DOCUMENTS: WorkspaceDocument[] = [
  {
    id: 'doc-handbook', name: 'Employee Handbook 2026.pdf', kind: 'pdf', extension: 'pdf', mimeType: 'application/pdf',
    size: 3_840_000, folderId: 'fld-company', owner: OWNERS.sana, createdAt: '2026-07-02T09:20:00.000Z',
    updatedAt: '2026-08-24T10:45:00.000Z', version: 4, tags: ['policy', 'company'], starred: true,
    sharedWithMe: false, sharedWith: ['Everyone'], status: 'active',
  },
  {
    id: 'doc-policy', name: 'Remote Work Policy.docx', kind: 'document', extension: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 846_000,
    folderId: 'fld-policies', owner: OWNERS.sana, createdAt: '2026-06-12T12:00:00.000Z',
    updatedAt: '2026-08-23T14:10:00.000Z', version: 3, tags: ['policy', 'remote'], starred: false,
    sharedWithMe: true, sharedWith: ['HR Team', 'Managers'], status: 'active',
  },
  {
    id: 'doc-payroll', name: 'Payroll Summary — August.xlsx', kind: 'spreadsheet', extension: 'xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 1_420_000,
    folderId: 'fld-finance', owner: OWNERS.bilal, createdAt: '2026-08-20T09:10:00.000Z',
    updatedAt: '2026-08-25T16:35:00.000Z', version: 2, tags: ['payroll', 'finance'], starred: true,
    sharedWithMe: true, sharedWith: ['Finance', 'Super Admin'], status: 'active',
  },
  {
    id: 'doc-review', name: 'Performance Review Template.docx', kind: 'document', extension: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 612_000,
    folderId: 'fld-templates', owner: OWNERS.ayesha, createdAt: '2026-05-18T08:30:00.000Z',
    updatedAt: '2026-08-19T11:22:00.000Z', version: 5, tags: ['template', 'performance'], starred: false,
    sharedWithMe: false, sharedWith: ['Managers'], status: 'active',
  },
  {
    id: 'doc-org', name: 'Organization Chart.png', kind: 'image', extension: 'png', mimeType: 'image/png',
    size: 2_180_000, folderId: 'fld-company', owner: OWNERS.ali, createdAt: '2026-07-08T10:00:00.000Z',
    updatedAt: '2026-08-18T13:06:00.000Z', version: 2, tags: ['company', 'org'], starred: false,
    sharedWithMe: false, sharedWith: ['Everyone'], status: 'active',
  },
  {
    id: 'doc-headcount', name: 'Headcount Export.csv', kind: 'csv', extension: 'csv', mimeType: 'text/csv',
    size: 224_000, folderId: 'fld-people', owner: OWNERS.sana, createdAt: '2026-08-12T09:00:00.000Z',
    updatedAt: '2026-08-17T09:42:00.000Z', version: 1, tags: ['people', 'export'], starred: false,
    sharedWithMe: true, sharedWith: ['HR Team'], status: 'active',
  },
  {
    id: 'doc-onboarding', name: 'New Starter Checklist.pdf', kind: 'pdf', extension: 'pdf', mimeType: 'application/pdf',
    size: 980_000, folderId: 'fld-onboarding', owner: OWNERS.ayesha, createdAt: '2026-07-15T10:30:00.000Z',
    updatedAt: '2026-08-16T15:15:00.000Z', version: 2, tags: ['onboarding', 'checklist'], starred: true,
    sharedWithMe: false, sharedWith: ['HR Team', 'Managers'], status: 'active',
  },
  {
    id: 'doc-benefits', name: 'Benefits Overview.pdf', kind: 'pdf', extension: 'pdf', mimeType: 'application/pdf',
    size: 1_760_000, folderId: 'fld-people', owner: OWNERS.sana, createdAt: '2026-06-28T09:00:00.000Z',
    updatedAt: '2026-08-12T09:45:00.000Z', version: 2, tags: ['benefits', 'people'], starred: false,
    sharedWithMe: false, sharedWith: ['Everyone'], status: 'active',
  },
  {
    id: 'doc-archive', name: 'Old Leave Calendar.xlsx', kind: 'spreadsheet', extension: 'xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 430_000,
    folderId: 'fld-people', owner: OWNERS.sana, createdAt: '2025-12-12T09:00:00.000Z',
    updatedAt: '2026-01-04T09:45:00.000Z', version: 1, tags: ['archive'], starred: false,
    sharedWithMe: false, sharedWith: [], status: 'trash',
  },
]
