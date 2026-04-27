import { useEffect, useRef, useState } from 'react'
import type { AxiosError } from 'axios'
import { empresasServices } from '../../../../services/empresasServices'
import type {
  EmpresaSelectResponse,
  ITablaParams,
} from '../../../../services/interfaces'

interface FeedbackState {
  open: boolean
  message: string
  statusCode?: number
}

export function useEmpresasTerceras() {
  const [data, setData] = useState<EmpresaSelectResponse[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<ITablaParams>({ search: '', skip: 0, take: 10 })
  const [feedback, setFeedback] = useState<FeedbackState>({ open: false, message: '' })

  const loadAbortRef = useRef<AbortController | null>(null)

  const load = async () => {
    loadAbortRef.current?.abort()
    const ctrl = new AbortController()
    loadAbortRef.current = ctrl
    const { signal } = ctrl

    setLoading(true)
    try {
      const res = await empresasServices.listar(params, signal)
      if (signal.aborted) return
      setData(res.data)
      setTotal(res.total)
    } catch (err) {
      if (signal.aborted) return
      const axiosErr = err as AxiosError<{ message?: string; error?: string }>
      const status = axiosErr.response?.status ?? 500
      const message =
        axiosErr.response?.data?.message ??
        axiosErr.response?.data?.error ??
        'No se pudo cargar las empresas terceras'
      setFeedback({ open: true, message, statusCode: status })
    } finally {
      if (!signal.aborted) setLoading(false)
    }
  }

  useEffect(() => {
    load()
    return () => loadAbortRef.current?.abort()
  }, [params])

  const handlePageChange = (page: number, pageSize: number) => {
    setParams((p) => ({ ...p, skip: page * pageSize, take: pageSize }))
  }

  const handleSearch = (term: string) => {
    setParams((p) => ({ ...p, search: term, skip: 0 }))
  }

  const cancelSearch = () => loadAbortRef.current?.abort()

  const cerrarFeedback = () => setFeedback((f) => ({ ...f, open: false }))

  return {
    data,
    total,
    loading,
    feedback,
    cerrarFeedback,
    load,
    handlePageChange,
    handleSearch,
    cancelSearch,
  }
}
