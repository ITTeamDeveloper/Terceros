import React from 'react'

export interface SharedPanelFeedback {
  open: boolean
  message: string
  statusCode?: number
}

export interface SharedPanelProps {
  open: boolean
  onClose: () => void
  onSave: () => void
  title: string
  children: React.ReactNode
  loading?: boolean
  feedback?: SharedPanelFeedback
}
