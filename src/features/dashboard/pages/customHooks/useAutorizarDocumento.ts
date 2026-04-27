import { useState } from 'react'
import { documentoServices } from '../../../../services/documentoServices'

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
  const [saving, setSaving] = useState(false)

  const open = !!target

  const abrir = (row: AutorizarTarget) => setTarget(row)

  const cerrar = () => {
    if (saving) return
    setTarget(null)
  }

  const titulo = target
    ? target.autorizado
      ? '¿Estás seguro en desautorizar?'
      : '¿Estás seguro en autorizar?'
    : ''

  const guardar = async () => {
    if (!target?.documentoEmpresaId) return
    setSaving(true)
    try {
      await documentoServices.autorizar({
        documentoEmpresaId: target.documentoEmpresaId,
        autorizado: !target.autorizado,
      })
      setTarget(null)
      await onSuccess?.()
    } finally {
      setSaving(false)
    }
  }

  return {
    open,
    target,
    saving,
    titulo,
    abrir,
    cerrar,
    guardar,
  }
}
