import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { Close as CloseIcon } from '@mui/icons-material'
import type { SharedPanelProps } from '../types/panel.types'

export function SharedPanel({
  open,
  onClose,
  onSave,
  title,
  children,
  loading = false,
}: SharedPanelProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: 380,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.10)',
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 3,
          height: 60,
          flexShrink: 0,
          borderBottom: '1px solid #EEEEEE',
        }}
      >
        <Typography
          sx={{
            flex: 1,
            fontWeight: 700,
            fontSize: 16,
            color: '#1D1D1D',
            fontFamily: 'Calibri, sans-serif',
          }}
        >
          {title}
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ bgcolor: '#F3F0FF', borderRadius: '6px', p: 0.75 }}
        >
          <CloseIcon sx={{ fontSize: 16, color: '#1D1D1D' }} />
        </IconButton>
      </Box>

      {/* Contenido scrolleable */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3 }}>
        {children}
      </Box>

      {/* Footer fijo */}
      <Divider />
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          px: 3,
          height: 64,
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          onClick={onClose}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontSize: 13,
            borderColor: '#EEEEEE',
            color: '#1D1D1D',
            fontFamily: 'Calibri, sans-serif',
            '&:hover': { borderColor: '#B19BFD', bgcolor: '#F3F0FF' },
          }}
        >
          Cancelar
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={onSave}
          disabled={loading}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            fontSize: 13,
            bgcolor: '#B19BFD',
            fontFamily: 'Calibri, sans-serif',
            boxShadow: 'none',
            '&:hover': { bgcolor: '#9B82FC', boxShadow: 'none' },
            '&.Mui-disabled': { bgcolor: '#D4C8FE', color: '#fff' },
          }}
        >
          {loading ? (
            <CircularProgress size={18} sx={{ color: '#fff' }} />
          ) : (
            'Guardar'
          )}
        </Button>
      </Box>
    </Drawer>
  )
}
