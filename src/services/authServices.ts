import { api } from './services'
import type {
  LoginRequest,
  LoginResponse,
} from './interfaces'

const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/auth/login', payload)
  return data
}

export const authServices = {
  login,
}
