import { useState } from 'react'
import { documentoServices } from '../../../../services/documentoServices'
import type { ComboOption } from '../../../../shared/components'

interface UseAgregarDocumentoArgs {
  onSuccess?: () => void | Promise<void>
}

export function useAgregarDocumento({ onSuccess }: UseAgregarDocumentoArgs = {}) {
  const [open, setOpen] = useState(false)
  const [archivo, setArchivo] = useState<File | null>(null)
  const [empresasSeleccionadas, setEmpresasSeleccionadas] = useState<ComboOption[]>([])
  const [saving, setSaving] = useState(false)

  const empresaIds = empresasSeleccionadas.map((e) => e.value)

  const abrir = () => setOpen(true)

  const cerrar = () => {
    if (saving) return
    setOpen(false)
    setArchivo(null)
    setEmpresasSeleccionadas([])
  }

  const puedeGuardar = !!archivo && empresaIds.length > 0 && !saving

  const guardar = async () => {
    if (!archivo) return
    if (empresaIds.length === 0) return

    setSaving(true)
    try {
      await documentoServices.subir(archivo, empresaIds)
      setOpen(false)
      setArchivo(null)
      setEmpresasSeleccionadas([])
      await onSuccess?.()
    } finally {
      setSaving(false)
    }
  }

  return {
    open,
    archivo,
    empresasSeleccionadas,
    empresaIds,
    saving,
    puedeGuardar,
    abrir,
    cerrar,
    setArchivo,
    setEmpresasSeleccionadas,
    guardar,
  }
}
