import { api } from './services'
import type {
  AutorizarRequest,
  DocumentoAutorizadoListResponse,
  DocumentoListResponse,
  ITablaParams,
  MessageResponse,
  PageResponse,
} from './interfaces'

const subir = async (archivos: File[], empresaId: string): Promise<MessageResponse> => {
  const formData = new FormData()
  archivos.forEach((archivo) => formData.append('archivos', archivo))
  formData.append('empresaId', empresaId)

  const { data } = await api.post<MessageResponse>('/documentos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

const listar = async (
  params: ITablaParams,
  signal?: AbortSignal,
): Promise<PageResponse<DocumentoListResponse>> => {
  const { data } = await api.get<PageResponse<DocumentoListResponse>>('/documentos', {
    params,
    signal,
  })
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

const listarAutorizados = async (
  params: ITablaParams,
  signal?: AbortSignal,
): Promise<PageResponse<DocumentoAutorizadoListResponse>> => {
  const { data } = await api.get<PageResponse<DocumentoAutorizadoListResponse>>(
    '/documentos/autorizados',
    { params, signal },
  )
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
