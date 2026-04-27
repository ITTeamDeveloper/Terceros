import React from 'react'

export interface ColumnDef<T> {
  label: string
  key: keyof T
  render?: (value: any, row: T) => React.ReactNode
}

export interface TableAction<T = any> {
  label: string | ((row: T) => string)
  icon: React.ReactNode | ((row: T) => React.ReactNode)
  onClick: (row: T) => void
  color?: 'primary' | 'error' | 'warning' | 'success' | ((row: T) => 'primary' | 'error' | 'warning' | 'success' | 'default')
}

export interface SharedTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  actions?: TableAction<T>[]
  onSearch?: (term: string) => void
  onPageChange?: (page: number, pageSize: number) => void
  totalItems?: number
  loading?: boolean
  onAdd?: () => void
  addLabel?: string
}
