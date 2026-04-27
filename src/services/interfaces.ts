// ============================================================
// Tabla
// ============================================================

export interface ITablaParams {
  search?: string
  skip?: number
  take?: number
}

export interface PageResponse<T> {
  data: T[]
  total: number
  page: number
  pages: number
}

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
  documentoEmpresaId: string
  documentoId: string
  empresaId: string
  empresaNombre: string
  documentoNombre: string
  urlDescarga: string
  autorizado: boolean
  fechaCreacion: string; 
}

export interface AutorizarRequest {
  documentoEmpresaId: string
  autorizado: boolean
}

export interface DocumentoAutorizadoListResponse {
  documentoEmpresaId: string
  documentoId: string
  empresaId: string
  empresaNombre: string
  nombre: string
  urlDescarga: string | null
  autorizado: boolean
  fechaSubida:  string; 
}

// ============================================================
// Empresas
// ============================================================

export interface EmpresaSelectResponse {
  data: string
  value: string
}

export interface EmpresaCrearRequest {
  nombre: string
}

// ============================================================
// Descarga Historiales
// ============================================================

export interface DescargaHistorialResponse {
  descargaHistorialId: string
  documentoNombre: string
  usuario: string
  empresa: string
  fechaDescarga: string
}

// ============================================================
// Sidebar
// ============================================================

export interface SidebarItem {
  sidebarId: string
  nombre: string
  url: string
  icon: string
}
