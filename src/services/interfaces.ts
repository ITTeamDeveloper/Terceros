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

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  message: string
  token: string
}

// ============================================================
// Documentos
// ============================================================

export interface IDocumentoListParams extends ITablaParams {
  empresaId?: string
}

export interface DocumentoListResponse {
  asesor : string,
  baseAsignacion: boolean,
  baseCDH: boolean,
  baseTelefono: boolean,
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
  fechaCreacion: string
  usuario: string
}

// ============================================================
// Descarga Historiales
// ============================================================

export interface DescargaHistorialResponse {
  id: string
  documentoNombre: string
  usuario: string
  fecha: string
  hora: string
  tablaOrigen: string
}

// ============================================================
// Sidebar
// ============================================================

export interface SidebarItem {
  sidebarId: string;
  nombre: string;
  url: string;
  icon: string;
  child: SidebarItem[] | null;
}
