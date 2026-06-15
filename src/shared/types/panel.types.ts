import React from 'react'

export interface SharedPanelFeedback {
  open: boolean
  message: string
  statusCode?: number
}

export interface SharedPanelProps {
  open: boolean
  onClose: () => void
  onSave?: () => void
  title: string
  children: React.ReactNode
  loading?: boolean
  feedback?: SharedPanelFeedback
  onCancel?: () => void
  cancelLabel?: string
  saveLabel?: string
  saveDisabled?: boolean
  width?: number | string | Record<string, number | string>
  hideFooter?: boolean
}
