import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import type { AlertColor } from '@mui/material/Alert'

export interface AppMessageProps {
  open: boolean
  message: string
  statusCode?: number
  duration?: number
  onClose: () => void
}

function severityFromStatus(status?: number): AlertColor {
  if (!status) return 'info'
  if (status >= 500) return 'error'
  if (status >= 400) return 'warning'
  if (status >= 300) return 'info'
  return 'success'
}

export function AppMessage({
  open,
  message,
  statusCode,
  duration = 2000,
  onClose,
}: AppMessageProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={severityFromStatus(statusCode)}
        variant="filled"
        sx={{ width: '100%', fontFamily: 'Inter, sans-serif' }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}
