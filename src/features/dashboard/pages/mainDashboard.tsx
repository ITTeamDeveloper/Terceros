import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import {
  AddOutlined as AddIcon,
  CloudDownloadOutlined as CloudDownloadIcon,
  // DeleteOutlined as DeleteIcon,
  FilterAltOutlined as FilterIcon,
  LockOutlined as LockIcon,
  LockOpenOutlined as LockOpenIcon,
} from '@mui/icons-material'
import { AppMessage } from '../../../shared/components'
import { typo } from '../../../shared/styles/typography'
import type { ComboOption } from '../../../shared/components'
import type { ColumnDef, TableAction } from '../../../shared/types/table.types'
import { documentoServices } from '../../../services/documentoServices'
import type {
  DocumentoAutorizadoListResponse,
  DocumentoListResponse,
  IDocumentoListParams,
} from '../../../services/interfaces'
import { useAuth } from '../../auth/context/AuthContext'
import { DashboardAgregar } from './components/dashboardAgregar'
import { DashboardAutorizar } from './components/dashboardAutorizar'
import { DashboardEliminar } from './components/dashboardEliminar'
import { DocumentoCard } from './components/documentoCard'
import { useListarDocumentos } from './customHooks/useListarDocumentos'
import { useDescargarDocumento } from './customHooks/useDescargarDocumento'
import { useAgregarDocumento } from './customHooks/useAgregarDocumento'
import { useAutorizarDocumento } from './customHooks/useAutorizarDocumento'
import { useDocumentosAprobados } from './customHooks/useDocumentosAprobados'

function MainDashboard() {
  const { payload } = useAuth()
  const isAdmin = payload?.rol === 'admin'
  const rolId = payload?.rol_ids?.[0]
  const esEstudio = rolId === 17
  const [params, setParams] = useState<IDocumentoListParams>({
    search: '',
    skip: 0,
    take: 10,
    empresaId: payload?.empresa_id ?? undefined,
  })

  const { estudioDocs, fechas, fechasAprobacion, refrescar: refrescarDocumentos } = useListarDocumentos({ rolId })
  const { descargar, feedback: descargarFeedback, cerrarFeedback: cerrarDescargarFeedback } = useDescargarDocumento()
  const aprobadosCtrl = useDocumentosAprobados({ rolId })
  const agregarController = useAgregarDocumento({ onSuccess: refrescarDocumentos })
  const autorizarController = useAutorizarDocumento({ onSuccess: aprobadosCtrl.refrescar })

  const intro = isAdmin
    ? {
        title: 'Asignaciones de archivos',
        description:
          'Administra los archivos aprobados a cada estudio. Desde aquí puedes agregar nuevos archivos y eliminarlos cuando ya no sean necesarios.',
      }
    : {
        title: 'Mis archivos aprobados',
        description:
          'Consulta los archivos que tu estudio tiene autorizados para descargar.',
      }

  return (
    <Box sx={{ pt: 3, px: 4, pb: 3.5 }}>
      <Box sx={{ mb: 2.5, maxWidth: 760 }}>
        <Typography sx={{ ...typo.h2, mb: 0.75 }}>{intro.title}</Typography>
        <Typography sx={typo.subtitle}>{intro.description}</Typography>
      </Box>

      {/* {isAdmin && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            bgcolor: '#FFFFFF',
            border: '1px solid #EAE5FF',
            borderRadius: '12px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <FilterIcon sx={{ fontSize: 16, color: '#B19BFD' }} />
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: '#1D1D1D',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Filtrar archivos por estudio
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: 12,
              color: '#6B6B7A',
              fontFamily: 'Inter, sans-serif',
              mb: 1.5,
            }}
          >
            Selecciona un estudio y presiona <strong>Filtrar</strong> para ver únicamente los
            archivos asignados a ese estudio.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
            <Box sx={{ width: 280 }}>
              <SharedSelect
                placeholder="Selecciona un estudio"
                options={empresas}
                value={empresaFiltro}
                onChange={setEmpresaFiltro}
                loading={loadingEmpresas}
              />
            </Box>
            <Button
              onClick={handleAplicarFiltro}
              disabled={!empresaFiltro}
              startIcon={<FilterIcon sx={{ fontSize: 16 }} />}
              sx={{
                height: 36,
                px: 2,
                bgcolor: '#B19BFD',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: 12,
                fontFamily: 'Inter, sans-serif',
                borderRadius: '6px',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#9B82FC', boxShadow: 'none' },
                '&.Mui-disabled': { bgcolor: '#EAE5FF', color: '#FFFFFF' },
              }}
            >
              Filtrar
            </Button>
            {params.empresaId && (
              <Button
                onClick={() => {
                  setEmpresaFiltro(null)
                  setParams((p) => ({ ...p, empresaId: undefined, skip: 0 }))
                }}
                sx={{
                  height: 36,
                  px: 2,
                  bgcolor: '#F3F0FF',
                  color: '#1D1D1D',
                  fontWeight: 700,
                  fontSize: 12,
                  fontFamily: 'Inter, sans-serif',
                  borderRadius: '6px',
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#EDE9FE', boxShadow: 'none' },
                }}
              >
                Limpiar filtro
              </Button>
            )}
          </Box>
          {params.empresaId && (
            <Typography
              sx={{
                mt: 1.25,
                fontSize: 12,
                color: '#1D1D1D',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Mostrando archivos del estudio:{' '}
              <strong style={{ color: '#B19BFD' }}>
                {empresas.find((e) => e.value === params.empresaId)?.data ?? '—'}
              </strong>
            </Typography>
          )}
        </Box>
      )} */}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        {estudioDocs.length === 0 ? (
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
          estudioDocs.map((doc, index) => (
            <DocumentoCard
              key={crypto.randomUUID()}
              data={doc}
              fechasActualizacion={fechas}
              fechasAprobacion={esEstudio ? null : fechasAprobacion}
              fechaLabel={esEstudio ? 'Última aprobación' : 'Última actualización'}
              fechaAprobacionLabel={esEstudio ? undefined : 'Última aprobación'}
              onDownload={descargar}
              onAprobar={
                esEstudio
                  ? undefined
                  : (asesor, base) =>
                      autorizarController.abrir({
                        aprobar: !aprobadosCtrl.estaAprobado(asesor, base),
                        estudio: asesor,
                        tabla: base.toUpperCase(),
                      })
              }
              estaAprobado={
                aprobadosCtrl.habilitado
                  ? (base) => aprobadosCtrl.estaAprobado(doc.asesor, base)
                  : undefined
              }
              panel={{
                show: !esEstudio,
                button: (
                  <Tooltip title="Agregar documento">
                    <IconButton
                      onClick={() => agregarController.abrir(doc.asesor)}
                      aria-label="Agregar documento"
                      sx={{
                        bgcolor: '#B19BFD',
                        color: '#FFFFFF',
                        width: 32,
                        height: 32,
                        '&:hover': { bgcolor: '#9B82FC' },
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ),
              }}
            />
          ))
        )}
      </Box>

      <DashboardAgregar controller={agregarController} />

      <DashboardAutorizar controller={autorizarController} />

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
