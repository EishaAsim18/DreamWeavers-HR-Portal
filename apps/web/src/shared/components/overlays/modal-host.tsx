import { useState } from 'react'
import { useModal } from '@/shared/hooks'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'

export function ModalHost() {
  const { modal, closeModal } = useModal()
  const [loading, setLoading] = useState(false)

  if (!modal) return null

  const handleConfirm = async () => {
    if (!modal.onConfirm) {
      closeModal()
      return
    }
    setLoading(true)
    try {
      await modal.onConfirm()
      closeModal()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={Boolean(modal)} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{modal.title}</DialogTitle>
          {modal.description && <DialogDescription>{modal.description}</DialogDescription>}
        </DialogHeader>
        {modal.content}
        {(modal.onConfirm || modal.cancelLabel) && (
          <DialogFooter>
            <Button variant="ghost" onClick={closeModal} disabled={loading}>
              {modal.cancelLabel ?? 'Cancel'}
            </Button>
            {modal.onConfirm && (
              <Button
                variant={modal.variant === 'danger' ? 'danger' : 'primary'}
                onClick={() => void handleConfirm()}
                loading={loading}
              >
                {modal.confirmLabel ?? 'Confirm'}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
