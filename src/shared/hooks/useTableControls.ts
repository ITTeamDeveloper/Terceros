import { useState, useEffect, useRef } from 'react'

export function useTableControls(onSearch?: (term: string) => void) {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!onSearch) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onSearch(searchTerm), 400)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchTerm, onSearch])

  function handleSearchChange(value: string) {
    setSearchTerm(value)
    setPage(0)
  }

  function handlePageChange(newPage: number, newPageSize: number) {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  return { searchTerm, page, pageSize, handleSearchChange, handlePageChange }
}
