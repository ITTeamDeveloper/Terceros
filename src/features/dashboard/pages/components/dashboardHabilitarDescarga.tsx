import Typography from '@mui/material/Typography'
import { SharedPanel } from '../../../../shared/components'
import type { useHabilitarDescarga } from '../customHooks/useHabilitarDescarga'

interface DashboardHabilitarDescargaProps {
  controller: ReturnType<typeof useHabilitarDescarga>
}

export function DashboardHabilitarDescarga({ controller }: DashboardHabilitarDescargaProps) {
  const { open, saving, feedback, texto, cerrar, guardar } = controller

  return (
    <SharedPanel
      open={open}
      onClose={cerrar}
      onSave={guardar}
      title="Habilitar descarga"
      loading={saving}
      feedback={feedback}
      saveLabel="Aprobar"
    >
      <Typography
        sx={{
          fontSize: 14,
          color: '#1D1D1D',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {texto}
      </Typography>
    </SharedPanel>
  )
}
