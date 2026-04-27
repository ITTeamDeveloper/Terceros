import React from 'react'

export interface SharedPanelProps {
  open: boolean
  onClose: () => void
  onSave: () => void
  title: string
  children: React.ReactNode
  loading?: boolean
}
