import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { SendOutlined as SendIcon } from '@mui/icons-material'
import type { useSoporte } from '../customHooks/useSoporte'

interface SoporteFormProps {
  controller: ReturnType<typeof useSoporte>
}

export function SoporteForm({ controller }: SoporteFormProps) {
  const { subject, message, setMessage, enviando, puedeEnviar, enviar } = controller

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: '#FFFFFF',
        border: '1px solid #EAE5FF',
        borderRadius: '16px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 700,
            color: '#1D1D1D',
            fontFamily: 'Inter, sans-serif',
            mb: 0.5,
          }}
        >
          Reportar un problema
        </Typography>
        <Typography
          sx={{
            fontSize: 12,
            color: '#6B6B7A',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Selecciona una plantilla del panel derecho o escribe tu propio mensaje. Describe el
          problema con el mayor detalle posible para que podamos ayudarte más rápido.
        </Typography>
      </Box>

      {subject && (
        <Box
          sx={{
            px: 2,
            py: 1.25,
            bgcolor: '#F3F0FF',
            border: '1px solid #EAE5FF',
            borderRadius: '8px',
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              color: '#6B6B7A',
              fontFamily: 'Inter, sans-serif',
              mb: 0.25,
            }}
          >
            Asunto
          </Typography>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 700,
              color: '#1D1D1D',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {subject}
          </Typography>
        </Box>
      )}

      <Box>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: '#1D1D1D',
            fontFamily: 'Inter, sans-serif',
            mb: 0.75,
          }}
        >
          Mensaje
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={8}
          maxRows={16}
          placeholder="Describe aquí tu problema..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={enviando}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#F3F0FF',
              borderRadius: '8px',
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              color: '#1D1D1D',
              '& fieldset': { borderColor: '#EAE5FF' },
              '&:hover fieldset': { borderColor: '#B19BFD' },
              '&.Mui-focused fieldset': { borderColor: '#B19BFD' },
            },
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={enviar}
          disabled={!puedeEnviar}
          startIcon={
            enviando ? (
              <CircularProgress size={16} sx={{ color: '#FFFFFF' }} />
            ) : (
              <SendIcon sx={{ fontSize: 18 }} />
            )
          }
          sx={{
            height: 40,
            px: 3,
            bgcolor: '#B19BFD',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: 13,
            fontFamily: 'Inter, sans-serif',
            borderRadius: '8px',
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': { bgcolor: '#9B82FC', boxShadow: 'none' },
            '&.Mui-disabled': { bgcolor: '#D4C8FE', color: '#FFFFFF' },
          }}
        >
          Enviar mensaje
        </Button>
      </Box>
    </Box>
  )
}
