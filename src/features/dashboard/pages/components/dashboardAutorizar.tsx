import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {
  CheckCircleOutlined as CheckIcon,
  HighlightOffOutlined as RevokeIcon,
} from '@mui/icons-material'
import { SharedPanel } from '../../../../shared/components'
import type { useAutorizarDocumento } from '../customHooks/useAutorizarDocumento'

interface DashboardAutorizarProps {
  controller: ReturnType<typeof useAutorizarDocumento>
}

export function DashboardAutorizar({ controller }: DashboardAutorizarProps) {
  const {
    open,
    target,
    saving,
    feedback,
    confirmando,
    cerrar,
    guardar,
    volverAEditar,
  } = controller

  const accion = target?.aprobar ? 'autorizar' : 'desautorizar'
  const accionMayus = target?.aprobar ? 'Autorizar' : 'Desautorizar'
  const Icon = target?.aprobar ? CheckIcon : RevokeIcon

  return (
    <SharedPanel
      open={open}
      onClose={cerrar}
      onSave={guardar}
      title={confirmando ? `Confirmar ${accion}` : `${accionMayus} documento`}
      loading={saving}
      feedback={feedback}
      onCancel={confirmando ? volverAEditar : undefined}
      cancelLabel={confirmando ? 'Volver' : 'Cancelar'}
      saveLabel={confirmando ? `Sí, ${accion}` : 'Continuar'}
    >
      {confirmando ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: '#F3F0FF',
              alignSelf: 'center',
            }}
          >
            <Icon sx={{ fontSize: 28, color: '#B19BFD' }} />
          </Box>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 700,
              color: '#1D1D1D',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center',
            }}
          >
            ¿Estás seguro en {accion} la tabla del estudio?
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              color: '#6B6B7A',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center',
            }}
          >
            {target?.aprobar
              ? 'Una vez confirmado, el estudio podrá visualizar y descargar este archivo.'
              : 'Una vez confirmado, el estudio dejará de poder visualizar y descargar este archivo.'}
          </Typography>

          <Box
            sx={{
              mt: 1,
              p: 2,
              bgcolor: '#F3F0FF',
              border: '1px solid #EAE5FF',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography
              sx={{ fontSize: 12, color: '#1D1D1D', fontFamily: 'Inter, sans-serif' }}
            >
              Estudio: <strong>{target?.estudio ?? '—'}</strong>
            </Typography>
            <Typography
              sx={{ fontSize: 12, color: '#1D1D1D', fontFamily: 'Inter, sans-serif' }}
            >
              Tabla: <strong>{target?.tabla ?? '—'}</strong>
            </Typography>
            <Typography
              sx={{ fontSize: 12, color: '#1D1D1D', fontFamily: 'Inter, sans-serif' }}
            >
              Acción: <strong>{accionMayus}</strong>
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: '#1D1D1D',
                fontFamily: 'Inter, sans-serif',
                mb: 0.75,
              }}
            >
              Estudio
            </Typography>
            <Box
              sx={{
                px: 2,
                py: 1.25,
                bgcolor: '#F3F0FF',
                border: '1px solid #EAE5FF',
                borderRadius: '6px',
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#1D1D1D',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {target?.estudio ?? '—'}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: '#1D1D1D',
                fontFamily: 'Inter, sans-serif',
                mb: 0.75,
              }}
            >
              Tabla
            </Typography>
            <Box
              sx={{
                px: 2,
                py: 1.25,
                bgcolor: '#F3F0FF',
                border: '1px solid #EAE5FF',
                borderRadius: '6px',
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#1D1D1D',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {target?.tabla ?? '—'}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: '#1D1D1D',
                fontFamily: 'Inter, sans-serif',
                mb: 0.75,
              }}
            >
              Acción
            </Typography>
            <Box
              sx={{
                px: 2,
                py: 1.25,
                bgcolor: '#F3F0FF',
                border: '1px solid #EAE5FF',
                borderRadius: '6px',
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#1D1D1D',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {accionMayus}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </SharedPanel>
  )
}
