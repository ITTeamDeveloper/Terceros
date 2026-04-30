import { useState } from 'react'
import { documentoServices } from '../../../../services/documentoServices'
import { usePanelFeedback } from '../../../../shared/hooks/usePanelFeedback'

interface UseAutorizarDocumentoArgs {
  onSuccess?: () => void | Promise<void>
}

export interface AutorizarTarget {
  documentoEmpresaId?: string
  autorizado?: boolean
  documentoNombre?: string
  empresaNombre?: string
}

export function useAutorizarDocumento({ onSuccess }: UseAutorizarDocumentoArgs = {}) {
  const [target, setTarget] = useState<AutorizarTarget | null>(null)

  const limpiar = () => setTarget(null)

  const { feedback, saving, ejecutar } = usePanelFeedback({
    onAfterClose: limpiar,
    onSuccess,
  })

  const open = !!target

  const abrir = (row: AutorizarTarget) => setTarget(row)

  const cerrar = () => {
    if (saving) return
    limpiar()
  }

  const titulo = target
    ? target.autorizado
      ? '¿Estás seguro en desautorizar?'
      : '¿Estás seguro en autorizar?'
    : ''

  const guardar = () => {
    if (!target?.documentoEmpresaId) return
    const documentoEmpresaId = target.documentoEmpresaId
    const nuevoEstado = !target.autorizado
    void ejecutar(
      () =>
        documentoServices.autorizar({
          documentoEmpresaId,
          autorizado: nuevoEstado,
        }),
      {
        successMessage: nuevoEstado
          ? 'Archivo autorizado correctamente'
          : 'Archivo desautorizado correctamente',
        errorMessage: 'No se pudo actualizar la autorización',
      },
    )
  }

  return {
    open,
    target,
    saving,
    feedback,
    titulo,
    abrir,
    cerrar,
    guardar,
  }
}
