import Alert from '@mui/material/Alert'
import type { AlertColor } from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { Close as CloseIcon } from '@mui/icons-material'
import type { SharedPanelProps } from '../types/panel.types'

function severityFromStatus(status?: number): AlertColor {
  if (!status) return 'info'
  if (status >= 500) return 'error'
  if (status >= 400) return 'warning'
  if (status >= 300) return 'info'
  return 'success'
}

export function SharedPanel({
  open,
  onClose,
  onSave,
  title,
  children,
  loading = false,
  feedback,
  onCancel,
  cancelLabel = 'Cancelar',
  saveLabel = 'Guardar',
  saveDisabled = false,
}: SharedPanelProps) {
  const handleCancel = onCancel ?? onClose
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
            fontFamily: 'Inter, sans-serif',
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

      {feedback?.open && (
        <Box sx={{ px: 3, pb: 2 }}>
          <Alert
            severity={severityFromStatus(feedback.statusCode)}
            variant="filled"
            sx={{ fontSize: 12, fontFamily: 'Inter, sans-serif' }}
          >
            {feedback.message}
          </Alert>
        </Box>
      )}

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
          onClick={handleCancel}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontSize: 13,
            borderColor: '#EEEEEE',
            color: '#1D1D1D',
            fontFamily: 'Inter, sans-serif',
            '&:hover': { borderColor: '#B19BFD', bgcolor: '#F3F0FF' },
          }}
        >
          {cancelLabel}
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={onSave}
          disabled={loading || saveDisabled}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            fontSize: 13,
            bgcolor: '#B19BFD',
            fontFamily: 'Inter, sans-serif',
            boxShadow: 'none',
            '&:hover': { bgcolor: '#9B82FC', boxShadow: 'none' },
            '&.Mui-disabled': { bgcolor: '#D4C8FE', color: '#fff' },
          }}
        >
          {loading ? (
            <CircularProgress size={18} sx={{ color: '#fff' }} />
          ) : (
            saveLabel
          )}
        </Button>
      </Box>
    </Drawer>
  )
}
