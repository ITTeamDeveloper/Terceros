import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import {
  MailOutlined as MailOutlinedIcon,
  PersonOutlined as PersonOutlinedIcon,
  BusinessOutlined as BusinessOutlinedIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material'
import { AxiosError } from 'axios'
import { AuthBrandPanel } from '../components/AuthBrandPanel'
import { AuthTextField, AuthPasswordField } from '../components/AuthInputs'
import { authServices } from '../../../services/authServices'
import { AppMessage } from '../../../shared/components'
import { typo } from '../../../shared/styles/typography'

interface MessageState {
  open: boolean
  message: string
  statusCode?: number
}

function Register() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<MessageState>({ open: false, message: '' })

  const closeFeedback = () => setFeedback((prev) => ({ ...prev, open: false }))

  const handleSubmit = async () => {
    if (!nombre || !apellido || !email || !password) {
      setFeedback({ open: true, message: 'Completa todos los campos requeridos', statusCode: 400 })
      return
    }
    if (password !== confirm) {
      setFeedback({ open: true, message: 'Las contraseñas no coinciden', statusCode: 400 })
      return
    }
    setLoading(true)
    try {
      const data = await authServices.register({ nombre, apellido, email, password })
      setFeedback({ open: true, message: data.message ?? 'Cuenta creada', statusCode: 201 })
      setTimeout(() => navigate('/login', { replace: true }), 1200)
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string; error?: string }>
      const status = axiosErr.response?.status ?? 500
      const message =
        axiosErr.response?.data?.message ??
        axiosErr.response?.data?.error ??
        'No se pudo crear la cuenta'
      setFeedback({ open: true, message, statusCode: status })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AuthBrandPanel glow2Color="#F3BB4A" />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#F7F4FF',
          p: '24px 40px',
        }}
      >
        <Box
          sx={{
            width: 480,
            bgcolor: '#FFFFFF',
            borderRadius: '18px',
            p: '36px 40px 40px 40px',
            boxShadow: '0 18px 48px rgba(139, 108, 251, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.25,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={{ ...typo.display2, fontSize: 32 }}>Crea tu cuenta.</Typography>
            <Typography sx={typo.subtitle}>Completa tus datos para empezar a usar la plataforma.</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <AuthTextField
              label="Nombre"
              placeholder="Ej: Juan"
              icon={<PersonOutlinedIcon sx={{ fontSize: 16, color: '#8B6CFB' }} />}
              value={nombre}
              onChange={setNombre}
              sx={{ flex: 1 }}
            />
            <AuthTextField
              label="Apellido"
              placeholder="Ej: Pérez"
              icon={<PersonOutlinedIcon sx={{ fontSize: 16, color: '#8B6CFB' }} />}
              value={apellido}
              onChange={setApellido}
              sx={{ flex: 1 }}
            />
          </Box>

          <AuthTextField
            label="Correo electrónico"
            placeholder="ejemplo@empresa.com"
            icon={<MailOutlinedIcon sx={{ fontSize: 16, color: '#8B6CFB' }} />}
            value={email}
            onChange={setEmail}
          />

          <AuthTextField
            label="Empresa / Estudio"
            placeholder="Nombre del estudio o empresa"
            icon={<BusinessOutlinedIcon sx={{ fontSize: 16, color: '#8B6CFB' }} />}
            value={company}
            onChange={setCompany}
          />

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <AuthPasswordField
              label="Contraseña"
              value={password}
              onChange={setPassword}
              sx={{ flex: 1 }}
            />
            <AuthPasswordField
              label="Confirmar"
              value={confirm}
              onChange={setConfirm}
              sx={{ flex: 1 }}
            />
          </Box>

          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            endIcon={!loading && <ArrowForwardIcon sx={{ fontSize: 16, color: '#E3734F' }} />}
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
            {loading ? 'Creando...' : 'Crear cuenta'}
          </Button>

          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', alignItems: 'center' }}>
            <Typography sx={typo.caption}>¿Ya tienes cuenta?</Typography>
            <Typography component={Link} to="/login" sx={typo.link}>
              Inicia sesión
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

export default Register
