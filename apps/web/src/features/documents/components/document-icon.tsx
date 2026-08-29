import { FileImage, FileSpreadsheet, FileText, Sheet } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { DocumentKind } from '../types/document.types'

const KIND_STYLES: Record<DocumentKind, { bg: string; text: string; label: string }> = {
  pdf: { bg: 'bg-red-500/10', text: 'text-red-500', label: 'PDF' },
  document: { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'DOC' },
  spreadsheet: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', label: 'XLS' },
  image: { bg: 'bg-violet-500/10', text: 'text-violet-500', label: 'IMG' },
  csv: { bg: 'bg-amber-500/10', text: 'text-amber-600', label: 'CSV' },
}

export function DocumentIcon({ kind, className }: { kind: DocumentKind; className?: string }) {
  const style = KIND_STYLES[kind]
  const Icon = kind === 'image' ? FileImage : kind === 'spreadsheet' ? FileSpreadsheet : kind === 'csv' ? Sheet : FileText

  return (
    <div className={cn('relative flex size-11 shrink-0 items-center justify-center rounded-xl', style.bg, className)}>
      <Icon className={cn('size-5', style.text)} />
      <span className={cn('absolute -bottom-1 rounded px-1 text-[7px] font-black leading-3 shadow-sm', style.bg, style.text)}>
        {style.label}
      </span>
    </div>
  )
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1)} MB`
}

export function formatDocumentDate(value: string): string {
  const date = new Date(value)
  const diff = Date.now() - date.getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined })
}
