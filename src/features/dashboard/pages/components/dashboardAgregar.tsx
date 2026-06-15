import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import {
  Close as CloseIcon,
  LockOpenOutlined as LockOpenIcon,
  UploadFileOutlined as UploadFileIcon,
} from '@mui/icons-material'
import { SharedPanel, SharedSelect } from '../../../../shared/components'
import type { useAgregarDocumento } from '../customHooks/useAgregarDocumento'
import { colors } from '@mui/material'

interface DashboardAgregarProps {
  controller: ReturnType<typeof useAgregarDocumento>
}

export function DashboardAgregar({ controller }: DashboardAgregarProps) {
  const {
    open,
    archivos,
    estudio,
    saving,
    feedback,
    puedeGuardar,
    confirmando,
    maxArchivos,
    cerrar,
    guardar,
    volverAEditar,
    agregarArchivos,
    quitarArchivo,
    estudioData,
    setEstudio,
  } = controller

  const restantes = maxArchivos - archivos.length

  return (
    <SharedPanel
      open={open}
      onClose={cerrar}
      onSave={guardar}
      title={confirmando ? 'Confirmar autorización' : 'Subir archivo'}
      loading={saving}
      feedback={feedback}
      onCancel={confirmando ? volverAEditar : undefined}
      cancelLabel={confirmando ? 'Volver' : 'Cancelar'}
      saveLabel={confirmando ? 'Sí, autorizar' : 'Guardar'}
      saveDisabled={!puedeGuardar}
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
            <LockOpenIcon sx={{ fontSize: 28, color: '#B19BFD' }} />
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
            ¿Estás seguro en autorizar al estudio a ver estos archivos?
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              color: '#6B6B7A',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center',
            }}
          >
            Una vez confirmado, el estudio podrá visualizar y descargar los archivos subidos.
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
              Estudio: <strong>{estudio ?? '—'}</strong>
            </Typography>
            <Typography
              sx={{ fontSize: 12, color: '#1D1D1D', fontFamily: 'Inter, sans-serif' }}
            >
              Archivos a autorizar: <strong>{archivos.length}</strong>
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
              {archivos.map((file, i) => (
                <Typography
                  key={`${file.name}-${i}`}
                  sx={{
                    fontSize: 12,
                    color: '#1D1D1D',
                    fontFamily: 'Inter, sans-serif',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  • {file.name}
                </Typography>
              ))}
            </Box>
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
          >
            <SharedSelect
              options={estudioData}
              value={estudioData.find((o) => o.data === estudio) ?? null}  
              onChange={(v) => setEstudio(v?.data ?? null)}
              key={crypto.randomUUID()}
            />
          </Box>
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              color: '#1D1D1D',
              fontFamily: 'Inter, sans-serif',
              mb: 1,
            }}
          >
            Archivos (.xlsx) — máximo {maxArchivos}
          </Typography>
          <Button
            component="label"
            fullWidth
            disabled={restantes <= 0}
            startIcon={<UploadFileIcon sx={{ fontSize: 18 }} />}
            sx={{
              height: 44,
              justifyContent: 'flex-start',
              px: 2,
              bgcolor: '#FFFFFF',
              color: '#1D1D1D',
              fontWeight: 500,
              fontSize: 12,
              fontFamily: 'Inter, sans-serif',
              border: '1px dashed #B19BFD',
              borderRadius: '6px',
              textTransform: 'none',
              '&:hover': { bgcolor: '#F3F0FF', borderColor: '#9B82FC' },
              '&.Mui-disabled': {
                color: '#9C9CA8',
                borderColor: '#EEEEEE',
              },
            }}
          >
            {restantes > 0
              ? `Seleccionar archivos (${archivos.length}/${maxArchivos})`
              : `Máximo alcanzado (${archivos.length}/${maxArchivos})`}
            <input
              type="file"
              multiple
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              hidden
              onChange={(e) => {
                const picked = Array.from(e.target.files ?? [])
                if (picked.length === 0) return
                agregarArchivos(picked)
                e.target.value = ''
              }}
            />
          </Button>

          {archivos.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
              {archivos.map((file, i) => (
                <Box
                  key={`${file.name}-${i}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.5,
                    py: 0.75,
                    bgcolor: '#F3F0FF',
                    border: '1px solid #EAE5FF',
                    borderRadius: '6px',
                  }}
                >
                  <Typography
                    sx={{
                      flex: 1,
                      fontSize: 12,
                      fontFamily: 'Inter, sans-serif',
                      color: '#1D1D1D',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {file.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => quitarArchivo(i)}
                    sx={{ p: 0.25, color: '#1D1D1D' }}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
      )}
    </SharedPanel>
  )
}
