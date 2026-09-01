import { lazy, Suspense } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {
  VisibilityOutlined as VerIcon,
  CheckOutlined as AprobarIcon,
} from '@mui/icons-material'
import { AppMessage, SharedTable } from '../../../shared/components'
import { typo } from '../../../shared/styles/typography'
import { useAuth } from '../../auth/context/AuthContext'
import { DocumentoCard } from './components/documentoCard'
import { useListarDocumentos } from './customHooks/useListarDocumentos'
import { useDescargarDocumento } from './customHooks/useDescargarDocumento'
import { useAgregarDocumento } from './customHooks/useAgregarDocumento'
import { useAutorizarDocumento } from './customHooks/useAutorizarDocumento'
import type { ColumnDef } from '../../../shared/types/table.types'
import type { ClienteDocumentoFila } from '../../../services/interfaces'
import { useFiltrarDocumento } from './customHooks/useFiltrarDocumento'
import { useVisualizarDocumento } from './customHooks/useVisualizarDocumento'
import { useHabilitarDescarga } from './customHooks/useHabilitarDescarga'
import { useEstudios } from './customHooks/useEstudios'
import { tieneRolEstudio, tieneRolSupervisor } from '../../../shared/utils/roles'

const DashboardAgregar = lazy(() =>
  import('./components/dashboardAgregar').then((module) => ({ default: module.DashboardAgregar })),
)
const DashboardAutorizar = lazy(() =>
  import('./components/dashboardAutorizar').then((module) => ({ default: module.DashboardAutorizar })),
)
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

function MainDashboard() {
  const { payload } = useAuth()
  const isAdmin = tieneRolSupervisor(payload?.rol_ids)
  const esEstudio = tieneRolEstudio(payload?.rol_ids)

  const { documentos, total,cancelSearch, handlePageChange, handleSearch, loading, refrescar: refrescarDocumentos, handleFilter } = useListarDocumentos({ rolIds: payload?.rol_ids, aprobados: false})
  const { descargar, feedback: descargarFeedback, cerrarFeedback: cerrarDescargarFeedback } = useDescargarDocumento()
  const filtrarController = useFiltrarDocumento({ onApply: handleFilter })
  const visualizarController = useVisualizarDocumento()
  const habilitarDescargaController = useHabilitarDescarga({ onSuccess: refrescarDocumentos })
  const agregarController = useAgregarDocumento({ onSuccess: refrescarDocumentos })
  const autorizarController = useAutorizarDocumento({ onSuccess: refrescarDocumentos })
  const estudiosController = useEstudios()

  const abrirFiltro = () => {
    filtrarController.abrir()
    void estudiosController.cargarEstudios()
  }

  const abrirAgregar = () => {
    agregarController.abrir()
    void estudiosController.cargarEstudios()
  }

  const intro = isAdmin
    ? {
      title: 'Gestión de documentos',
      description: 'Revisa, valida y aprueba los documentos que serán visibles para terceros.',
    }
    : {
      title: 'Documentos disponibles',
      description: 'Aquí puedes consultar y descargar los archivos aprobados y vigentes de tu estudio.',
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
            color: value === 'nuevo' ? '#572bf7' : '#007704a8',
            bgcolor: value === 'nuevo' ? '#d0c4fd' : '#aed6af',
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

      {
        isAdmin ? (
          <>
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
            onAdd={abrirAgregar}
            actions={[
              {
                label: 'Ver',
                icon: <VerIcon sx={{ fontSize: 18 }} />,
                color: 'success',
                onClick: (row) => visualizarController.abrir(row),
              },
              {
                label: 'Aprobar',
                icon: <AprobarIcon sx={{ fontSize: 18 }} />,
                color: (row) =>
                  row.documentoId ? 'default' : 'success',
                onClick: (row) => row.documentoId ? null : autorizarController.abrir(row),
              }
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
            {agregarController.open && (
              <DashboardAgregar
                controller={agregarController}
                estudioData={estudiosController.estudioData}
                loadingEstudios={estudiosController.loading}
              />
            )}
            {autorizarController.open && <DashboardAutorizar controller={autorizarController} />}
          </Suspense>
          </>
        ):
        (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            {documentos.length === 0 ? (
              <Box
                sx={{
                  p: 3,
                  bgcolor: '#FFFFFF',
                  border: '1px solid #EAE5FF',
                  borderRadius: '16px',
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ ...typo.subtitle }}>
                  No hay documentos disponibles.
                </Typography>
              </Box>
            ) : (
              <DocumentoCard
                estudio={documentos[0].estudio}
                documentos={documentos}
                fechaLabel={esEstudio ? 'Última aprobación' : 'Última actualización'}
                onDownload={descargar}
                onReload={refrescarDocumentos}
              />
            )}
          </Box>

        )
      }





      <AppMessage
        open={descargarFeedback.open}
        message={descargarFeedback.message}
        statusCode={descargarFeedback.statusCode}
        onClose={cerrarDescargarFeedback}
      />
    </Box>
  )
}

export default MainDashboard
