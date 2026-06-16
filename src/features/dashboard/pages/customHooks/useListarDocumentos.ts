import { useCallback, useEffect, useRef, useState } from 'react'
import type { ClienteDocumento, ClienteDocumentoFila, FechasActualizacion, ITablaParams } from '../../../../services/interfaces'
import { documentoServices } from '../../../../services/documentoServices'

const ROL_ESTUDIO = 17

interface UseListarDocumentosArgs {
  rolId?: number
  aprobados?: boolean
}

interface IDocumentoTable extends ITablaParams {
  estado ?: boolean,
  estudio ?: string,
  aprobados ?: boolean
}

export const useListarDocumentos = ({ rolId, aprobados }: UseListarDocumentosArgs = {}) => {
  const [documentos, setDocumentos] = useState<ClienteDocumentoFila[]>([]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [params, setParams] = useState<IDocumentoTable>({ search: '', skip: 0, take: 10, aprobados: aprobados })
  const [total, setTotal] = useState<number>(0);
  const loadAbortRef = useRef<AbortController | null>(null)
  const usarAprobados = rolId === ROL_ESTUDIO

  const cargar = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true)
      setError(null)
      try {

        let filas: ClienteDocumentoFila[]
        let totalFilas: number
        if (usarAprobados) {
          const data = await documentoServices.documentoAprobados(signal)
          filas = data
          totalFilas = filas.length
        } else {
          const page = await documentoServices.listar(params, signal)
          filas = page.data
          totalFilas = page.total
        }

        setDocumentos(filas ?? [])
        setTotal(totalFilas ?? 0)
      } catch (err) {
        if ((err as { name?: string })?.name === 'CanceledError') return
        console.error('Error al listar documentos:', err)
        setError('No se pudieron cargar los documentos.')
      } finally {
        setLoading(false)
      }
    },
    [params],
  )

  useEffect(() => {
    const ctrl = new AbortController()
    loadAbortRef.current = ctrl
    cargar(ctrl.signal)
    return () => ctrl.abort()
  }, [cargar])

  const handlePageChange = (page: number, pageSize: number) => {
    setParams((p) => ({ ...p, skip: page * pageSize, take: pageSize }))
  }

  const handleSearch = (term: string) => {
    setParams((p) => ({ ...p, search: term, skip: 0 }))
  }

  const handleFilter = (estado ?: boolean, estudio ?:string) => {
    setParams((p) => ({ ...p, estado: estado,  estudio: estudio}));
  }

  const cancelSearch = () => loadAbortRef.current?.abort()


  return {
    documentos, loading, error, refrescar: cargar, handlePageChange,
    handleSearch, cancelSearch, total, handleFilter
  }
}
