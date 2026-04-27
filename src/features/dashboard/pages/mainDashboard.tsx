import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {
  CloudDownloadOutlined as CloudDownloadIcon,
  DeleteOutlined as DeleteIcon,
  LockOutlined as LockIcon,
  LockOpenOutlined as LockOpenIcon,
} from '@mui/icons-material'
import { SharedTable } from '../../../shared/components'
import { typo } from '../../../shared/styles/typography'
import type { ComboOption } from '../../../shared/components'
import type { ColumnDef, TableAction } from '../../../shared/types/table.types'
import { documentoServices } from '../../../services/documentoServices'
import { empresasServices } from '../../../services/empresasServices'
import type {
  DocumentoAutorizadoListResponse,
  DocumentoListResponse,
  ITablaParams,
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
  { label: 'Empresa', key: 'empresaNombre' },
  { label: 'Documento', key: 'documentoNombre' },
  { label: 'Autorizado', key: 'autorizado', render: (value: boolean) => (value ? 'Sí' : 'No') },
  { label: 'Fecha', key: 'creadoEn' },
]

const userColumns: ColumnDef<DashboardRow>[] = [
  { label: 'Documento', key: 'documentoNombre' },
  { label: 'Fecha', key: 'fechaSubida' },
]

function MainDashboard() {
  const { payload } = useAuth()
  const isAdmin = payload?.rol === 'admin'

  const [docs, setDocs] = useState<DashboardRow[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<ITablaParams>({ search: '', skip: 0, take: 10 })

  const [empresas, setEmpresas] = useState<ComboOption[]>([])
  const [loadingEmpresas, setLoadingEmpresas] = useState(false)

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

  const autorizarAction: TableAction<DashboardRow> = {
    label: (row) => (row.autorizado ? 'Desautorizar' : 'Autorizar'),
    icon: (row) =>
      row.autorizado ? (
        <LockIcon sx={{ fontSize: 18, color: '#1B7F3A' }} />
      ) : (
        <LockOpenIcon sx={{ fontSize: 18, color: '#B23A3A' }} />
      ),
    onClick: autorizar.abrir,
  }

  const eliminarAction: TableAction<DashboardRow> = {
    label: 'Eliminar',
    icon: <DeleteIcon sx={{ fontSize: 18, color: '#B23A3A' }} />,
    onClick: (row) =>
      eliminar.abrir({
        documentoId: row.documentoId,
        documentoNombre: row.documentoNombre,
        empresaNombre: row.empresaNombre,
      }),
  }

  const columns = isAdmin ? adminColumns : userColumns
  const actions: TableAction<DashboardRow>[] = isAdmin
    ? [descargarAction, autorizarAction, eliminarAction]
    : [descargarAction]

  const intro = isAdmin
    ? {
        title: 'Asignaciones de documentos',
        description:
          'Administra los documentos asignados a cada empresa tercera. Desde aquí puedes agregar nuevos documentos, autorizar o desautorizar su descarga, descargarlos y eliminarlos cuando ya no sean necesarios.',
      }
    : {
        title: 'Mis documentos asignados',
        description:
          'Consulta los documentos que tu empresa tiene autorizados para descargar. Aquí ves el listado completo y puedes descargar cada documento cuando lo necesites.',
      }

  return (
    <Box sx={{ pt: 3, px: 4, pb: 3.5 }}>
      <Box sx={{ mb: 2.5, maxWidth: 760 }}>
        <Typography sx={{ ...typo.h2, mb: 0.75 }}>{intro.title}</Typography>
        <Typography sx={typo.subtitle}>{intro.description}</Typography>
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
          // title="Documentos"
          columns={columns}
          data={docs}
          actions={actions}
          loading={loading}
          onAdd={isAdmin ? handleAgregarAbrir : undefined}
          onRefresh={() => load()}
          onSearch={handleSearch}
          onSearchInput={() => loadAbortRef.current?.abort()}
          searchPlaceholder="Buscar por documento ..."
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
