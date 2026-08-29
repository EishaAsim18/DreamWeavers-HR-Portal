import { useEffect } from 'react'

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable
}

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: { ctrl?: boolean; meta?: boolean; shift?: boolean; enabled?: boolean } = {},
) {
  const { ctrl = false, meta = true, shift = false, enabled = true } = options

  useEffect(() => {
    if (!enabled) return

    const handler = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return

      const modifier = ctrl || meta
      const modifierPressed = (ctrl && e.ctrlKey) || (meta && e.metaKey)
      if (modifier && !modifierPressed) return
      if (shift && !e.shiftKey) return
      if (!shift && e.shiftKey && key.length === 1) return

      if (e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault()
        callback()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, callback, ctrl, meta, shift, enabled])
}
