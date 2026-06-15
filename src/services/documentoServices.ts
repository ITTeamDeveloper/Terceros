import { api } from './services'
import type {
  aprobarRequest,
  DocumentoListResponse,
  ClienteDocumentoFila,
  EstudioAprobado,
  FechasActualizacion,
  IDocumentoListParams,
  ITablaParams,
  PageResponse,
} from './interfaces'


const listar = async (
  params: ITablaParams,
  signal?: AbortSignal,
): Promise<PageResponse<ClienteDocumentoFila>> => {
  const { data } = await api.get<PageResponse<ClienteDocumentoFila>>('/clientes/documentos', {
    params,
    signal,
  })
  return data
}

// Archivos grandes pueden tardar bastante; usamos un timeout amplio en vez del global (15s).
const ARCHIVO_TIMEOUT_MS = 120000

const obtenerArchivo = async (
  asesorNombre: string,
  tablaNombre: string,
  signal?: AbortSignal,
  documentoId?: string | null
): Promise<Blob> => {
  const { data } = await api.get<Blob>(
    `cliente/documento/${asesorNombre}/descargar/${tablaNombre}`,
    { responseType: 'blob', signal, timeout: ARCHIVO_TIMEOUT_MS, params: { id: documentoId } },
  )
  return data
}

const descargar = async (asesorNombre: string, tablaNombre: string, documentoId?: string | null): Promise<void> => {
  const response = await api.get<Blob>(`cliente/documento/${asesorNombre}/descargar/${tablaNombre}`, {
    responseType: 'blob',
    timeout: ARCHIVO_TIMEOUT_MS,
    params: { id: documentoId },
  })

  const url = URL.createObjectURL(response.data)
  const link = document.createElement('a')
  link.href = url
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

const aprobar = async (data: aprobarRequest) => {
  const response = await api.post('cliente/documentos/aprobar', data, {timeout: ARCHIVO_TIMEOUT_MS})
  return response.data
}

interface ClienteDocumentoAprobadoRaw {
  asesor: string
  baseAsignacion: boolean
  baseCDH: boolean
  baseTelefono: boolean
  otras?: Record<string, boolean>
  otros?: Record<string, boolean>
}

type RespuestaDocumentosRaw =
  | ClienteDocumentoAprobadoRaw[]
  | {
      asesores: ClienteDocumentoAprobadoRaw[]
      fechasActualizacion?: FechasActualizacion
      fechasAprobacion?: FechasActualizacion
    }

const fechasVacias = (): FechasActualizacion => ({
  baseAsignacion: null,
  baseCDH: null,
  baseTelefono: null,
})

// const normalizarRespuestaDocumentos = (data: RespuestaDocumentosRaw): DocumentoListResponse => {
//   const rawAsesores = Array.isArray(data) ? data : data.asesores ?? []
//   const fechasActualizacion =
//     !Array.isArray(data) && data.fechasActualizacion
//       ? data.fechasActualizacion
//       : fechasVacias()
//   const fechasAprobacion =
//     !Array.isArray(data) && data.fechasAprobacion
//       ? data.fechasAprobacion
//       : fechasVacias()

//   return {
//     fechasActualizacion,
//     fechasAprobacion,
//     asesores: rawAsesores.map(({ otras, otros, ...rest }) => ({
//       ...rest,
//       otros: otros ?? otras,
//     })),
//   }
// }

const documentoAprobados = async (
  signal?: AbortSignal,
): Promise<ClienteDocumentoFila[]> => {
  const { data } = await api.get<ClienteDocumentoFila[]>(
    'clientes/documentosAprobados',
    { signal },
  )
  return data
}

const listadocumentosAprobados = async (
  signal?: AbortSignal,
): Promise<EstudioAprobado[]> => {
  const { data } = await api.get<EstudioAprobado[]>('cliente/documento/listaAprobados', {
    signal,
  })
  return data
}

const agregarDocumento = async (
  estudio: string,
  files: File[],
) => {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))

  const { data } = await api.post(
    'cliente/documento/agregar',
    formData,
    {
      params: { estudio },
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )
  return data
}

const aprobarDescarga = async (
  aprobar : boolean,
  documentoId: string
) => {
  const {data} = await api.put('cliente/aprobarDescarga', {aprobar, documentoId})

  return data;
}

export const documentoServices = {
  listar,
  obtenerArchivo,
  descargar,
  aprobar,
  documentoAprobados,
  listadocumentosAprobados,
  agregarDocumento,
  aprobarDescarga
}
