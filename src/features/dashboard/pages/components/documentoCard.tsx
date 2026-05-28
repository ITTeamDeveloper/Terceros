import { useState, type ReactNode } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import CircularProgress from '@mui/material/CircularProgress'
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Download as DownloadIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { fontFamily } from '../../../../shared/styles/typography'
import type { ClienteDocumento, FechasActualizacion } from '../../../../services/interfaces'

export type DocumentoBaseKey = Exclude<keyof ClienteDocumento, 'asesor' | 'otros'>

interface PanelTrigger {
  button: ReactNode
  show: boolean
}

interface DocumentoCardProps {
  data: ClienteDocumento
  fechasActualizacion?: FechasActualizacion | null
  fechasAprobacion?: FechasActualizacion | null
  fechaLabel?: string
  fechaAprobacionLabel?: string
  onDownload?: (asesor: string, base: string) => Promise<void> | void
  onAprobar?: (asesor: string, base: string, label: string) => void
  estaAprobado?: (base: string) => boolean
  panel?: PanelTrigger
}

const formatFecha = (iso: string | null | undefined): string | null => {
  if (!iso) return null
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/)
  if (!m) return null
  const [, y, mo, d, h, mi] = m
  return `${d}/${mo}/${y} ${h}:${mi}`
}

const buscarFecha = (
  fechas: FechasActualizacion | null | undefined,
  key: string,
): string | null => {
  if (!fechas) return null
  const upper = key.toUpperCase()
  for (const [k, v] of Object.entries(fechas)) {
    if (k === 'otros') continue
    if (k.toUpperCase() === upper) return (v as string | null) ?? null
  }
  for (const [k, v] of Object.entries(fechas.otros ?? {})) {
    if (k.toUpperCase() === upper) return v ?? null
  }
  return null
}

const BLOCK_LABELS: Record<DocumentoBaseKey, string> = {
  baseAsignacion: 'Base Asignación',
  baseCDH: 'Base CDH',
  baseTelefono: 'Base Teléfono',
}

export function DocumentoCard({ data, fechasActualizacion, fechasAprobacion, fechaLabel, fechaAprobacionLabel, onDownload, onAprobar, estaAprobado, panel }: DocumentoCardProps) {
  const [open, setOpen] = useState(false)
  const [downloading, setDownloading] = useState<Set<string>>(new Set())

  const baseBlocks = (
    Object.entries(BLOCK_LABELS) as [DocumentoBaseKey, string][]
  )
    .filter(([key]) => data[key] === true)
    .map(([key, label]) => ({ key, label }))

  const otrosBlocks = Object.entries(data.otros ?? {})
    .filter(([, val]) => val === true)
    .map(([key]) => ({ key, label: key }))

  const visibleBlocks = [...baseBlocks, ...otrosBlocks]

  const handleDownload = async (key: string) => {
    if (!onDownload || downloading.has(key)) return

    setDownloading((prev) => new Set(prev).add(key))
    try {
      await onDownload(data.asesor, key)
    } finally {
      setDownloading((prev) => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    }
  }

  return (
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(29,29,29,0.06)',
        border: '1px solid #EEEEEE',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          py: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: fontFamily.body,
            fontSize: 14,
            fontWeight: 700,
            color: '#1D1D1D',
          }}
        >
          {data.asesor}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {panel?.show && panel.button}

          <IconButton
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Cerrar' : 'Abrir'}
            sx={{
              transition: 'transform 0.2s ease',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              color: '#1D1D1D',
            }}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Collapsible content */}
      <Collapse in={open}>
        <Box
          key={crypto.randomUUID()}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            px: 2.5,
            pb: 2,
            pt: 1.5,
            borderTop: '1px solid #EEEEEE',
          }}
        >
          {visibleBlocks.length === 0 ? (
            <Typography
              sx={{
                fontFamily: fontFamily.body,
                fontSize: 13,
                color: '#7A7390',
              }}
            >
              Sin documentos disponibles.
            </Typography>
          ) : (
            visibleBlocks.map(({ key, label }) => {
              const isDownloading = downloading.has(key)
              const fechaFmt = formatFecha(buscarFecha(fechasActualizacion, key))
              const fechaAprobacionFmt = formatFecha(buscarFecha(fechasAprobacion, key))
              return (
                <Box
                  key={crypto.randomUUID()}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: '#F3F0FF',
                    borderRadius: '8px',
                    px: 1.75,
                    py: 1.25,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: fontFamily.body,
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#1D1D1D',
                    }}
                  >
                    {label}
                  </Typography>

                  <Box key={crypto.randomUUID()} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {(fechaFmt || fechaAprobacionFmt) && (
                      <Typography
                        sx={{
                          fontFamily: fontFamily.body,
                          fontSize: 12,
                          fontWeight: 700,
                          color: '#1D1D1D',
                          mr: 0.75,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {fechaFmt && (
                          <>
                            {fechaLabel ? `${fechaLabel}: ` : ''}{fechaFmt}
                          </>
                        )}
                        {fechaFmt && fechaAprobacionFmt && ' - '}
                        {fechaAprobacionFmt && (
                          <>
                            {fechaAprobacionLabel ? `${fechaAprobacionLabel}: ` : ''}{fechaAprobacionFmt}
                          </>
                        )}
                      </Typography>
                    )}
                    <IconButton
                      onClick={() => handleDownload(key)}
                      disabled={isDownloading || !onDownload}
                      aria-label={`Descargar ${label}`}
                      sx={{
                        color: '#B19BFD',
                        '&:hover': { bgcolor: 'rgba(177, 155, 253, 0.12)' },
                        '&.Mui-disabled': { color: '#B19BFD', opacity: 0.6 },
                      }}
                    >
                      {isDownloading
                        ? <CircularProgress size={18} sx={{ color: '#B19BFD' }} />
                        : <DownloadIcon fontSize="small" />}
                    </IconButton>

                    {onAprobar && (() => {
                      const aprobado = estaAprobado?.(key) ?? false
                      const bg = aprobado ? '#B19BFD' : '#C7C7CF'
                      const hoverBg = aprobado ? '#9B82FC' : '#ABABB5'
                      return (
                        <IconButton
                          onClick={() => onAprobar(data.asesor, key, label)}
                          aria-label={aprobado ? `Desaprobar ${label}` : `Aprobar ${label}`}
                          sx={{
                            bgcolor: bg,
                            color: '#FFFFFF',
                            width: 32,
                            height: 32,
                            '&:hover': { bgcolor: hoverBg },
                          }}
                        >
                          {aprobado
                            ? <CloseIcon fontSize="small" />
                            : <CheckIcon fontSize="small" />}
                        </IconButton>
                      )
                    })()}
                  </Box>
                </Box>
              )
            })
          )}
        </Box>
      </Collapse>
    </Box>
  )
}
