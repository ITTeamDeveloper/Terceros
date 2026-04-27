import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {
  MenuOpen as MenuOpenIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material'
import { Sidebar } from './Sidebar'
import { useAuth } from '../../features/auth/context/AuthContext'
import { typo, fontFamily } from '../../shared/styles/typography'

const STORAGE_KEY = 'sidebarExpanded'

function FinantyMark() {
  return (
    <Box
      sx={{
        width: 18,
        height: 18,
        borderRadius: '2px 2px 2px 9px',
        bgcolor: '#B19BFD',
      }}
    />
  )
}

export function MainLayout() {
  const { payload, logout } = useAuth()
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === null ? false : saved === 'true'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(sidebarExpanded))
  }, [sidebarExpanded])

  const toggleSidebar = () => setSidebarExpanded((v) => !v)

  const name = payload?.nombre ?? 'Invitado'
  const role = payload?.rol === 'admin' ? 'Administrador' : (payload?.empresa ?? 'Usuario')
  const initials =
    name
      .split(' ')
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?'

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F7F4FF' }}>
      <Sidebar expanded={sidebarExpanded} />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 5,
            height: 'var(--topbar-h)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            px: 4,
            bgcolor: '#FFFFFF',
            borderBottom: '1px solid #EAE5FF',
          }}
        >
          {/* Toggle */}
          <Box
            onClick={toggleSidebar}
            title={sidebarExpanded ? 'Colapsar menú' : 'Expandir menú'}
            sx={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#F7F4FF',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'background-color 0.15s',
              '&:hover': { bgcolor: '#EFEAFF' },
            }}
          >
            {sidebarExpanded
              ? <MenuOpenIcon sx={{ fontSize: 20, color: '#1D1D1D' }} />
              : <MenuIcon sx={{ fontSize: 20, color: '#1D1D1D' }} />}
          </Box>

          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <FinantyMark />
            <Typography sx={{ ...typo.h1, lineHeight: 1 }}>Finanty</Typography>
          </Box>

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />

          {/* User pill */}
          <Box
            sx={{
              height: 44,
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              pl: 0.75,
              pr: 1.5,
              bgcolor: '#F7F4FF',
              border: '1px solid #EAE5FF',
              borderRadius: '12px',
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '10px',
                bgcolor: '#B19BFD',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontFamily: fontFamily.body, fontSize: 12, fontWeight: 700, color: '#1D1D1D' }}>
                {initials}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontFamily: fontFamily.body, fontSize: 12, fontWeight: 700, color: '#1D1D1D', lineHeight: 1.1 }}>
                {name}
              </Typography>
              <Typography sx={{ ...typo.caption, fontSize: 10, lineHeight: 1.1 }}>{role}</Typography>
            </Box>
          </Box>

          {/* Logout */}
          <Box
            onClick={logout}
            title="Cerrar sesión"
            sx={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#F7F4FF',
              border: '1px solid #EAE5FF',
              borderRadius: '10px',
              cursor: 'pointer',
              '&:hover': { bgcolor: '#EFEAFF' },
            }}
          >
            <LogoutIcon sx={{ fontSize: 18, color: '#1D1D1D' }} />
          </Box>
        </Box>

        {/* Page content */}
        <Box component="main" sx={{ flex: 1, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
