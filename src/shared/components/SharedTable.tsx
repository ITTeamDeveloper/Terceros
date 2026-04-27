import React from 'react'
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material'
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material'
import { useTableControls } from '../hooks/useTableControls'
import type { SharedTableProps } from '../types/table.types'

export function SharedTable<T extends object>({
  columns,
  data,
  actions,
  onSearch,
  onPageChange,
  totalItems,
  loading = false,
  onAdd,
  addLabel = 'Agregar',
}: SharedTableProps<T>) {
  const { searchTerm, page, pageSize, handleSearchChange, handlePageChange } =
    useTableControls(onSearch)

  function onRowsPerPageChange(e: React.ChangeEvent<HTMLInputElement>) {
    handlePageChange(0, parseInt(e.target.value, 10))
    onPageChange?.(0, parseInt(e.target.value, 10))
  }

  function onPageChangeMUI(_: unknown, newPage: number) {
    handlePageChange(newPage, pageSize)
    onPageChange?.(newPage, pageSize)
  }

  const showPagination = !!onPageChange && totalItems !== undefined

  return (
    <Box sx={{ width: '100%' }}>
      {/* Barra superior: buscador + botón Agregar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: '20px',
          height: 52,
          borderBottom: '1px solid #EEEEEE',
          bgcolor: '#FFFFFF',
        }}
      >
        <Box sx={{ fontWeight: 700, fontSize: 14, color: '#B19BFD', flex: 1 }}>
          Detalle de Asignaciones
        </Box>

        {onSearch && (
          <TextField
            size="small"
            placeholder="Buscar estudio..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16, color: '#999' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 220,
              '& .MuiOutlinedInput-root': {
                fontSize: 12,
                borderRadius: '6px',
                bgcolor: '#F8F7FF',
                '& fieldset': { borderColor: '#EEEEEE' },
                '&:hover fieldset': { borderColor: '#B19BFD' },
                '&.Mui-focused fieldset': { borderColor: '#B19BFD' },
              },
            }}
          />
        )}

        {onAdd && (
          <Button
            onClick={onAdd}
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            sx={{
              height: 34,
              px: 2,
              bgcolor: '#B19BFD',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: 12,
              fontFamily: 'Calibri, sans-serif',
              borderRadius: '6px',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#9B82FC', boxShadow: 'none' },
            }}
          >
            {addLabel}
          </Button>
        )}
      </Box>

      {/* Tabla */}
      <Box sx={{ position: 'relative' }}>
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255,255,255,0.7)',
              zIndex: 2,
            }}
          >
            <CircularProgress size={36} sx={{ color: '#B19BFD' }} />
          </Box>
        )}

        <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#1D1D1D' }}>
              {columns.map((col) => (
                <TableCell
                  key={String(col.key)}
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: 12,
                    px: 2,
                    py: 1.25,
                    borderBottom: '2px solid #B19BFD',
                    fontFamily: 'Calibri, sans-serif',
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
              {actions && (
                <TableCell
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: 12,
                    px: 2,
                    py: 1.25,
                    borderBottom: '2px solid #B19BFD',
                    fontFamily: 'Calibri, sans-serif',
                  }}
                >
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((row, rowIdx) => (
              <TableRow
                key={rowIdx}
                sx={{
                  bgcolor: rowIdx % 2 === 0 ? '#FFFFFF' : '#F3F0FF',
                  '&:hover': { bgcolor: '#EDE9FE' },
                }}
              >
                {columns.map((col) => (
                  <TableCell
                    key={String(col.key)}
                    sx={{
                      fontSize: 12,
                      px: 2,
                      py: 1,
                      borderBottom: '1px solid #EEEEEE',
                      color: '#1D1D1D',
                      fontFamily: 'Calibri, sans-serif',
                    }}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? '')}
                  </TableCell>
                ))}

                {actions && (
                  <TableCell
                    sx={{
                      px: 2,
                      py: 1,
                      borderBottom: '1px solid #EEEEEE',
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {actions.map((action, i) => {
                        const label =
                          typeof action.label === 'function' ? action.label(row) : action.label
                        const icon =
                          typeof action.icon === 'function' ? action.icon(row) : action.icon
                        const color =
                          typeof action.color === 'function'
                            ? action.color(row)
                            : (action.color ?? 'default')
                        return (
                          <Tooltip key={i} title={label}>
                            <IconButton
                              size="small"
                              onClick={() => action.onClick(row)}
                              color={color}
                              sx={{ fontSize: 13 }}
                            >
                              {icon}
                            </IconButton>
                          </Tooltip>
                        )
                      })}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {showPagination && (
        <TablePagination
          component="div"
          count={totalItems!}
          page={page}
          rowsPerPage={pageSize}
          onPageChange={onPageChangeMUI}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Filas:"
          sx={{
            fontSize: 12,
            borderTop: '1px solid #EEEEEE',
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows':
              { fontSize: 12 },
          }}
        />
      )}
    </Box>
  )
}
