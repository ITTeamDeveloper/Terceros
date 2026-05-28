import { useState } from "react";
import type { AxiosError } from "axios";
import { documentoServices } from "../../../../services/documentoServices";

interface DescargarFeedback {
    open: boolean
    message: string
    statusCode?: number
}

export const useDescargarDocumento = () => {
    const [feedback, setFeedback] = useState<DescargarFeedback>({ open: false, message: '' })

    const cerrarFeedback = () => setFeedback((f) => ({ ...f, open: false }))

    const descargar = async (asesorNombre: string, tablaNombre: string) => {
        try {
            await documentoServices.descargar(asesorNombre, tablaNombre);
        } catch (error) {
            const axiosErr = error as AxiosError<Blob | { message?: string; error?: string }>
            const statusCode = axiosErr.response?.status ?? 500
            let message = ''

            const data = axiosErr.response?.data
            if (data instanceof Blob) {
                try {
                    const text = await data.text()
                    const parsed = JSON.parse(text) as { message?: string; error?: string }
                    message = parsed.message ?? parsed.error ?? ''
                } catch {
                    message = ''
                }
            } else if (data && typeof data === 'object') {
                message = data.message ?? data.error ?? ''
            }

            if (!message) {
                message = statusCode >= 500
                    ? 'Ocurrió un error al descargar el documento.'
                    : 'No fue posible descargar el documento.'
            }

            setFeedback({ open: true, message, statusCode })
        }
    }

    return { descargar, feedback, cerrarFeedback };
}
