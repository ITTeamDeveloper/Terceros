import { useCallback, useEffect, useRef, useState } from 'react'
import { estudioServices } from '../../../../services/estudioServices'
import type { ComboOption } from '../../../../shared/components'

export function useEstudios() {
  const [estudioData, setEstudioData] = useState<ComboOption[]>([])
  const [loading, setLoading] = useState(false)
  const cargadoRef = useRef(false)
  const peticionRef = useRef<Promise<void> | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const cargarEstudios = useCallback((): Promise<void> => {
    if (cargadoRef.current) return Promise.resolve()
    if (peticionRef.current) return peticionRef.current

    const abortController = new AbortController()
    abortControllerRef.current = abortController
    setLoading(true)

    const peticion = estudioServices
      .listar(abortController.signal)
      .then((listaEstudios) => {
        if (abortController.signal.aborted) return

        setEstudioData(
          listaEstudios.map((estudio, index) => ({
            data: estudio,
            value: String(index),
          })),
        )
        cargadoRef.current = true
      })
      .catch((error: unknown) => {
        if (!abortController.signal.aborted) {
          console.error('Error al listar los estudios:', error)
        }
      })
      .finally(() => {
        peticionRef.current = null

        if (!abortController.signal.aborted) {
          abortControllerRef.current = null
          setLoading(false)
        }
      })

    peticionRef.current = peticion
    return peticion
  }, [])

  useEffect(
    () => () => {
      abortControllerRef.current?.abort()
    },
    [],
  )

  return { estudioData, loading, cargarEstudios }
}
