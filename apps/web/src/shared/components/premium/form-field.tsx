import { motion } from 'framer-motion'
import { cn } from '@/shared/lib/utils'

interface FormFieldProps {
  label: string
  htmlFor?: string
  hint?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <motion.div
      className={cn('space-y-1.5', className)}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
    >
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1 text-sm font-medium text-[var(--dw-color-ink-primary)]"
      >
        {label}
        {required && (
          <span className="text-[var(--dw-color-danger)]" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-[var(--dw-color-ink-tertiary)]">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-[var(--dw-color-danger)]" role="alert">
          {error}
        </p>
      )}
    </motion.div>
  )
}
