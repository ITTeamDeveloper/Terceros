import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import {
  MailOutlined as MailOutlinedIcon,
  PersonOutlined as PersonOutlinedIcon,
  BusinessOutlined as BusinessOutlinedIcon,
} from '@mui/icons-material'
import { AxiosError } from 'axios'
import { AuthBrandPanel } from '../components/AuthBrandPanel'
import { AuthTextField, AuthPasswordField } from '../components/AuthInputs'
import { authServices } from '../../../services/authServices'
import { AppMessage } from '../../../shared/components'

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
      <AuthBrandPanel />

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F3F0FF', py: 4 }}>
        <Box
          sx={{
            width: 420,
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
              Crear cuenta
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#888888', mt: 0.75, fontFamily: 'Calibri, sans-serif' }}>
              Completa los datos para registrarte en la plataforma
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <AuthTextField
              label="Nombre"
              placeholder="Ej: Juan"
              icon={<PersonOutlinedIcon sx={{ fontSize: 16, color: '#BBBBBB' }} />}
              value={nombre}
              onChange={setNombre}
              sx={{ flex: 1 }}
            />
            <AuthTextField
              label="Apellido"
              placeholder="Ej: Pérez"
              icon={<PersonOutlinedIcon sx={{ fontSize: 16, color: '#BBBBBB' }} />}
              value={apellido}
              onChange={setApellido}
              sx={{ flex: 1 }}
            />
          </Box>

          <AuthTextField
            label="Correo electrónico"
            placeholder="ejemplo@empresa.com"
            icon={<MailOutlinedIcon sx={{ fontSize: 16, color: '#BBBBBB' }} />}
            value={email}
            onChange={setEmail}
          />

          <AuthTextField
            label="Empresa / Estudio"
            placeholder="Nombre del estudio o empresa"
            icon={<BusinessOutlinedIcon sx={{ fontSize: 16, color: '#BBBBBB' }} />}
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
              label="Confirmar contraseña"
              value={confirm}
              onChange={setConfirm}
              sx={{ flex: 1 }}
            />
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
            {loading ? 'Creando...' : 'Crear cuenta'}
          </Button>

          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', alignItems: 'center' }}>
            <Typography sx={{ fontSize: 12, color: '#888888', fontFamily: 'Calibri, sans-serif' }}>
              ¿Ya tienes cuenta?
            </Typography>
            <Typography
              component={Link}
              to="/login"
              sx={{ fontSize: 12, fontWeight: 700, color: '#B19BFD', fontFamily: 'Calibri, sans-serif', textDecoration: 'none' }}
            >
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
