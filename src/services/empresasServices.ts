import { api } from './services'
import type {
  EmpresaCrearRequest,
  EmpresaSelectResponse,
  ITablaParams,
  MessageResponse,
  PageResponse,
} from './interfaces'

const listar = async (
  params: ITablaParams,
  signal?: AbortSignal,
): Promise<PageResponse<EmpresaSelectResponse>> => {
  const { data } = await api.get<PageResponse<EmpresaSelectResponse>>('/empresas', {
    params,
    signal,
  })
  return data
}

const crear = async (payload: EmpresaCrearRequest): Promise<MessageResponse> => {
  const { data } = await api.post<MessageResponse>('/empresas', payload)
  return data
}

export const empresasServices = {
  listar,
  crear,
}
