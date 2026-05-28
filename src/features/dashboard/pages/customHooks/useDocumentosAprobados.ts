import { useCallback, useEffect, useMemo, useState } from 'react'
import type { EstudioAprobado } from '../../../../services/interfaces'
import { documentoServices } from '../../../../services/documentoServices'

const ROL_ADMIN = 20

interface UseDocumentosAprobadosArgs {
  rolId?: number
}

export const useDocumentosAprobados = ({ rolId }: UseDocumentosAprobadosArgs = {}) => {
  const [aprobados, setAprobados] = useState<EstudioAprobado[]>([])
  const habilitado = rolId === ROL_ADMIN

  const cargar = useCallback(async (signal?: AbortSignal) => {
    if (!habilitado) return
    try {
      const data = await documentoServices.listadocumentosAprobados(signal)
      setAprobados(data)
    } catch (err) {
      if ((err as { name?: string })?.name === 'CanceledError') return
      console.error('Error al listar documentos aprobados:', err)
    }
  }, [habilitado])

  useEffect(() => {
    const ctrl = new AbortController()
    void cargar(ctrl.signal)
    return () => ctrl.abort()
  }, [cargar])

  const indice = useMemo(() => {
    const map = new Map<string, Set<string>>()
    for (const item of aprobados) {
      const tablasUpper = item.tablas.map((t) => t.toUpperCase())
      map.set(item.estudio, new Set(tablasUpper))
    }
    return map
  }, [aprobados])

  const estaAprobado = useCallback(
    (asesor: string, tabla: string) =>
      indice.get(asesor)?.has(tabla.toUpperCase()) ?? false,
    [indice],
  )

  return { aprobados, estaAprobado, refrescar: cargar, habilitado }
}
