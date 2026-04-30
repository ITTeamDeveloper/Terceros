import { Box, Typography } from '@mui/material'
import { AppMessage, SharedTable } from '../../../shared/components'
import { typo } from '../../../shared/styles/typography'
import type { ColumnDef } from '../../../shared/types/table.types'
import type { EmpresaSelectResponse } from '../../../services/interfaces'
import { useAgregarEmpresa } from './customHooks/useAgregarEmpresa'
import { useEmpresasTerceras } from './customHooks/useEmpresasTerceras'
import { EmpresasTercerasAgregar } from './components/empresasTercerasAgregar'

const columns: ColumnDef<EmpresaSelectResponse>[] = [
  { label: 'Usuario', key: 'usuario' },
  { label: 'Estudio', key: 'data' },
  { label: 'Fecha de creación', key: 'fechaCreacion' },
]

export const EmpresaTerceras = () => {
  const {
    data,
    total,
    loading,
    feedback,
    cerrarFeedback,
    load,
    handlePageChange,
    handleSearch,
    cancelSearch,
  } = useEmpresasTerceras()

  const agregar = useAgregarEmpresa({ onSuccess: load })

  return (
    <Box sx={{ pt: 3, px: 4, pb: 3.5 }}>
      <Box sx={{ mb: 2.5, maxWidth: 760 }}>
        <Typography sx={{ ...typo.h2, mb: 0.75 }}>Estudios</Typography>
        <Typography sx={typo.subtitle}>
          Gestiona los estudios registrados en la plataforma. Consulta el listado disponible y
          agrega nuevos para luego asignarles archivos desde la sección de asignaciones.
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: '#FFFFFF',
          border: '1px solid #EAE5FF',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <SharedTable
        //   title="Empresas terceras"
          columns={columns}
          data={data}
          loading={loading}
          onAdd={agregar.abrir}
          onRefresh={() => load()}
          onSearch={handleSearch}
          onSearchInput={cancelSearch}
          searchPlaceholder="Buscar por estudio ..."
          onPageChange={handlePageChange}
          totalItems={total}
        />
      </Box>

      <EmpresasTercerasAgregar controller={agregar} />

      <AppMessage
        open={feedback.open}
        message={feedback.message}
        statusCode={feedback.statusCode}
        onClose={cerrarFeedback}
      />
    </Box>
  )
}
