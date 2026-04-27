import { api } from './services'
import type { SidebarItem } from './interfaces'

const listar = async (signal?: AbortSignal): Promise<SidebarItem[]> => {
  const { data } = await api.get<SidebarItem[]>('/sidebar', { signal })
  return data
}

export const sidebarServices = {
  listar,
}
