import { api } from './services'
import type { SidebarItem } from './interfaces'

const listar = async (): Promise<SidebarItem[]> => {
  const { data } = await api.get<SidebarItem[]>('/sidebar')
  return data
}

export const sidebarServices = {
  listar,
}
