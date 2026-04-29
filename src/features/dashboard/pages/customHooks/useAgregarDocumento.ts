import { useState } from 'react'
import { documentoServices } from '../../../../services/documentoServices'
import type { ComboOption } from '../../../../shared/components'
import { usePanelFeedback } from '../../../../shared/hooks/usePanelFeedback'

const MAX_ARCHIVOS = 4

interface UseAgregarDocumentoArgs {
  onSuccess?: () => void | Promise<void>
}

export function useAgregarDocumento({ onSuccess }: UseAgregarDocumentoArgs = {}) {
  const [open, setOpen] = useState(false)
  const [archivos, setArchivos] = useState<File[]>([])
  const [empresa, setEmpresa] = useState<ComboOption | null>(null)
  const [confirmando, setConfirmando] = useState(false)

  const empresaId = empresa?.value ?? null

  const limpiar = () => {
    setOpen(false)
    setArchivos([])
    setEmpresa(null)
    setConfirmando(false)
  }

  const { feedback, saving, ejecutar } = usePanelFeedback({
    onAfterClose: limpiar,
    onSuccess,
  })

  const abrir = () => setOpen(true)

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
    !!empresaId &&
    !saving

  const agregarArchivos = (files: File[]) => {
    setArchivos((prev) => [...prev, ...files].slice(0, MAX_ARCHIVOS))
  }

  const quitarArchivo = (index: number) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index))
  }

  const guardar = () => {
    if (!empresaId || archivos.length === 0) return
    if (!confirmando) {
      setConfirmando(true)
      return
    }
    void ejecutar(() => documentoServices.subir(archivos, empresaId), {
      successMessage: 'Archivos subidos correctamente',
      errorMessage: 'No se pudieron subir los archivos',
    })
  }

  return {
    open,
    archivos,
    empresa,
    empresaId,
    saving,
    feedback,
    puedeGuardar,
    confirmando,
    maxArchivos: MAX_ARCHIVOS,
    abrir,
    cerrar,
    volverAEditar,
    setEmpresa,
    agregarArchivos,
    quitarArchivo,
    guardar,
  }
}
