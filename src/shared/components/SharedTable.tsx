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
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material'
import {
  Add as AddIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  FilterAlt,
  InboxOutlined as InboxIcon,
  RefreshOutlined as RefreshIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import { useTableControls } from '../hooks/useTableControls'
import type { SharedTableProps } from '../types/table.types'
import { typo } from '../styles/typography'

/**
 * Devuelve la ventana de páginas a mostrar (con elipsis cuando hay muchas).
 */
function pagesWindow(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  const out: (number | 'ellipsis')[] = []
  const left = Math.max(2, current - 1)
  const right = Math.min(total - 1, current + 1)
  out.push(1)
  if (left > 2) out.push('ellipsis')
  for (let i = left; i <= right; i++) out.push(i)
  if (right < total - 1) out.push('ellipsis')
  out.push(total)
  return out
}

interface TablePagerProps {
  page: number
  pageSize: number
  totalItems: number
  onChange: (page: number) => void
}

function TablePager({ page, pageSize, totalItems, onChange }: TablePagerProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const current = page + 1
  const win = pagesWindow(current, totalPages)
  const prevDisabled = current <= 1
  const nextDisabled = current >= totalPages

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        px: '22px',
        height: 56,
        borderTop: '1px solid #F0EBFF',
      }}
    >
      <Box sx={typo.caption}>
        Página {current} de {totalPages}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        {/* Prev */}
        <Box
          onClick={() => !prevDisabled && onChange(current - 2)}
          sx={{
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            bgcolor: '#F7F4FF',
            color: '#1D1D1D',
            cursor: prevDisabled ? 'not-allowed' : 'pointer',
            opacity: prevDisabled ? 0.4 : 1,
            transition: 'background-color 0.15s',
            '&:hover': { bgcolor: prevDisabled ? '#F7F4FF' : '#EFEAFF' },
          }}
        >
          <ChevronLeftIcon sx={{ fontSize: 16 }} />
        </Box>

        {/* Pages */}
        {win.map((p, i) => {
          if (p === 'ellipsis') {
            return (
              <Box
                key={`e${i}`}
                sx={{ ...typo.caption, width: 22, textAlign: 'center', color: '#9C9CA8' }}
              >
                …
              </Box>
            )
          }
          const active = p === current
          return (
            <Box
              key={p}
              onClick={() => !active && onChange(p - 1)}
              sx={{
                ...typo.caption,
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                fontWeight: active ? 700 : 600,
                color: '#1D1D1D',
                bgcolor: active ? '#B19BFD' : 'transparent',
                cursor: active ? 'default' : 'pointer',
                transition: 'background-color 0.15s',
                '&:hover': { bgcolor: active ? '#B19BFD' : '#F7F4FF' },
              }}
            >
              {p}
            </Box>
          )
        })}

        {/* Next */}
        <Box
          onClick={() => !nextDisabled && onChange(current)}
          sx={{
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            bgcolor: '#1D1D1D',
            color: '#B19BFD',
            cursor: nextDisabled ? 'not-allowed' : 'pointer',
            opacity: nextDisabled ? 0.35 : 1,
            transition: 'background-color 0.15s',
            '&:hover': { bgcolor: nextDisabled ? '#1D1D1D' : '#000000' },
          }}
        >
          <ChevronRightIcon sx={{ fontSize: 16 }} />
        </Box>
      </Box>
    </Box>
  )
}

export function SharedTable<T extends object>({
  columns,
  data,
  actions,
  onSearch,
  onSearchInput,
  searchPlaceholder = 'Buscar...',
  onPageChange,
  totalItems,
  loading = false,
  onAdd,
  onFilter,
  filterLabel = 'Filtrar',
  addLabel = 'Agregar',
  onRefresh,
  title,
  maxBodyHeight = 'calc(100vh - 260px)',
}: SharedTableProps<T>) {
  const { searchTerm, page, pageSize, handleSearchChange, handlePageChange } =
    useTableControls(onSearch, onSearchInput)

  function goToPage(newPage: number) {
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
          {title}
        </Box>

        {onSearch && (
          <TextField
            size="small"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 16, color: '#999' }} />
                  </InputAdornment>
                ),
              },
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

        {onRefresh && (
          <Tooltip title="Actualizar">
            <span>
              <IconButton
                onClick={onRefresh}
                disabled={loading}
                sx={{
                  height: 34,
                  width: 34,
                  bgcolor: '#F3F0FF',
                  borderRadius: '6px',
                  color: '#1D1D1D',
                  '&:hover': { bgcolor: '#EDE9FE' },
                }}
              >
                <RefreshIcon sx={{ fontSize: 18, color: '#B19BFD' }} />
              </IconButton>
            </span>
          </Tooltip>
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
              fontFamily: 'Inter, sans-serif',
              borderRadius: '6px',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#9B82FC', boxShadow: 'none' },
            }}
          >
            {addLabel}
          </Button>
        )}
        {onFilter && (
          <Button
            onClick={onFilter}
            startIcon={<FilterAlt sx={{ fontSize: 16 }} />}
            sx={{
              height: 34,
              px: 2,
              bgcolor: '#B19BFD',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: 12,
              fontFamily: 'Inter, sans-serif',
              borderRadius: '6px',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#9B82FC', boxShadow: 'none' },
            }}
          >
            {filterLabel}
          </Button>
        )}
      </Box>

      {/* Tabla */}
      <Box sx={{ position: 'relative', maxHeight: maxBodyHeight, overflow: 'auto' }}>
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
                    fontFamily: 'Inter, sans-serif',
                    bgcolor: '#1D1D1D',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
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
                    fontFamily: 'Inter, sans-serif',
                    bgcolor: '#1D1D1D',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading && data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  sx={{ borderBottom: 'none', py: 6 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      color: '#9C9CA8',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    <InboxIcon sx={{ fontSize: 36, color: '#B19BFD' }} />
                    <Box sx={{ fontSize: 13, fontWeight: 700, color: '#1D1D1D' }}>
                      No hay datos para mostrar
                    </Box>
                    <Box sx={{ fontSize: 12, color: '#6B6B7A' }}>
                      Aún no se han registrado resultados.
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            )}
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
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {(() => {
                      const raw = row[col.key]
                      if (col.render) return col.render(raw, row, page * pageSize + rowIdx + 1)
                      if (raw === null || raw === undefined || raw === '') {
                        return <Box sx={{ color: '#9C9CA8' }}>—</Box>
                      }
                      return String(raw)
                    })()}
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
        <TablePager
          page={page}
          pageSize={pageSize}
          totalItems={totalItems!}
          onChange={goToPage}
        />
      )}
    </Box>
  )
}
