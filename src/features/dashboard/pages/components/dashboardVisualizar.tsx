import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { SharedPanel } from '../../../../shared/components'
import { useVisualizarDocumento } from '../customHooks/useVisualizarDocumento'

interface DashboardVisualizarProps {
  controller: ReturnType<typeof useVisualizarDocumento>
}

export const DashboardVisualizar = ({ controller }: DashboardVisualizarProps) => {
  const { open, loading, error, html, titulo, cerrar } = controller

  return (
    <SharedPanel
      open={open}
      onClose={cerrar}
      title={titulo || 'Vista previa'}
      width={{ xs: '100vw', md: '80vw' }}
      hideFooter
      loading={loading}
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#B19BFD' }} />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography sx={{ fontSize: 13, color: '#1D1D1D', fontFamily: 'Inter, sans-serif' }}>
            {error}
          </Typography>
        </Box>
      ) : html ? (
        <Box
          onContextMenu={(e) => e.preventDefault()}
          dangerouslySetInnerHTML={{ __html: html }}
          sx={{
            maxHeight: '80vh',
            overflow: 'auto',
            userSelect: 'none',
            fontFamily: 'Inter, Calibri, sans-serif',
            '& table': {
              borderCollapse: 'collapse',
              width: '100%',
              fontSize: 12,
            },
            '& th, & td': {
              border: '1px solid #EEEEEE',
              px: 1.25,
              py: 0.75,
              textAlign: 'left',
              whiteSpace: 'nowrap',
            },
            '& tr:first-of-type td, & th': {
              bgcolor: '#1D1D1D',
              color: '#FFFFFF',
              fontWeight: 700,
            },
            '& tr:nth-of-type(even) td': {
              bgcolor: '#F3F0FF',
            },
          }}
        />
      ) : null}
    </SharedPanel>
  )
}
