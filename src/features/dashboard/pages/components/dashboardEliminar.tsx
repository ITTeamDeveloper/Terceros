// import Box from '@mui/material/Box'
// import Typography from '@mui/material/Typography'
// import { SharedPanel } from '../../../../shared/components'
// import type { useEliminarDocumento } from '../customHooks/useEliminarDocumento'

// interface DashboardEliminarProps {
//   controller: ReturnType<typeof useEliminarDocumento>
// }

// export function DashboardEliminar({ controller }: DashboardEliminarProps) {
//   const { open, target, titulo, saving, feedback, cerrar, guardar } = controller

//   return (
//     <SharedPanel
//       open={open}
//       onClose={cerrar}
//       onSave={guardar}
//       title={titulo}
//       loading={saving}
//       feedback={feedback}
//     >
//       {target && (
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
//           <Typography
//             sx={{ fontSize: 13, color: '#1D1D1D', fontFamily: 'Inter, sans-serif' }}
//           >
//             Archivo: <strong>{target.documentoNombre}</strong>
//           </Typography>
//           {target.empresaNombre && (
//             <Typography
//               sx={{ fontSize: 13, color: '#1D1D1D', fontFamily: 'Inter, sans-serif' }}
//             >
//               Estudio: <strong>{target.empresaNombre}</strong>
//             </Typography>
//           )}
//         </Box>
//       )}
//     </SharedPanel>
//   )
// }
