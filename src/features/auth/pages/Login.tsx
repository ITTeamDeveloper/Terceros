import { useState } from 'react'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { MailOutlined as MailOutlinedIcon } from '@mui/icons-material'
import { AxiosError } from 'axios'
import { AuthBrandPanel } from '../components/AuthBrandPanel'
import { AuthTextField, AuthPasswordField } from '../components/AuthInputs'
import { useAuth } from '../context/AuthContext'
import { authServices } from '../../../services/authServices'
import { AppMessage } from '../../../shared/components'

interface MessageState {
  open: boolean
  message: string
  statusCode?: number
}

function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<MessageState>({ open: false, message: '' })

  const closeFeedback = () => setFeedback((prev) => ({ ...prev, open: false }))

  const handleSubmit = async () => {
    if (!email || !password) {
      setFeedback({ open: true, message: 'Completa correo y contraseña', statusCode: 400 })
      return
    }
    setLoading(true)
    try {
      const data = await authServices.login({ email, password })
      setFeedback({ open: true, message: data.message ?? 'Sesión iniciada', statusCode: 200 })
      login(data.token)
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string; error?: string }>
      const status = axiosErr.response?.status ?? 500
      const message =
        axiosErr.response?.data?.message ??
        axiosErr.response?.data?.error ??
        'No se pudo iniciar sesión'
      setFeedback({ open: true, message, statusCode: status })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AuthBrandPanel />

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F3F0FF' }}>
        <Box
          sx={{
            width: 400,
            bgcolor: '#FFFFFF',
            borderRadius: '12px',
            p: 5,
            boxShadow: '0 4px 24px rgba(177,155,253,0.13)',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 24, color: '#1D1D1D', fontFamily: 'Calibri, sans-serif' }}>
              Bienvenido
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#888888', mt: 0.75, fontFamily: 'Calibri, sans-serif' }}>
              Ingresa tus credenciales para continuar
            </Typography>
          </Box>

          <AuthTextField
            label="Correo electrónico"
            placeholder="ejemplo@empresa.com"
            icon={<MailOutlinedIcon sx={{ fontSize: 16, color: '#BBBBBB' }} />}
            value={email}
            onChange={setEmail}
          />

          <Box>
            <AuthPasswordField
              label="Contraseña"
              value={password}
              onChange={setPassword}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.75 }}>
              <Typography sx={{ fontSize: 12, color: '#B19BFD', cursor: 'pointer', fontFamily: 'Calibri, sans-serif' }}>
                ¿Olvidaste tu contraseña?
              </Typography>
            </Box>
          </Box>

          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              height: 46,
              bgcolor: '#B19BFD',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: 14,
              fontFamily: 'Calibri, sans-serif',
              borderRadius: '6px',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#9B82FC', boxShadow: 'none' },
              '&.Mui-disabled': { bgcolor: '#D7CCFE', color: '#FFFFFF' },
            }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ flex: 1, height: 1, bgcolor: '#EEEEEE' }} />
            <Typography sx={{ fontSize: 12, color: '#AAAAAA', fontFamily: 'Calibri, sans-serif' }}>o</Typography>
            <Box sx={{ flex: 1, height: 1, bgcolor: '#EEEEEE' }} />
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', alignItems: 'center' }}>
            <Typography sx={{ fontSize: 12, color: '#888888', fontFamily: 'Calibri, sans-serif' }}>
              ¿No tienes cuenta?
            </Typography>
            <Typography
              component={Link}
              to="/registro"
              sx={{ fontSize: 12, fontWeight: 700, color: '#B19BFD', fontFamily: 'Calibri, sans-serif', textDecoration: 'none' }}
            >
              Regístrate
            </Typography>
          </Box>
        </Box>
      </Box>

      <AppMessage
        open={feedback.open}
        message={feedback.message}
        statusCode={feedback.statusCode}
        onClose={closeFeedback}
      />
    </Box>
  )
}

export default Login
