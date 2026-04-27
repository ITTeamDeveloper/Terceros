import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { UploadFileOutlined as UploadFileIcon } from '@mui/icons-material'
import { SharedPanel, SharedCombobox } from '../../../../shared/components'
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
    archivo,
    empresasSeleccionadas,
    saving,
    cerrar,
    guardar,
    setArchivo,
    setEmpresasSeleccionadas,
  } = controller

  return (
    <SharedPanel
      open={open}
      onClose={cerrar}
      onSave={guardar}
      title="Subir documento"
      loading={saving}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <SharedCombobox
          label="Empresas"
          placeholder="Selecciona una o más empresas"
          options={empresas}
          value={empresasSeleccionadas}
          onChange={setEmpresasSeleccionadas}
          loading={loadingEmpresas}
          multiple
        />

        <Box>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              color: '#1D1D1D',
              fontFamily: 'Calibri, sans-serif',
              mb: 1,
            }}
          >
            Archivo (.xlsx)
          </Typography>
          <Button
            component="label"
            fullWidth
            startIcon={<UploadFileIcon sx={{ fontSize: 18 }} />}
            sx={{
              height: 44,
              justifyContent: 'flex-start',
              px: 2,
              bgcolor: '#FFFFFF',
              color: '#1D1D1D',
              fontWeight: 500,
              fontSize: 12,
              fontFamily: 'Calibri, sans-serif',
              border: '1px dashed #B19BFD',
              borderRadius: '6px',
              textTransform: 'none',
              '&:hover': { bgcolor: '#F3F0FF', borderColor: '#9B82FC' },
            }}
          >
            {archivo ? archivo.name : 'Seleccionar archivo'}
            <input
              type="file"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              hidden
              onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
            />
          </Button>
        </Box>
      </Box>
    </SharedPanel>
  )
}
