import { api } from './services'
import type { EmpresaComboResponse } from './interfaces'

const listar = async (): Promise<EmpresaComboResponse[]> => {
  const { data } = await api.get<EmpresaComboResponse[]>('/empresas')
  return data
}

export const empresasServices = {
  listar,
}
