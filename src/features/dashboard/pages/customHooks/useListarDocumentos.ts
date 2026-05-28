import { useCallback, useEffect, useState } from 'react'
import type { ClienteDocumento, FechasActualizacion } from '../../../../services/interfaces'
import { documentoServices } from '../../../../services/documentoServices'

const ROL_ESTUDIO = 17

interface UseListarDocumentosArgs {
  rolId?: number
}

export const useListarDocumentos = ({ rolId }: UseListarDocumentosArgs = {}) => {
  const [estudioDocs, setEstudioDocs] = useState<ClienteDocumento[]>([])
  const [fechas, setFechas] = useState<FechasActualizacion | null>(null)
  const [fechasAprobacion, setFechasAprobacion] = useState<FechasActualizacion | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const usarAprobados = rolId === ROL_ESTUDIO

  const cargar = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true)
      setError(null)
      try {
        const data = usarAprobados
          ? await documentoServices.documentoAprobados(signal)
          : await documentoServices.listar(undefined, signal)
        setEstudioDocs(data.asesores)
        setFechas(data.fechasActualizacion)
        setFechasAprobacion(data.fechasAprobacion)
      } catch (err) {
        if ((err as { name?: string })?.name === 'CanceledError') return
        console.error('Error al listar documentos:', err)
        setError('No se pudieron cargar los documentos.')
      } finally {
        setLoading(false)
      }
    },
    [usarAprobados],
  )

  useEffect(() => {
    const ctrl = new AbortController()
    void cargar(ctrl.signal)
    return () => ctrl.abort()
  }, [cargar])

  return { estudioDocs, fechas, fechasAprobacion, loading, error, refrescar: cargar }
}
