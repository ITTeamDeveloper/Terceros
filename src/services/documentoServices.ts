import { api } from './services'
import type {
  aprobarRequest,
  DocumentoListResponse,
  EstudioAprobado,
  FechasActualizacion,
  IDocumentoListParams,
} from './interfaces'


const listar = async (
  params?: IDocumentoListParams,
  signal?: AbortSignal,
): Promise<DocumentoListResponse> => {
  const { data } = await api.get<RespuestaDocumentosRaw>('/clientes/documentos', {
    params,
    signal,
  })
  return normalizarRespuestaDocumentos(data)
}

const descargar = async (asesorNombre: string, tablaNombre: string): Promise<void> => {
  const response = await api.get<Blob>(`cliente/documento/${asesorNombre}/descargar/${tablaNombre}`, {
    responseType: 'blob',
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
  const response = await api.post('cliente/documentos/aprobar', data)
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

const normalizarRespuestaDocumentos = (data: RespuestaDocumentosRaw): DocumentoListResponse => {
  const rawAsesores = Array.isArray(data) ? data : data.asesores ?? []
  const fechasActualizacion =
    !Array.isArray(data) && data.fechasActualizacion
      ? data.fechasActualizacion
      : fechasVacias()
  const fechasAprobacion =
    !Array.isArray(data) && data.fechasAprobacion
      ? data.fechasAprobacion
      : fechasVacias()

  return {
    fechasActualizacion,
    fechasAprobacion,
    asesores: rawAsesores.map(({ otras, otros, ...rest }) => ({
      ...rest,
      otros: otros ?? otras,
    })),
  }
}

const documentoAprobados = async (
  signal?: AbortSignal,
): Promise<DocumentoListResponse> => {
  const { data } = await api.get<RespuestaDocumentosRaw>(
    'clientes/documentosAprobados',
    { signal },
  )
  return normalizarRespuestaDocumentos(data)
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

export const documentoServices = {
  listar,
  descargar,
  aprobar,
  documentoAprobados,
  listadocumentosAprobados,
  agregarDocumento,
}
