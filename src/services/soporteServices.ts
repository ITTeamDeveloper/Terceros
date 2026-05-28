import { api } from './services'
import type { SoporteRequest } from './interfaces'

const enviarMensaje = async (data: SoporteRequest) => {
  const response = await api.post('/soporte/mensaje', data)
  return response.data
}

export const soporteServices = {
  enviarMensaje,
}
