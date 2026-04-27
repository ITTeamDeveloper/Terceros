import { Box, Typography } from '@mui/material'
import { AppMessage, SharedTable } from '../../../shared/components'
import { typo } from '../../../shared/styles/typography'
import type { ColumnDef } from '../../../shared/types/table.types'
import type { DescargaHistorialResponse } from '../../../services/interfaces'
import { useHistoricoDescargas } from './customHooks/useHistoricoDescargas'

const columns: ColumnDef<DescargaHistorialResponse>[] = [
    { label: 'Documento', key: 'documentoNombre' },
  { label: 'Empresa', key: 'empresa' },
  { label: 'Descargado por', key: 'usuario' },
  { label: 'Fecha', key: 'fechaDescarga' },
]

export const HistoricoDescargas = () => {
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
  } = useHistoricoDescargas()

  return (
    <Box sx={{ pt: 3, px: 4, pb: 3.5 }}>
      <Box sx={{ mb: 2.5, maxWidth: 760 }}>
        <Typography sx={{ ...typo.h2, mb: 0.75 }}>Histórico de descargas</Typography>
        <Typography sx={typo.subtitle}>
          Consulta el registro completo de descargas realizadas en la plataforma. Para cada descarga
          verás el documento, la empresa a la que pertenece, el usuario que lo descargó y la fecha
          en que se realizó, lo que te permite auditar el acceso a los documentos.
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
        //   title="Histórico de descargas"
          columns={columns}
          data={data}
          loading={loading}
          onRefresh={() => load()}
          onSearch={handleSearch}
          onSearchInput={cancelSearch}
          searchPlaceholder="Buscar por documento ..."
          onPageChange={handlePageChange}
          totalItems={total}
        />
      </Box>

      <AppMessage
        open={feedback.open}
        message={feedback.message}
        statusCode={feedback.statusCode}
        onClose={cerrarFeedback}
      />
    </Box>
  )
}
