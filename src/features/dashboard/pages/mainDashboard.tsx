import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import {
  CloudDownloadOutlined as CloudDownloadIcon,
  // DeleteOutlined as DeleteIcon,
  FilterAltOutlined as FilterIcon,
  LockOutlined as LockIcon,
  LockOpenOutlined as LockOpenIcon,
} from '@mui/icons-material'
import { SharedSelect, SharedTable } from '../../../shared/components'
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

function MainDashboard() {
  const { payload } = useAuth()
  const isAdmin = payload?.rol === 'admin'

  const [docs, setDocs] = useState<DocumentoListResponse[]>([])
  const [total, setTotal] = useState(0)
  const [params, setParams] = useState<IDocumentoListParams>({
    search: '',
    skip: 0,
    take: 10,
    empresaId: payload?.empresa_id ?? undefined,
  })

  const [empresas, setEmpresas] = useState<ComboOption[]>([])
  const [loadingEmpresas, setLoadingEmpresas] = useState(false)
  const [empresaFiltro, setEmpresaFiltro] = useState<ComboOption | null>(null)
  const { estudioDocs } = useListarDocumentos()
  const {descargar} = useDescargarDocumento()
  const loadAbortRef = useRef<AbortController | null>(null)


  const handleAplicarFiltro = () => {
    setParams((p) => ({ ...p, empresaId: empresaFiltro?.value, skip: 0 }))
  }

  const handlePageChange = (page: number, pageSize: number) => {
    setParams((p) => ({ ...p, skip: page * pageSize, take: pageSize }))
  }

  const handleSearch = (term: string) => {
    setParams((p) => ({ ...p, search: term, skip: 0 }))
  }


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

      {isAdmin && (
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
      )}

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
            <DocumentoCard key={`${doc.asesor}-${index}`} data={doc}  onDownload={descargar}/>
          ))
        )}
      </Box>
    </Box>
  )
}

export default MainDashboard
