// ============================================================
// JWT
// ============================================================

export interface JwtPayload {
  sub: string
  rol: 'admin' | 'user'
  usuario_id: string
  nombre: string,
  empresa:string,
  empresa_id: string | null
  iat: number
  exp: number
}

// ============================================================
// Auth
// ============================================================

export interface RegisterRequest {
  nombre: string
  apellido: string
  email: string
  password: string
}

export interface MessageResponse {
  message: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  token: string
}

// ============================================================
// Documentos
// ============================================================

export interface DocumentoListResponse {
  documentoId: string
  documentoEmpresaId: string
  empresaId: string
  empresaNombre: string
  documentoNombre: string
  urlDescarga: string
  autorizado: boolean
}

export interface AutorizarRequest {
  documentoEmpresaId: string
  autorizado: boolean
}

export interface DocumentoAutorizadoResponse {
  documentoId: string
  nombre: string
  urlDescarga: string
}

// ============================================================
// Empresas
// ============================================================

export interface EmpresaComboResponse {
  data: string
  value: string
}
