import { lazy, Suspense } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {
  VisibilityOutlined as VerIcon,
  DownloadOutlined as DescargaIcon,
} from '@mui/icons-material'
import { AppMessage, SharedTable } from '../../../shared/components'
import { typo } from '../../../shared/styles/typography'
import { useAuth } from '../../auth/context/AuthContext'
import { useListarDocumentos } from './customHooks/useListarDocumentos'
import { useDescargarDocumento } from './customHooks/useDescargarDocumento'
import type { ColumnDef } from '../../../shared/types/table.types'
import type { ClienteDocumentoFila } from '../../../services/interfaces'
import { useFiltrarDocumento } from './customHooks/useFiltrarDocumento'
import { useVisualizarDocumento } from './customHooks/useVisualizarDocumento'
import { useHabilitarDescarga } from './customHooks/useHabilitarDescarga'
import { useEstudios } from './customHooks/useEstudios'

const DashboardFilter = lazy(() =>
  import('./components/dashboardFilter').then((module) => ({ default: module.DashboardFilter })),
)
const DashboardVisualizar = lazy(() =>
  import('./components/dashboardVisualizar').then((module) => ({ default: module.DashboardVisualizar })),
)
const DashboardHabilitarDescarga = lazy(() =>
  import('./components/dashboardHabilitarDescarga').then((module) => ({
    default: module.DashboardHabilitarDescarga,
  })),
)

function AsignacionesHistoricas() {
  const { payload } = useAuth()

  const { documentos, total, cancelSearch, handlePageChange, handleSearch, loading, refrescar: refrescarDocumentos, handleFilter } = useListarDocumentos({ rolIds: payload?.rol_ids, aprobados: true })
  const { feedback: descargarFeedback, cerrarFeedback: cerrarDescargarFeedback } = useDescargarDocumento()
  const filtrarController = useFiltrarDocumento({ onApply: handleFilter })
  const visualizarController = useVisualizarDocumento()
  const habilitarDescargaController = useHabilitarDescarga({ onSuccess: refrescarDocumentos })
  const estudiosController = useEstudios()

  const abrirFiltro = () => {
    filtrarController.abrir()
    void estudiosController.cargarEstudios()
  }

  const intro =
    {
      title: 'Documentos aprobados',
      description: 'Aquí puedes consultar y ver los archivos aprobados.',
    }


  const columns: ColumnDef<ClienteDocumentoFila>[] = [
    { label: 'Estudio', key: 'estudio' },
    { label: 'Documento', key: 'documentoNombre' },
    {
      label: 'Estado',
      key: 'estado',
      render: (value) => (
        <Box
          component="span"
          sx={{
            display: 'inline-block',
            px: 3.5,
            py: 0.5,
            borderRadius: '0.2rem',
            fontSize: 12,
            fontWeight: 600,
            textTransform: 'capitalize',
            color: '#007704a8',
            bgcolor: '#aed6af',
          }}
        >
          {value}
        </Box>
      ),
    },
    { label: 'Fecha de actualización', key: 'fechaActualizacion' },
    { label: 'Fecha de aprobación', key: 'fechaAprobado' },
  ]


  return (
    <Box sx={{ pt: 3, px: 4, pb: 3.5 }}>
      <Box sx={{ mb: 2.5, maxWidth: 760 }}>
        <Typography sx={{ ...typo.h2, mb: 0.75 }}>{intro.title}</Typography>
        <Typography sx={typo.subtitle}>{intro.description}</Typography>
      </Box>

      <SharedTable
        columns={columns}
        data={documentos}
        onRefresh={() => refrescarDocumentos()}
        loading={loading}
        searchPlaceholder="Buscar por documento ..."
        onSearch={handleSearch}
        onSearchInput={cancelSearch}
        onPageChange={handlePageChange}
        totalItems={total}
        onFilter={abrirFiltro}
        actions={[
          {
            label: 'Ver',
            icon: <VerIcon sx={{ fontSize: 18 }} />,
            color: 'success',
            onClick: (row) => visualizarController.abrir(row),
          },
          {
            label: 'Habilitar descarga',
            icon: <DescargaIcon sx={{ fontSize: 18 }} />,
            color: (row) =>
              !row.documentoId || (!row.descargado && row.estado === 'aprobado') ? 'default' : 'success',
            onClick: (row) => !row.documentoId || (!row.descargado && row.estado === 'aprobado') ? null : habilitarDescargaController.abrir(row),
          },
        ]}
      />

      <Suspense fallback={null}>
        {filtrarController.open && (
          <DashboardFilter
            controller={filtrarController}
            estudioData={estudiosController.estudioData}
            loadingEstudios={estudiosController.loading}
            ocultarEstado
          />
        )}
        {visualizarController.open && (
          <DashboardVisualizar controller={visualizarController} />
        )}
        {habilitarDescargaController.open && (
          <DashboardHabilitarDescarga controller={habilitarDescargaController} />
        )}
      </Suspense>

      <AppMessage
        open={descargarFeedback.open}
        message={descargarFeedback.message}
        statusCode={descargarFeedback.statusCode}
        onClose={cerrarDescargarFeedback}
      />
    </Box>
  )
}

export default AsignacionesHistoricas
