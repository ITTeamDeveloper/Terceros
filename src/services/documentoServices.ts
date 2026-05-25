import { api } from './services'
import type {
  DocumentoListResponse,
} from './interfaces'


const listar = async (
  params: null,
): Promise<DocumentoListResponse[]> => {
  const { data } = await api.get<DocumentoListResponse[]>('/clientes/documentos', {
    params,
  })
  return data
}

const descargar = async (asesorNombre: string, tablaNombre: string): Promise<void> => {
  const response = await api.get<Blob>(`cliente/documento/${asesorNombre}/descargar/${tablaNombre}`, {
    responseType: 'blob',
  })

  const url = URL.createObjectURL(response.data)
  const link = document.createElement('a')
  link.href = url
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export const documentoServices = {
  listar,
  descargar,
}
