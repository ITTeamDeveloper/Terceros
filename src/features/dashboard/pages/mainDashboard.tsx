import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import {
  CloudDownloadOutlined as CloudDownloadIcon,
  LockOutlined as LockIcon,
  LockOpenOutlined as LockOpenIcon,
} from '@mui/icons-material'
import { SharedTable } from '../../../shared/components'
import type { ComboOption } from '../../../shared/components'
import type { ColumnDef, TableAction } from '../../../shared/types/table.types'
import { documentoServices } from '../../../services/documentoServices'
import { empresasServices } from '../../../services/empresasServices'
import type {
  DocumentoAutorizadoResponse,
  DocumentoListResponse,
} from '../../../services/interfaces'
import { useAuth } from '../../auth/context/AuthContext'
import { useAgregarDocumento } from './customHooks/useAgregarDocumento'
import { useAutorizarDocumento } from './customHooks/useAutorizarDocumento'
import { DashboardAgregar } from './components/dashboardAgregar'
import { DashboardAutorizar } from './components/dashboardAutorizar'

type DashboardRow = {
  documentoId: string
  documentoEmpresaId?: string
  empresaNombre?: string
  documentoNombre: string
  autorizado?: boolean
}

const mapAdminRow = (d: DocumentoListResponse): DashboardRow => ({
  documentoId: d.documentoId,
  documentoEmpresaId: d.documentoEmpresaId,
  empresaNombre: d.empresaNombre,
  documentoNombre: d.documentoNombre,
  autorizado: d.autorizado,
})

const mapUserRow = (d: DocumentoAutorizadoResponse): DashboardRow => ({
  documentoId: d.documentoId,
  documentoNombre: d.nombre,
})

const adminColumns: ColumnDef<DashboardRow>[] = [
  { label: 'Empresa', key: 'empresaNombre' },
  { label: 'Documento', key: 'documentoNombre' },
  { label: 'Autorizado', key: 'autorizado', render: (value: boolean) => (value ? 'Sí' : 'No') },
]

const userColumns: ColumnDef<DashboardRow>[] = [
  { label: 'Documento', key: 'documentoNombre' },
]

function MainDashboard() {
  const { payload } = useAuth()
  const isAdmin = payload?.rol === 'admin'

  const [docs, setDocs] = useState<DashboardRow[]>([])
  const [loading, setLoading] = useState(false)

  const [empresas, setEmpresas] = useState<ComboOption[]>([])
  const [loadingEmpresas, setLoadingEmpresas] = useState(false)

  const fetchDocs = useMemo(
    () =>
      isAdmin
        ? async () => (await documentoServices.listar()).map(mapAdminRow)
        : async () => (await documentoServices.listarAutorizados()).map(mapUserRow),
    [isAdmin],
  )

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchDocs()
      setDocs(data)
    } finally {
      setLoading(false)
    }
  }

  const loadEmpresas = async () => {
    setLoadingEmpresas(true)
    try {
      const data = await empresasServices.listar()
      setEmpresas(data)
    } finally {
      setLoadingEmpresas(false)
    }
  }

  useEffect(() => {
    load()
    if (isAdmin) loadEmpresas()
  }, [isAdmin])

  const agregar = useAgregarDocumento({ onSuccess: load })
  const autorizar = useAutorizarDocumento({ onSuccess: load })

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

  const columns = isAdmin ? adminColumns : userColumns
  const actions: TableAction<DashboardRow>[] = isAdmin
    ? [descargarAction, autorizarAction]
    : [descargarAction]

  return (
    <Box sx={{ p: 3 }}>
      <SharedTable
        columns={columns}
        data={docs}
        actions={actions}
        loading={loading}
        onAdd={isAdmin ? agregar.abrir : undefined}
      />

      {isAdmin && (
        <>
          <DashboardAutorizar controller={autorizar} />
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
