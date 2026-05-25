import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import CircularProgress from '@mui/material/CircularProgress'
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Download as DownloadIcon,
} from '@mui/icons-material'
import { fontFamily } from '../../../../shared/styles/typography'
import type { DocumentoListResponse } from '../../../../services/interfaces'

export type DocumentoBaseKey = Exclude<keyof DocumentoListResponse, 'asesor'>

interface DocumentoCardProps {
  data: DocumentoListResponse
  onDownload?: (asesor: string, base: DocumentoBaseKey) => Promise<void> | void
}

const BLOCK_LABELS: Record<DocumentoBaseKey, string> = {
  baseAsignacion: 'Base Asignación',
  baseCDH: 'Base CDH',
  baseTelefono: 'Base Teléfono',
}

export function DocumentoCard({ data, onDownload }: DocumentoCardProps) {
  const [open, setOpen] = useState(false)
  const [downloading, setDownloading] = useState<Set<DocumentoBaseKey>>(new Set())

  const visibleBlocks = (
    Object.entries(BLOCK_LABELS) as [DocumentoBaseKey, string][]
  ).filter(([key]) => data[key] === true)

  const handleDownload = async (key: DocumentoBaseKey) => {
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

      {/* Collapsible content */}
      <Collapse in={open}>
        <Box
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
            visibleBlocks.map(([key, label]) => {
              const isDownloading = downloading.has(key)
              return (
                <Box
                  key={key}
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
                </Box>
              )
            })
          )}
        </Box>
      </Collapse>
    </Box>
  )
}
