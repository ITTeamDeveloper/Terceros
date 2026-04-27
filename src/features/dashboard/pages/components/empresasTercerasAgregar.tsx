import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { SharedPanel } from '../../../../shared/components'
import type { useAgregarEmpresa } from '../customHooks/useAgregarEmpresa'

interface EmpresasTercerasAgregarProps {
  controller: ReturnType<typeof useAgregarEmpresa>
}

export function EmpresasTercerasAgregar({ controller }: EmpresasTercerasAgregarProps) {
  const { open, nombre, saving, feedback, cerrar, guardar, setNombre } = controller

  return (
    <SharedPanel
      open={open}
      onClose={cerrar}
      onSave={guardar}
      title="Agregar empresa tercera"
      loading={saving}
      feedback={feedback}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: '#1D1D1D',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Nombre de empresa tercera
        </Typography>
        <TextField
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. Finanty S.A."
          fullWidth
          size="small"
          slotProps={{
            input: {
              sx: {
                height: 44,
                fontSize: 13,
                fontFamily: 'Inter, sans-serif',
                color: '#1D1D1D',
                bgcolor: '#FFFFFF',
                '& fieldset': { borderColor: '#EEEEEE' },
                '&:hover fieldset': { borderColor: '#B19BFD' },
                '&.Mui-focused fieldset': { borderColor: '#B19BFD' },
              },
            },
          }}
        />
      </Box>
    </SharedPanel>
  )
}
