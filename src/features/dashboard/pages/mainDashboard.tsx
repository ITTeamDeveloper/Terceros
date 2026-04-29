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
import { empresasServices } from '../../../services/empresasServices'
import type {
  DocumentoAutorizadoListResponse,
  DocumentoListResponse,
  IDocumentoListParams,
} from '../../../services/interfaces'
import { useAuth } from '../../auth/context/AuthContext'
import { useAgregarDocumento } from './customHooks/useAgregarDocumento'
import { useAutorizarDocumento } from './customHooks/useAutorizarDocumento'
import { useEliminarDocumento } from './customHooks/useEliminarDocumento'
import { DashboardAgregar } from './components/dashboardAgregar'
import { DashboardAutorizar } from './components/dashboardAutorizar'
import { DashboardEliminar } from './components/dashboardEliminar'

type DashboardRow = {
  documentoId: string
  documentoEmpresaId?: string
  empresaNombre?: string
  documentoNombre: string
  autorizado?: boolean
  creadoEn?: string
  fechaSubida?: string
}

const mapAdminRow = (d: DocumentoListResponse): DashboardRow => ({
  documentoId: d.documentoId,
  documentoEmpresaId: d.documentoEmpresaId,
  empresaNombre: d.empresaNombre,
  documentoNombre: d.documentoNombre,
  autorizado: d.autorizado,
  creadoEn: d.fechaCreacion,
})

const mapUserRow = (d: DocumentoAutorizadoListResponse): DashboardRow => ({
  documentoId: d.documentoId,
  documentoEmpresaId: d.documentoEmpresaId,
  empresaNombre: d.empresaNombre,
  documentoNombre: d.nombre,
  autorizado: d.autorizado,
  fechaSubida: d.fechaSubida,
})

const adminColumns: ColumnDef<DashboardRow>[] = [
  { label: 'Estudio', key: 'empresaNombre' },
  { label: 'Archivo', key: 'documentoNombre' },
  { label: 'Autorizado', key: 'autorizado', render: (value: boolean) => (value ? 'Sí' : 'No') },
  { label: 'Fecha', key: 'creadoEn' },
]

const userColumns: ColumnDef<DashboardRow>[] = [
  { label: 'Archivo', key: 'documentoNombre' },
  { label: 'Fecha', key: 'fechaSubida' },
]

function MainDashboard() {
  const { payload } = useAuth()
  const isAdmin = payload?.rol === 'admin'

  const [docs, setDocs] = useState<DashboardRow[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<IDocumentoListParams>({
    search: '',
    skip: 0,
    take: 10,
    empresaId: payload?.empresa_id ?? undefined,
  })

  const [empresas, setEmpresas] = useState<ComboOption[]>([])
  const [loadingEmpresas, setLoadingEmpresas] = useState(false)
  const [empresaFiltro, setEmpresaFiltro] = useState<ComboOption | null>(null)

  const loadAbortRef = useRef<AbortController | null>(null)

  const load = async () => {
    loadAbortRef.current?.abort()
    const ctrl = new AbortController()
    loadAbortRef.current = ctrl
    const { signal } = ctrl

    setLoading(true)
    try {
      if (isAdmin) {
        const res = await documentoServices.listar(params, signal)
        if (signal.aborted) return
        setDocs(res.data.map(mapAdminRow))
        setTotal(res.total)
      } else {
        const res = await documentoServices.listarAutorizados(params, signal)
        if (signal.aborted) return
        setDocs(res.data.map(mapUserRow))
        setTotal(res.total)
      }
    } catch (err) {
      if (signal.aborted) return
      throw err
    } finally {
      if (!signal.aborted) setLoading(false)
    }
  }

  const loadEmpresas = async () => {
    setLoadingEmpresas(true)
    try {
      const { data } = await empresasServices.listar({})
      setEmpresas(data)
    } finally {
      setLoadingEmpresas(false)
    }
  }

  useEffect(() => {
    load()
    return () => loadAbortRef.current?.abort()
  }, [params, isAdmin])

  useEffect(() => {
    if (isAdmin && empresas.length === 0 && !loadingEmpresas) {
      loadEmpresas()
    }
  }, [isAdmin])

  const handleAplicarFiltro = () => {
    setParams((p) => ({ ...p, empresaId: empresaFiltro?.value, skip: 0 }))
  }

  const handlePageChange = (page: number, pageSize: number) => {
    setParams((p) => ({ ...p, skip: page * pageSize, take: pageSize }))
  }

  const handleSearch = (term: string) => {
    setParams((p) => ({ ...p, search: term, skip: 0 }))
  }

  const agregar = useAgregarDocumento({ onSuccess: load })
  const autorizar = useAutorizarDocumento({ onSuccess: load })
  const eliminar = useEliminarDocumento({ onSuccess: load })

  const handleAgregarAbrir = () => {
    if (empresas.length === 0) loadEmpresas()
    agregar.abrir()
  }

  const handleDescargar = async (row: DashboardRow) => {
    await documentoServices.descargar(row.documentoId, row.documentoNombre)
  }

  const descargarAction: TableAction<DashboardRow> = {
    label: 'Descargar',
    icon: <CloudDownloadIcon sx={{ fontSize: 18, color: '#B19BFD' }} />,
    onClick: handleDescargar,
  }

  // const eliminarAction: TableAction<DashboardRow> = {
  //   label: 'Eliminar',
  //   icon: <DeleteIcon sx={{ fontSize: 18, color: '#B23A3A' }} />,
  //   onClick: (row) =>
  //     eliminar.abrir({
  //       documentoId: row.documentoId,
  //       documentoNombre: row.documentoNombre,
  //       empresaNombre: row.empresaNombre,
  //     }),
  // }

  const autorizarAction: TableAction<DashboardRow> = {
    label: (row) => (row.autorizado ? 'Desautorizar' : 'Autorizar'),
    icon: (row) =>
      row.autorizado ? (
        <LockIcon sx={{ fontSize: 18, color: '#1B7F3A' }} />
      ) : (
        <LockOpenIcon sx={{ fontSize: 18, color: '#B23A3A' }} />
      ),
    onClick: (row) =>
      autorizar.abrir({
        documentoEmpresaId: row.documentoEmpresaId,
        autorizado: row.autorizado,
        documentoNombre: row.documentoNombre,
        empresaNombre: row.empresaNombre,
      }),
  }

  const columns = isAdmin ? adminColumns : userColumns
  const actions: TableAction<DashboardRow>[] = isAdmin
    ? [autorizarAction /*, eliminarAction*/]
    : [descargarAction]

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
          bgcolor: '#FFFFFF',
          border: '1px solid #EAE5FF',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <SharedTable
          // title="Documentos"
          columns={columns}
          data={docs}
          actions={actions}
          loading={loading}
          onAdd={isAdmin ? handleAgregarAbrir : undefined}
          onRefresh={() => load()}
          onSearch={handleSearch}
          onSearchInput={() => loadAbortRef.current?.abort()}
          searchPlaceholder="Buscar por archivo ..."
          onPageChange={handlePageChange}
          totalItems={total}
        />
      </Box>

      {isAdmin && (
        <>
          <DashboardAutorizar controller={autorizar} />
          <DashboardEliminar controller={eliminar} />
          <DashboardAgregar
            controller={agregar}
            empresas={empresas}
            loadingEmpresas={loadingEmpresas}
          />
        </>
      )}
    </Box>
  )
}

export default MainDashboard
