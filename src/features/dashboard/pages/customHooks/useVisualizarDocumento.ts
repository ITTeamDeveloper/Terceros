import { useEffect, useRef, useState } from 'react'
import type { ClienteDocumentoFila } from '../../../../services/interfaces'
import { documentoServices } from '../../../../services/documentoServices'
import type { ExcelPreviewRequest, ExcelPreviewResponse } from './excelPreview.types'

interface ExcelPreviewResult {
  html: string
  truncado: boolean
}

function procesarExcel(
  worker: Worker,
  blob: Blob,
  signal: AbortSignal,
): Promise<ExcelPreviewResult> {
  return new Promise((resolve, reject) => {
    const limpiarListeners = () => {
      signal.removeEventListener('abort', cancelar)
      worker.onmessage = null
      worker.onerror = null
    }

    const cancelar = () => {
      limpiarListeners()
      reject(new DOMException('Procesamiento cancelado.', 'AbortError'))
    }

    worker.onmessage = (event: MessageEvent<ExcelPreviewResponse>) => {
      limpiarListeners()

      if (event.data.type === 'error') {
        reject(new Error(event.data.message))
        return
      }

      resolve({ html: event.data.html, truncado: event.data.truncado })
    }

    worker.onerror = (event) => {
      limpiarListeners()
      reject(new Error(event.message || 'No se pudo procesar el archivo de Excel.'))
    }

    if (signal.aborted) {
      cancelar()
      return
    }

    signal.addEventListener('abort', cancelar, { once: true })
    const request: ExcelPreviewRequest = { blob }
    worker.postMessage(request)
  })
}

export const useVisualizarDocumento = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [html, setHtml] = useState<string | null>(null)
  const [titulo, setTitulo] = useState('')
  const [truncado, setTruncado] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      workerRef.current?.terminate()
    }
  }, [])

  const abrir = async (row: ClienteDocumentoFila) => {
    abortRef.current?.abort()
    workerRef.current?.terminate()

    const ctrl = new AbortController()
    const worker = new Worker(new URL('./excelPreview.worker.ts', import.meta.url), {
      type: 'module',
      name: 'excel-preview-worker',
    })

    abortRef.current = ctrl
    workerRef.current = worker

    setOpen(true)
    setLoading(true)
    setError(null)
    setHtml(null)
    setTruncado(false)
    setTitulo(row.documentoNombre)

    try {
      const blob = await documentoServices.obtenerArchivo(
        row.estudio,
        row.documentoNombre,
        ctrl.signal,
        row.documentoId,
      )
      const preview = await procesarExcel(worker, blob, ctrl.signal)

      setHtml(preview.html)
      setTruncado(preview.truncado)
    } catch (err) {
      const errorName = (err as { name?: string })?.name
      if (errorName === 'CanceledError' || errorName === 'AbortError') return
      console.error('Error al visualizar documento:', err)
      setError('No se pudo cargar la vista previa del documento.')
    } finally {
      if (workerRef.current === worker) {
        worker.terminate()
        workerRef.current = null
      }
      if (abortRef.current === ctrl) {
        abortRef.current = null
      }
      if (!ctrl.signal.aborted) setLoading(false)
    }
  }

  const cerrar = () => {
    abortRef.current?.abort()
    abortRef.current = null
    workerRef.current?.terminate()
    workerRef.current = null
    setOpen(false)
    setLoading(false)
    setError(null)
    setHtml(null)
    setTruncado(false)
  }

  return { open, loading, error, html, titulo, truncado, abrir, cerrar }
}
