import { useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import type { ClienteDocumentoFila } from '../../../../services/interfaces'
import { documentoServices } from '../../../../services/documentoServices'

// Tope de celdas a renderizar: sheet_to_html arma toda la hoja como un único
// <table>; con miles de filas/columnas el DOM es tan grande que el navegador se
// congela al hacer scroll. Acotamos el rango para mantener la vista fluida.
export const MAX_FILAS = 1500
export const MAX_COLS = 60

export const useVisualizarDocumento = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [html, setHtml] = useState<string | null>(null)
  const [titulo, setTitulo] = useState('')
  const [truncado, setTruncado] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const abrir = async (row: ClienteDocumentoFila) => {
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    setOpen(true)
    setLoading(true)
    setError(null)
    setHtml(null)
    setTruncado(false)
    setTitulo(row.documentoNombre)

    try {
      const blob = await documentoServices.obtenerArchivo(row.estudio, row.documentoNombre, ctrl.signal, row.documentoId)
      const wb = XLSX.read(await blob.arrayBuffer(), { type: 'array' })
      const hoja = wb.Sheets[wb.SheetNames[0]]

      // Acotamos el rango cuando la hoja es muy grande para no congelar el DOM.
      if (hoja['!ref']) {
        const range = XLSX.utils.decode_range(hoja['!ref'])
        const excedeFilas = range.e.r - range.s.r + 1 > MAX_FILAS
        const excedeCols = range.e.c - range.s.c + 1 > MAX_COLS
        if (excedeFilas || excedeCols) {
          range.e.r = Math.min(range.e.r, range.s.r + MAX_FILAS - 1)
          range.e.c = Math.min(range.e.c, range.s.c + MAX_COLS - 1)
          hoja['!ref'] = XLSX.utils.encode_range(range)
          // Descartamos las combinaciones que queden fuera del rango recortado.
          if (hoja['!merges']) {
            hoja['!merges'] = hoja['!merges'].filter(
              (m) => m.s.r <= range.e.r && m.s.c <= range.e.c,
            )
          }
          setTruncado(true)
        }
      }

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
    setTruncado(false)
  }

  return { open, loading, error, html, titulo, truncado, abrir, cerrar }
}
