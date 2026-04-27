import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { SharedPanel } from '../../../../shared/components'
import type { useAutorizarDocumento } from '../customHooks/useAutorizarDocumento'

interface DashboardAutorizarProps {
  controller: ReturnType<typeof useAutorizarDocumento>
}

export function DashboardAutorizar({ controller }: DashboardAutorizarProps) {
  const { open, target, titulo, saving, cerrar, guardar } = controller

  return (
    <SharedPanel
      open={open}
      onClose={cerrar}
      onSave={guardar}
      title={titulo}
      loading={saving}
    >
      {target && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Typography
            sx={{ fontSize: 13, color: '#1D1D1D', fontFamily: 'Calibri, sans-serif' }}
          >
            Documento: <strong>{target.documentoNombre}</strong>
          </Typography>
          <Typography
            sx={{ fontSize: 13, color: '#1D1D1D', fontFamily: 'Calibri, sans-serif' }}
          >
            Empresa: <strong>{target.empresaNombre}</strong>
          </Typography>
        </Box>
      )}
    </SharedPanel>
  )
}
