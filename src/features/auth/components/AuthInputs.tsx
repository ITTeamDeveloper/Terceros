import { useState } from 'react'
import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material'
import {
  LockOutlined as LockOutlinedIcon,
  VisibilityOutlined as VisibilityOutlinedIcon,
  VisibilityOffOutlined as VisibilityOffOutlinedIcon,
} from '@mui/icons-material'
import { typo, fontFamily } from '../../../shared/styles/typography'

const inputSx = {
  '& .MuiOutlinedInput-root': {
    height: 46,
    fontSize: 13,
    fontFamily: fontFamily.body,
    fontWeight: 500,
    borderRadius: '10px',
    bgcolor: '#FFFFFF',
    '& fieldset': { borderColor: '#EAE5FF', borderWidth: 1.5 },
    '&:hover fieldset': { borderColor: '#B19BFD' },
    '&.Mui-focused fieldset': { borderColor: '#8B6CFB', borderWidth: 1.5 },
  },
  '& .MuiOutlinedInput-input': {
    color: '#1D1D1D',
    '&::placeholder': { color: '#9C9CA8', opacity: 1 },
  },
}

function AuthLabel({ children }: { children: string }) {
  return <Typography sx={{ ...typo.label, mb: 0.75 }}>{children}</Typography>
}

interface AuthTextFieldProps {
  label: string
  placeholder?: string
  icon: ReactNode
  value: string
  onChange: (value: string) => void
  type?: string
  sx?: SxProps<Theme>
}

export function AuthTextField({
  label,
  placeholder,
  icon,
  value,
  onChange,
  type = 'text',
  sx,
}: AuthTextFieldProps) {
  return (
    <Box sx={sx}>
      <AuthLabel>{label}</AuthLabel>
      <TextField
        fullWidth
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={inputSx}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">{icon}</InputAdornment>
            ),
          },
        }}
      />
    </Box>
  )
}

interface AuthPasswordFieldProps {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  sx?: SxProps<Theme>
}

export function AuthPasswordField({
  label,
  placeholder = '••••••••',
  value,
  onChange,
  sx,
}: AuthPasswordFieldProps) {
  const [show, setShow] = useState(false)

  return (
    <Box sx={sx}>
      <AuthLabel>{label}</AuthLabel>
      <TextField
        fullWidth
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={inputSx}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ fontSize: 16, color: '#8B6CFB' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setShow((v) => !v)} edge="end">
                  {show
                    ? <VisibilityOutlinedIcon sx={{ fontSize: 16, color: '#9C9CA8' }} />
                    : <VisibilityOffOutlinedIcon sx={{ fontSize: 16, color: '#9C9CA8' }} />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  )
}
