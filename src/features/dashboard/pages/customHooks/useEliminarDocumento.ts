// import { useState } from 'react'
// import { documentoServices } from '../../../../services/documentoServices'
// import { usePanelFeedback } from '../../../../shared/hooks/usePanelFeedback'

// interface UseEliminarDocumentoArgs {
//   onSuccess?: () => void | Promise<void>
// }

// export interface EliminarTarget {
//   documentoId: string
//   documentoNombre?: string
//   empresaNombre?: string
// }

// export function useEliminarDocumento({ onSuccess }: UseEliminarDocumentoArgs = {}) {
//   const [target, setTarget] = useState<EliminarTarget | null>(null)

//   const limpiar = () => setTarget(null)

//   const { feedback, saving, ejecutar } = usePanelFeedback({
//     onAfterClose: limpiar,
//     onSuccess,
//   })

//   const open = !!target

//   const abrir = (row: EliminarTarget) => setTarget(row)

//   const cerrar = () => {
//     if (saving) return
//     limpiar()
//   }

//   const titulo = '¿Estás seguro de eliminar este archivo?'

//   const guardar = () => {
//     if (!target?.documentoId) return
//     const documentoId = target.documentoId
//     void ejecutar(() => documentoServices.eliminar(documentoId))
//   }

//   return {
//     open,
//     target,
//     saving,
//     feedback,
//     titulo,
//     abrir,
//     cerrar,
//     guardar,
//   }
// }
