import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import {
  MailOutlined as MailOutlinedIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material'
import { AxiosError } from 'axios'
import { AuthBrandPanel } from '../components/AuthBrandPanel'
import { AuthTextField, AuthPasswordField } from '../components/AuthInputs'
import { useAuth } from '../context/AuthContext'
import { authServices } from '../../../services/authServices'
import { AppMessage } from '../../../shared/components'
import { typo } from '../../../shared/styles/typography'

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

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#F7F4FF',
          p: 5,
        }}
      >
        <Box
          sx={{
            width: 440,
            bgcolor: '#FFFFFF',
            borderRadius: '18px',
            p: '44px 40px 40px 40px',
            boxShadow: '0 18px 48px rgba(139, 108, 251, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.75,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={typo.display2}>Bienvenido</Typography>
            <Typography sx={typo.subtitle}>Ingresa tus credenciales para continuar.</Typography>
          </Box>

          <AuthTextField
            label="Correo electrónico"
            placeholder="ejemplo@estudio.com"
            icon={<MailOutlinedIcon sx={{ fontSize: 16, color: '#8B6CFB' }} />}
            value={email}
            onChange={setEmail}
          />

          <AuthPasswordField
            label="Contraseña"
            value={password}
            onChange={setPassword}
          />

          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            endIcon={!loading && <ArrowForwardIcon sx={{ fontSize: 16, color: '#B19BFD' }} />}
            sx={{
              ...typo.buttonLg,
              height: 50,
              bgcolor: '#1D1D1D',
              color: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 8px 18px rgba(29,29,29,0.20)',
              '&:hover': { bgcolor: '#000000', boxShadow: '0 8px 18px rgba(29,29,29,0.28)' },
              '&.Mui-disabled': { bgcolor: '#3A3A3A', color: '#FFFFFF' },
            }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
{/* 
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ flex: 1, height: 1, bgcolor: '#EAE5FF' }} />
            <Typography sx={{ ...typo.caption, color: '#9C9CA8' }}>o</Typography>
            <Box sx={{ flex: 1, height: 1, bgcolor: '#EAE5FF' }} />
          </Box> */}

          {/* <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', alignItems: 'center' }}>
            <Typography sx={typo.caption}>¿No tienes cuenta?</Typography>
            <Typography component={Link} to="/registro" sx={typo.link}>
              Regístrate
            </Typography>
          </Box> */}
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
