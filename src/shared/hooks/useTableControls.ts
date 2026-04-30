import { useState, useEffect, useRef } from 'react'

export function useTableControls(
  onSearch?: (term: string) => void,
  onSearchInput?: () => void,
) {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onSearchRef = useRef(onSearch)
  const onSearchInputRef = useRef(onSearchInput)
  const firstRun = useRef(true)

  useEffect(() => {
    onSearchRef.current = onSearch
    onSearchInputRef.current = onSearchInput
  })

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    if (!onSearchRef.current) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onSearchRef.current?.(searchTerm), 400)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchTerm])

  function handleSearchChange(value: string) {
    onSearchInputRef.current?.()
    setSearchTerm(value)
    setPage(0)
  }

  function handlePageChange(newPage: number, newPageSize: number) {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  return { searchTerm, page, pageSize, handleSearchChange, handlePageChange }
}
