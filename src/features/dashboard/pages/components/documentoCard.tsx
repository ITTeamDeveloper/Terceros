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
import type { ClienteDocumentoFila } from '../../../../services/interfaces'

interface DocumentoCardProps {
  estudio: string
  documentos: ClienteDocumentoFila[]
  fechaLabel?: string
  onDownload?: (estudio: string, documentoNombre: string, documentoId?: string) => Promise<void> | void
  onReload?: () => void
}

const claveDoc = (doc: ClienteDocumentoFila) => doc.documentoId ?? doc.documentoNombre

export function DocumentoCard({ estudio, documentos, fechaLabel = 'Última aprobación', onDownload, onReload }: DocumentoCardProps) {
  const [open, setOpen] = useState(true)
  const [downloading, setDownloading] = useState<Set<string>>(new Set())

  const handleDownload = async (doc: ClienteDocumentoFila) => {
    const key = claveDoc(doc)
    if (!onDownload || downloading.has(key)) return

    setDownloading((prev) => new Set(prev).add(key))
    try {
      await onDownload(estudio, doc.documentoNombre, doc.documentoId)
    } finally {
      setDownloading((prev) => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
      onReload?.()
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
          {estudio}
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
          {documentos.length === 0 ? (
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
            documentos.map((doc) => {
              const key = claveDoc(doc)
              const isDownloading = downloading.has(key)
              const fecha = doc.fechaAprobado ?? doc.fechaActualizacion
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
                    {doc.documentoNombre}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {fecha && (
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
                        {fechaLabel ? `${fechaLabel}: ` : ''}{fecha}
                      </Typography>
                    )}
                    <IconButton
                      onClick={() => handleDownload(doc)}
                      disabled={doc.descargado}
                      aria-label={`Descargar ${doc.documentoNombre}`}
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
                </Box>
              )
            })
          )}
        </Box>
      </Collapse>
    </Box>
  )
}
