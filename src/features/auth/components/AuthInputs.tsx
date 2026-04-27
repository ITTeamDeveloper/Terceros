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

const inputSx = {
  '& .MuiOutlinedInput-root': {
    height: 44,
    fontSize: 12,
    fontFamily: 'Calibri, sans-serif',
    borderRadius: '6px',
    bgcolor: '#FFFFFF',
    '& fieldset': { borderColor: '#EEEEEE' },
    '&:hover fieldset': { borderColor: '#B19BFD' },
    '&.Mui-focused fieldset': { borderColor: '#B19BFD', borderWidth: 1 },
  },
}

function AuthLabel({ children }: { children: string }) {
  return (
    <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#1D1D1D', mb: 0.75, fontFamily: 'Calibri, sans-serif' }}>
      {children}
    </Typography>
  )
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
              <InputAdornment position="start">
                {icon}
              </InputAdornment>
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
                <LockOutlinedIcon sx={{ fontSize: 16, color: '#BBBBBB' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setShow((v) => !v)} edge="end">
                  {show
                    ? <VisibilityOutlinedIcon sx={{ fontSize: 16, color: '#BBBBBB' }} />
                    : <VisibilityOffOutlinedIcon sx={{ fontSize: 16, color: '#BBBBBB' }} />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  )
}
