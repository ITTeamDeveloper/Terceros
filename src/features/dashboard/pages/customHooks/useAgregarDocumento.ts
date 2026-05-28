import { useState } from 'react'
import { documentoServices } from '../../../../services/documentoServices'
import { usePanelFeedback } from '../../../../shared/hooks/usePanelFeedback'

const MAX_ARCHIVOS = 4

interface UseAgregarDocumentoArgs {
  onSuccess?: () => void | Promise<void>
}

export function useAgregarDocumento({ onSuccess }: UseAgregarDocumentoArgs = {}) {
  const [open, setOpen] = useState(false)
  const [archivos, setArchivos] = useState<File[]>([])
  const [estudio, setEstudio] = useState<string | null>(null)
  const [confirmando, setConfirmando] = useState(false)

  const limpiar = () => {
    setOpen(false)
    setArchivos([])
    setEstudio(null)
    setConfirmando(false)
  }

  const { feedback, saving, ejecutar } = usePanelFeedback({
    onAfterClose: limpiar,
    onSuccess,
  })

  const abrir = (nombreEstudio: string) => {
    setEstudio(nombreEstudio)
    setOpen(true)
  }

  const cerrar = () => {
    if (saving) return
    limpiar()
  }

  const volverAEditar = () => {
    if (saving) return
    setConfirmando(false)
  }

  const puedeGuardar =
    archivos.length > 0 &&
    archivos.length <= MAX_ARCHIVOS &&
    !!estudio &&
    !saving

  const agregarArchivos = (files: File[]) => {
    setArchivos((prev) => [...prev, ...files].slice(0, MAX_ARCHIVOS))
  }

  const quitarArchivo = (index: number) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index))
  }

  const guardar = () => {
    if (!estudio || archivos.length === 0) return
    if (!confirmando) {
      setConfirmando(true)
      return
    }
    void ejecutar(
      () => documentoServices.agregarDocumento(estudio, archivos),
    )
  }

  return {
    open,
    archivos,
    estudio,
    saving,
    feedback,
    puedeGuardar,
    confirmando,
    maxArchivos: MAX_ARCHIVOS,
    abrir,
    cerrar,
    volverAEditar,
    agregarArchivos,
    quitarArchivo,
    guardar,
  }
}
