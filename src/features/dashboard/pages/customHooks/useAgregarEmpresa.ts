import { useState } from 'react'
import { empresasServices } from '../../../../services/empresasServices'
import { usePanelFeedback } from '../../../../shared/hooks/usePanelFeedback'

interface UseAgregarEmpresaArgs {
  onSuccess?: () => void | Promise<void>
}

export function useAgregarEmpresa({ onSuccess }: UseAgregarEmpresaArgs = {}) {
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState('')

  const limpiar = () => {
    setOpen(false)
    setNombre('')
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

  const puedeGuardar = nombre.trim().length > 0 && !saving

  const guardar = () => {
    const nombreLimpio = nombre.trim()
    if (!nombreLimpio) return
    void ejecutar(() => empresasServices.crear({ nombre: nombreLimpio }), {
      successMessage: 'Estudio agregado correctamente',
      errorMessage: 'No se pudo agregar el estudio',
    })
  }

  return {
    open,
    nombre,
    saving,
    feedback,
    puedeGuardar,
    abrir,
    cerrar,
    setNombre,
    guardar,
  }
}
