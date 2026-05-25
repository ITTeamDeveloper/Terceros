import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
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
import { keyframes } from '@emotion/react'

interface MessageState {
  open: boolean
  message: string
  statusCode?: number
}

export const LoginSize = keyframes`
  from {
    right: -40%;
  }
  to {
    right: 0;
  }
`

function Login() {
  const { login } = useAuth()
  const isMobile = useMediaQuery('(max-width: 599.95px)')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<MessageState>({ open: false, message: '' })

  const closeFeedback = () => setFeedback((prev) => ({ ...prev, open: false }))

  const handleSubmit = async () => {
    if (!username || !password) {
      setFeedback({ open: true, message: 'Completa nombre de usuario y contraseña', statusCode: 400 })
      return
    }
    setLoading(true)
    try {
      const data = await authServices.login({ username, password })
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
    <Box sx={{ display: 'flex', minHeight: '100vh', position: 'relative', width: '100%', overflow: 'hidden' }}>
      {!isMobile && <AuthBrandPanel />}

      <Box
        className="login"
        sx={{
          width: '40%',
          height: '100dvh',
          flex: 1,
          right: isMobile ? 0 : '-40%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#eae6db',
          position: 'absolute',
          borderRadius: '3rem 0 0 3rem',
          boxShadow: '0 18px 48px rgba(139, 108, 251, 0.12)',
          p: 5,
          animation: isMobile ? 'none' : `${LoginSize} 0.58s cubic-bezier(0.4, 0, 0.2, 1) 2.42s forwards`,
        }}
      >
        <Box
          className="login-container"
          sx={{
            width: 500,
            height: '38rem',
            p: '44px 40px 40px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 2.75,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography className="login-welcome-title" sx={typo.display2}>
              Bienvenido al sistema data terceros
            </Typography>
            <Typography sx={typo.subtitle}>Ingresa tus credenciales para continuar.</Typography>
          </Box>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <AuthTextField
              label="Nombre de usuario"
              placeholder="ejemplo"
              icon={<MailOutlinedIcon sx={{ fontSize: 16, color: '#8B6CFB' }} />}
              value={username}
              onChange={setUsername}
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
                bgcolor: '#456648',
                color: '#FFFFFF',
                borderRadius: '12px',
                boxShadow: '0 8px 18px rgba(29,29,29,0.20)',
                '&:hover': {
                  bgcolor: '#B19BFD',
                  boxShadow: '0 8px 18px rgba(29,29,29,0.28)',
                  '& .MuiButton-endIcon svg': { color: '#FFFFFF' },
                },
                '&.Mui-disabled': { bgcolor: '#3A3A3A', color: '#FFFFFF' },
              }}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </div>

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
