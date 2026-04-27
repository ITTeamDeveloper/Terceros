import { api } from './services'
import type {
  AutorizarRequest,
  DocumentoAutorizadoResponse,
  DocumentoListResponse,
  MessageResponse,
} from './interfaces'

const subir = async (archivo: File, empresaIds: string[]): Promise<MessageResponse> => {
  const formData = new FormData()
  formData.append('archivo', archivo)
  empresaIds.forEach((id) => formData.append('empresaIds', id))

  const { data } = await api.post<MessageResponse>('/documentos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

const listar = async (): Promise<DocumentoListResponse[]> => {
  const { data } = await api.get<DocumentoListResponse[]>('/documentos')
  return data
}

const eliminar = async (documentoId: string): Promise<MessageResponse> => {
  const { data } = await api.delete<MessageResponse>(`/documentos/${documentoId}`)
  return data
}

const autorizar = async (payload: AutorizarRequest): Promise<MessageResponse> => {
  const { data } = await api.post<MessageResponse>('/documentos/autorizar', payload)
  return data
}

const listarAutorizados = async (): Promise<DocumentoAutorizadoResponse[]> => {
  const { data } = await api.get<DocumentoAutorizadoResponse[]>('/documentos/autorizados')
  return data
}

const descargar = async (documentoId: string, fileName = 'documento.xlsx'): Promise<void> => {
  const response = await api.get<Blob>(`/documentos/${documentoId}/descargar`, {
    responseType: 'blob',
  })

  const url = URL.createObjectURL(response.data)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export const documentoServices = {
  subir,
  listar,
  eliminar,
  autorizar,
  listarAutorizados,
  descargar,
}
