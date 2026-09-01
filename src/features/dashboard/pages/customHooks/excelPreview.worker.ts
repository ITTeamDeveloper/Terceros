/// <reference lib="webworker" />

import * as XLSX from 'xlsx'
import type { ExcelPreviewRequest, ExcelPreviewResponse } from './excelPreview.types'

// Es un límite de seguridad para el DOM, no paginación: la vista sigue siendo
// una sola tabla continua y el usuario no tiene que cambiar de página.
const MAX_FILAS = 1200
const MAX_COLUMNAS = 60

function mensajeError(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo procesar el archivo de Excel.'
}

self.onmessage = async (event: MessageEvent<ExcelPreviewRequest>) => {
  try {
    const buffer = await event.data.blob.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })
    const nombreHoja = workbook.SheetNames[0]

    if (!nombreHoja) {
      throw new Error('El archivo no contiene hojas para mostrar.')
    }

    const hoja = workbook.Sheets[nombreHoja]
    let truncado = false

    if (hoja['!ref']) {
      const rango = XLSX.utils.decode_range(hoja['!ref'])
      const excedeFilas = rango.e.r - rango.s.r + 1 > MAX_FILAS
      const excedeColumnas = rango.e.c - rango.s.c + 1 > MAX_COLUMNAS

      if (excedeFilas || excedeColumnas) {
        rango.e.r = Math.min(rango.e.r, rango.s.r + MAX_FILAS - 1)
        rango.e.c = Math.min(rango.e.c, rango.s.c + MAX_COLUMNAS - 1)
        hoja['!ref'] = XLSX.utils.encode_range(rango)

        if (hoja['!merges']) {
          hoja['!merges'] = hoja['!merges'].filter(
            (merge) => merge.s.r <= rango.e.r && merge.s.c <= rango.e.c,
          )
        }

        truncado = true
      }
    }

    const response: ExcelPreviewResponse = {
      type: 'success',
      html: XLSX.utils.sheet_to_html(hoja),
      truncado,
    }
    self.postMessage(response)
  } catch (error) {
    const response: ExcelPreviewResponse = {
      type: 'error',
      message: mensajeError(error),
    }
    self.postMessage(response)
  }
}

export {}
