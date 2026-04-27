import { api } from './services'
import type {
  LoginRequest,
  LoginResponse,
  MessageResponse,
  RegisterRequest,
} from './interfaces'

const register = async (payload: RegisterRequest): Promise<MessageResponse> => {
  const { data } = await api.post<MessageResponse>('/auth/register', payload)
  return data
}

const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/auth/login', payload)
  return data
}

export const authServices = {
  register,
  login,
}
