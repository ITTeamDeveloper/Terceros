import { useState, type MouseEvent } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import { Logout as LogoutIcon } from '@mui/icons-material'
import { useAuth } from '../../features/auth/context/AuthContext'
import { tieneRolSupervisor } from '../utils/roles'

interface UserInfoProps {
  variant?: 'topbar' | 'sidebar'
}

export function UserInfo({ variant = 'topbar' }: UserInfoProps) {
  const { payload, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const handleOpen = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const handleLogout = () => {
    handleClose()
    logout()
  }

  const name = payload?.nombre ?? 'Invitado'
  const company = payload?.empresa ?? (tieneRolSupervisor(payload?.rol_ids) ? 'Administrador' : '—')
  const initial = name.charAt(0).toUpperCase() || '?'

  const avatar = (size: number, fontSize: number) => (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        bgcolor: '#B19BFD',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Typography sx={{ color: '#fff', fontWeight: 700, fontSize, fontFamily: 'Inter, sans-serif' }}>
        {initial}
      </Typography>
    </Box>
  )

  if (variant === 'sidebar') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          height: 64,
          bgcolor: '#2A2A2A',
          flexShrink: 0,
        }}
      >
        {avatar(32, 13)}
        <Box>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: 12, fontFamily: 'Inter, sans-serif' }}>
            {name}
          </Typography>
          <Typography sx={{ color: '#B19BFD', fontSize: 10, fontFamily: 'Inter, sans-serif' }}>
            {company}
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Box
        onClick={handleOpen}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: 'pointer',
          px: 1,
          py: 0.5,
          borderRadius: '8px',
          transition: 'background-color 0.15s',
          '&:hover': { bgcolor: '#F3F0FF' },
        }}
      >
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#1D1D1D', fontFamily: 'Inter, sans-serif' }}>
            {name}
          </Typography>
          <Typography sx={{ fontSize: 11, color: '#B19BFD', fontFamily: 'Inter, sans-serif' }}>
            {company}
          </Typography>
        </Box>
        {avatar(36, 14)}
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 160,
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(177,155,253,0.18)',
              border: '1px solid #EEEEEE',
            },
          },
        }}
      >
        <MenuItem
          onClick={handleLogout}
          sx={{
            fontSize: 13,
            fontFamily: 'Inter, sans-serif',
            color: '#1D1D1D',
            '&:hover': { bgcolor: '#F3F0FF', color: '#B19BFD' },
          }}
        >
          <ListItemIcon sx={{ minWidth: '32px !important', color: 'inherit' }}>
            <LogoutIcon sx={{ fontSize: 18 }} />
          </ListItemIcon>
          Salir
        </MenuItem>
      </Menu>
    </>
  )
}
