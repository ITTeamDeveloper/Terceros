import { useState } from 'react'
// import { documentoServices } from '../../../../services/documentoServices'
import { usePanelFeedback } from '../../../../shared/hooks/usePanelFeedback'
import type { aprobarRequest } from '../../../../services/interfaces'
import { documentoServices } from '../../../../services/documentoServices'

interface UseAutorizarDocumentoArgs {
  onSuccess?: () => void | Promise<void>
}


export function useAutorizarDocumento({ onSuccess }: UseAutorizarDocumentoArgs = {}) {
  const [target, setTarget] = useState<aprobarRequest | null>(null)
  const [confirmando, setConfirmando] = useState(false)

  const limpiar = () => {
    setTarget(null)
    setConfirmando(false)
  }

  const { feedback, saving, ejecutar } = usePanelFeedback({
    onAfterClose: limpiar,
    onSuccess,
  })

  const open = !!target

  const abrir = (row: aprobarRequest) => {
    setTarget(row)
    setConfirmando(false)
  }

  const cerrar = () => {
    if (saving) return
    limpiar()
  }

  const volverAEditar = () => {
    if (saving) return
    setConfirmando(false)
  }

  const accion = target?.aprobar ? 'autorizar' : 'desautorizar'

  const titulo = !target
    ? ''
    : confirmando
      ? `¿Estás seguro en ${accion} la tabla ${target.tabla} del estudio ${target.estudio}?`
      : `¿Estás seguro en ${accion}?`

  const guardar = async () => {
    if (!target) return
    if (!confirmando) {
      setConfirmando(true)
      return
    }
    await ejecutar(() => documentoServices.aprobar(target))
  }

  return {
    open,
    target,
    saving,
    feedback,
    titulo,
    confirmando,
    abrir,
    cerrar,
    guardar,
    volverAEditar,
  }
}
