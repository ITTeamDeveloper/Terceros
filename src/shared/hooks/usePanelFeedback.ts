import { useEffect, useRef, useState } from 'react'
import type { AxiosError } from 'axios'

export interface PanelFeedbackState {
  open: boolean
  message: string
  statusCode?: number
}

export const PANEL_FEEDBACK_DELAY_MS = 3000

interface UsePanelFeedbackArgs {
  onAfterClose: () => void
  onSuccess?: () => void | Promise<void>
}

export function usePanelFeedback({ onAfterClose, onSuccess }: UsePanelFeedbackArgs) {
  const [feedback, setFeedback] = useState<PanelFeedbackState>({ open: false, message: '' })
  const [saving, setSaving] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const ejecutar = async <T,>(action: () => Promise<T>): Promise<void> => {
    setSaving(true)

    let success = false
    let message = ''
    let statusCode = 200

    try {
      const res = await action()
      success = true
      statusCode = 200
      message = (res as { message?: string } | undefined)?.message ?? ''
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string; error?: string }>
      statusCode = axiosErr.response?.status ?? 500
      message =
        axiosErr.response?.data?.message ??
        axiosErr.response?.data?.error ??
        ''
      success = false
    }

    setFeedback({ open: true, message, statusCode })

    timerRef.current = setTimeout(async () => {
      onAfterClose()
      setFeedback({ open: false, message: '' })
      setSaving(false)
      if (success) await onSuccess?.()
    }, PANEL_FEEDBACK_DELAY_MS)
  }

  return { feedback, saving, ejecutar }
}
