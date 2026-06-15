import { useState } from 'react'
import { usePanelFeedback } from '../../../../shared/hooks/usePanelFeedback'
import type { ClienteDocumentoFila } from '../../../../services/interfaces'
import { documentoServices } from '../../../../services/documentoServices'

interface UseHabilitarDescargaArgs {
  onSuccess?: () => void | Promise<void>
}

export function useHabilitarDescarga({ onSuccess }: UseHabilitarDescargaArgs = {}) {
  const [target, setTarget] = useState<ClienteDocumentoFila | null>(null)

  const limpiar = () => setTarget(null)

  const { feedback, saving, ejecutar } = usePanelFeedback({
    onAfterClose: limpiar,
    onSuccess,
  })

  const open = !!target

  const abrir = (row: ClienteDocumentoFila) => {
    setTarget(row)
  }

  const cerrar = () => {
    if (saving) return
    limpiar()
  }

  const texto = !target
    ? ''
    : `¿Estás seguro de aprobar que ${target.estudio} pueda descargar nuevamente el documento ${target.documentoNombre}?`

  const guardar = async () => {
    if (!target?.documentoId) return
    await ejecutar(() => documentoServices.aprobarDescarga(true, target.documentoId!))
  }

  return {
    open,
    target,
    saving,
    feedback,
    texto,
    abrir,
    cerrar,
    guardar,
  }
}
