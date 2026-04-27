import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import {
  Close as CloseIcon,
  UploadFileOutlined as UploadFileIcon,
} from '@mui/icons-material'
import { SharedPanel, SharedSelect } from '../../../../shared/components'
import type { ComboOption } from '../../../../shared/components'
import type { useAgregarDocumento } from '../customHooks/useAgregarDocumento'

interface DashboardAgregarProps {
  controller: ReturnType<typeof useAgregarDocumento>
  empresas: ComboOption[]
  loadingEmpresas?: boolean
}

export function DashboardAgregar({
  controller,
  empresas,
  loadingEmpresas = false,
}: DashboardAgregarProps) {
  const {
    open,
    archivos,
    empresa,
    saving,
    feedback,
    maxArchivos,
    cerrar,
    guardar,
    setEmpresa,
    agregarArchivos,
    quitarArchivo,
  } = controller

  const restantes = maxArchivos - archivos.length

  return (
    <SharedPanel
      open={open}
      onClose={cerrar}
      onSave={guardar}
      title="Subir documento"
      loading={saving}
      feedback={feedback}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <SharedSelect
          label="Empresa"
          placeholder="Selecciona una empresa"
          options={empresas}
          value={empresa}
          onChange={setEmpresa}
          loading={loadingEmpresas}
        />

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
    </SharedPanel>
  )
}
