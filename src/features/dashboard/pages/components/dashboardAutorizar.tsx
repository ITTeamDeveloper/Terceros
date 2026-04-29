import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { SharedPanel } from '../../../../shared/components'
import type { useAutorizarDocumento } from '../customHooks/useAutorizarDocumento'

interface DashboardAutorizarProps {
  controller: ReturnType<typeof useAutorizarDocumento>
}

export function DashboardAutorizar({ controller }: DashboardAutorizarProps) {
  const { open, target, titulo, saving, feedback, cerrar, guardar } = controller

  return (
    <SharedPanel
      open={open}
      onClose={cerrar}
      onSave={guardar}
      title={titulo}
      loading={saving}
      feedback={feedback}
    >
      {target && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Typography
            sx={{ fontSize: 13, color: '#1D1D1D', fontFamily: 'Inter, sans-serif' }}
          >
            Archivo: <strong>{target.documentoNombre}</strong>
          </Typography>
          <Typography
            sx={{ fontSize: 13, color: '#1D1D1D', fontFamily: 'Inter, sans-serif' }}
          >
            Estudio: <strong>{target.empresaNombre}</strong>
          </Typography>
        </Box>
      )}
    </SharedPanel>
  )
}
