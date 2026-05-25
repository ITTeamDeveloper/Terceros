import { api } from './services'
import type {
  DescargaHistorialResponse,
  ITablaParams,
  PageResponse,
} from './interfaces'

const listar = async (
  params: ITablaParams,
  signal?: AbortSignal,
): Promise<PageResponse<DescargaHistorialResponse>> => {
  const { data } = await api.get<PageResponse<DescargaHistorialResponse>>(
    '/cliente/historial',
    { params, signal },
  )
  return data
}

export const historialDeDescargas = {
  listar,
}
