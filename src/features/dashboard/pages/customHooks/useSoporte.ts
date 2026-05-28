import { useState } from 'react'
import type { AxiosError } from 'axios'
import { soporteServices } from '../../../../services/soporteServices'
import { useAuth } from '../../../auth/context/AuthContext'

interface FeedbackState {
  open: boolean
  message: string
  statusCode?: number
}

export interface SoporteTemplate {
  subject: string
  description: string
  message: string
}

const DEFAULT_SUBJECT = 'reporte-terceros'

const TEMPLATES_ROL_20: SoporteTemplate[] = [
  {
    subject: 'Error al subir documento',
    description: 'Reporta cuando un documento no se logra subir al estudio.',
    message:
      'Estimado equipo de Soporte,\n\nPor medio del presente, informo que se ha presentado un inconveniente al intentar cargar el documento [ARCHIVO] correspondiente al estudio [ESTUDIO]. Agradeceré su pronta revisión y orientación al respecto.\n\nQuedo atento a sus comentarios.\n\nCordialmente,',
  },
  {
    subject: 'Error al autorizar un documento',
    description: 'Reporta problemas al autorizar el acceso a un documento.',
    message:
      'Estimado equipo de Soporte,\n\nPor medio del presente, informo que se ha presentado un inconveniente al autorizar el documento [ARCHIVO] correspondiente al estudio [ESTUDIO]. Agradeceré su revisión y atención oportuna.\n\nQuedo atento a sus comentarios.\n\nCordialmente,',
  },
  {
    subject: 'Error al descargar documento',
    description: 'Reporta cuando un documento no puede descargarse.',
    message:
      'Estimado equipo de Soporte,\n\nPor medio del presente, informo que se ha presentado un inconveniente al intentar descargar el documento [ARCHIVO] correspondiente al estudio [ESTUDIO]. Agradeceré su revisión y la pronta solución del caso.\n\nQuedo atento a sus comentarios.\n\nCordialmente,',
  },
  {
    subject: 'Error al desautorizar un documento',
    description: 'Reporta problemas al desautorizar el acceso a un documento.',
    message:
      'Estimado equipo de Soporte,\n\nPor medio del presente, informo que se ha presentado un inconveniente al desautorizar el documento [ARCHIVO] correspondiente al estudio [ESTUDIO]. Agradeceré su revisión y la atención correspondiente.\n\nQuedo atento a sus comentarios.\n\nCordialmente,',
  },
]

const templatesRol17 = (estudio: string): SoporteTemplate[] => [
  {
    subject: 'Error al descargar documento',
    description: 'Reporta cuando no logras descargar un documento autorizado.',
    message: `Estimados,\n\nPor medio del presente, informo que no me ha sido posible descargar el documento [ARCHIVO] correspondiente al estudio ${estudio}. Agradeceré su revisión y la pronta solución del caso.\n\nQuedo atento a sus comentarios.\n\nCordialmente,`,
  },
  {
    subject: 'Permiso para descargar documento',
    description: 'Solicita autorización para descargar un documento.',
    message: `Estimados,\n\nPor medio del presente, solicito formalmente la autorización para descargar el documento [ARCHIVO] correspondiente al estudio ${estudio}, requerido para la gestión a mi cargo.\n\nAgradezco de antemano su atención y quedo atento a su respuesta.\n\nCordialmente,`,
  },
]

export function useSoporte() {
  const { payload } = useAuth()
  const rolId = payload?.rol_ids?.[0]
  const estudio = payload?.empresa ?? ''

  const templates: SoporteTemplate[] =
    rolId === 20 ? TEMPLATES_ROL_20 : rolId === 17 ? templatesRol17(estudio) : []

  const [subject, setSubject] = useState(DEFAULT_SUBJECT)
  const [message, setMessage] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackState>({ open: false, message: '' })

  const puedeEnviar =
    message.trim().length > 0 && subject.trim().length > 0 && !enviando

  const cerrarFeedback = () => setFeedback((f) => ({ ...f, open: false }))

  const aplicarTemplate = (template: SoporteTemplate) => {
    setSubject(template.subject)
    setMessage(template.message)
  }

  const enviar = async () => {
    if (!puedeEnviar) return

    setEnviando(true)
    try {
      const res = await soporteServices.enviarMensaje({
        subject: subject.trim(),
        message: message.trim(),
      })
      const okMessage =
        (res as { message?: string } | undefined)?.message ?? 'Tu mensaje fue enviado correctamente.'
      setFeedback({ open: true, message: okMessage, statusCode: 200 })
      setSubject(DEFAULT_SUBJECT)
      setMessage('')
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string; error?: string }>
      const statusCode = axiosErr.response?.status ?? 500
      const errMessage =
        axiosErr.response?.data?.message ??
        axiosErr.response?.data?.error ??
        (statusCode >= 500
          ? 'Ocurrió un error al enviar tu mensaje.'
          : 'No fue posible enviar tu mensaje.')
      setFeedback({ open: true, message: errMessage, statusCode })
    } finally {
      setEnviando(false)
    }
  }

  return {
    subject,
    setSubject,
    message,
    setMessage,
    enviando,
    puedeEnviar,
    feedback,
    cerrarFeedback,
    enviar,
    templates,
    aplicarTemplate,
  }
}
