import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {
  VisibilityOutlined as VerIcon,
  CheckOutlined as AprobarIcon,
  DownloadOutlined as DescargaIcon,
} from '@mui/icons-material'
import { AppMessage, SharedTable } from '../../../shared/components'
import { typo } from '../../../shared/styles/typography'
import { useAuth } from '../../auth/context/AuthContext'
import { DashboardAgregar } from './components/dashboardAgregar'
import { DashboardAutorizar } from './components/dashboardAutorizar'
import { DocumentoCard } from './components/documentoCard'
import { useListarDocumentos } from './customHooks/useListarDocumentos'
import { useDescargarDocumento } from './customHooks/useDescargarDocumento'
import { useAgregarDocumento } from './customHooks/useAgregarDocumento'
import { useAutorizarDocumento } from './customHooks/useAutorizarDocumento'
import { useDocumentosAprobados } from './customHooks/useDocumentosAprobados'
import type { ColumnDef } from '../../../shared/types/table.types'
import type { ClienteDocumentoFila } from '../../../services/interfaces'
import { useFiltrarDocumento } from './customHooks/useFiltrarDocumento'
import { DashboardFilter } from './components/dashboardFilter'
import { useVisualizarDocumento } from './customHooks/useVisualizarDocumento'
import { DashboardVisualizar } from './components/dashboardVisualizar'
import { useHabilitarDescarga } from './customHooks/useHabilitarDescarga'
import { DashboardHabilitarDescarga } from './components/dashboardHabilitarDescarga'


function AsignacionesHistoricas() {
  const { payload } = useAuth()
  const isAdmin = payload?.roles.includes('SUPERVISOR_ESTUDIOS');
  const rolId = payload?.rol_ids?.[0]
  const esEstudio = rolId === 17

  const { documentos, total, cancelSearch, handlePageChange, handleSearch, loading, refrescar: refrescarDocumentos, handleFilter } = useListarDocumentos({ rolId, aprobados: true })
  const { descargar, feedback: descargarFeedback, cerrarFeedback: cerrarDescargarFeedback } = useDescargarDocumento()
  const aprobadosCtrl = useDocumentosAprobados({ rolId })
  const filtrarController = useFiltrarDocumento({ onApply: handleFilter })
  const visualizarController = useVisualizarDocumento()
  const habilitarDescargaController = useHabilitarDescarga({ onSuccess: refrescarDocumentos })
  const agregarController = useAgregarDocumento({ onSuccess: refrescarDocumentos })
  const autorizarController = useAutorizarDocumento({ onSuccess: esEstudio ? aprobadosCtrl.refrescar : refrescarDocumentos })

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
        onFilter={() => filtrarController.abrir()}
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

      <DashboardFilter controller={filtrarController} ocultarEstado />
      <DashboardVisualizar controller={visualizarController} />
      <DashboardHabilitarDescarga controller={habilitarDescargaController} />

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
