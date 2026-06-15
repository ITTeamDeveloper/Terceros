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
  roles: string[]
  rol_ids?: number[]
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
export interface aprobarRequest {
  estudio: string,
  tabla: string,
  aprobar: boolean,
}

export interface EstudioAprobado {
    estudio: string;     // nombre del estudio
    tablas:  string[];   // tablas con al menos una fila vigente (desaprobado=false)
    fechaAprobacion: Record<string, string | null>;
}

  export type ClienteDocumentoEstado = "nuevo" | "aprobado";

  export interface ClienteDocumentoFila {
    documentoId?: string;
    documentoNombre: string;
    estudio: string;
    estado: ClienteDocumentoEstado;
    descargado?: boolean;
    fechaActualizacion?: string;
    fechaAprobado?: string;
    ruta?: string;
  }

export interface DocumentoListResponse {
    fechasAprobacion: FechasActualizacion;
    fechasActualizacion: FechasActualizacion;
    asesores: ClienteDocumento[];
  }

export  interface FechasActualizacion {
    baseAsignacion: string | null;  // ISO-8601 LocalDateTime, ej: "2026-05-26T10:30:00"
    baseCDH:        string | null;
    baseTelefono:   string | null;
    otros?:         Record<string, string | null>;
  }

export  interface ClienteDocumento {
    asesor:         string;
    baseAsignacion: boolean;
    baseCDH:        boolean;
    baseTelefono:   boolean;
    otros?:         Record<string, boolean>;
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
// Soporte
// ============================================================

export interface SoporteRequest {
  subject: string
  message: string
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
