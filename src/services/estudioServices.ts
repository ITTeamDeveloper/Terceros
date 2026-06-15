import { api } from './services'

const listar = async (signal?: AbortSignal): Promise<string[]> => {
  const { data } = await api.get<string[]>('/estudios', { signal })
  return data
}

export const estudioServices = {
  listar,
}
