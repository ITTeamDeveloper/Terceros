import { useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import type { ClienteDocumentoFila } from '../../../../services/interfaces'
import { documentoServices } from '../../../../services/documentoServices'

export const useVisualizarDocumento = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [html, setHtml] = useState<string | null>(null)
  const [titulo, setTitulo] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  const abrir = async (row: ClienteDocumentoFila) => {
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    setOpen(true)
    setLoading(true)
    setError(null)
    setHtml(null)
    setTitulo(row.documentoNombre)

    try {
      const blob = await documentoServices.obtenerArchivo(row.estudio, row.documentoNombre, ctrl.signal, row.documentoId)
      const wb = XLSX.read(await blob.arrayBuffer(), { type: 'array' })
      const hoja = wb.Sheets[wb.SheetNames[0]]
      setHtml(XLSX.utils.sheet_to_html(hoja))
    } catch (err) {
      if ((err as { name?: string })?.name === 'CanceledError') return
      console.error('Error al visualizar documento:', err)
      setError('No se pudo cargar la vista previa del documento.')
    } finally {
      if (!ctrl.signal.aborted) setLoading(false)
    }
  }

  const cerrar = () => {
    abortRef.current?.abort()
    setOpen(false)
    setLoading(false)
    setError(null)
    setHtml(null)
  }

  return { open, loading, error, html, titulo, abrir, cerrar }
}
