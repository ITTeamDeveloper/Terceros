import { Outlet, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {
  CalendarMonth as CalendarMonthIcon,
  Business as BusinessIcon,
  FolderOpen as FolderOpenIcon,
  VerifiedUser as VerifiedUserIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import { UserInfo } from '../../shared/components/UserInfo'

const NAV_ITEMS = [
  { label: 'Asignaciones', pageTitle: 'Asignaciones del Mes', path: '/', icon: CalendarMonthIcon },
  { label: 'Estudios', pageTitle: 'Estudios de Cobranza', path: '/estudios', icon: BusinessIcon },
  { label: 'Archivos', pageTitle: 'Archivos', path: '/archivos', icon: FolderOpenIcon },
  { label: 'Aprobaciones', pageTitle: 'Aprobaciones', path: '/aprobaciones', icon: VerifiedUserIcon },
  { label: 'Configuración', pageTitle: 'Configuración', path: '/configuracion', icon: SettingsIcon },
]

function getActiveItem(pathname: string) {
  return NAV_ITEMS.find((item) =>
    item.path === '/' ? pathname === '/' : pathname.startsWith(item.path)
  )
}

export function MainLayout() {
  const { pathname } = useLocation()
  const pageTitle = getActiveItem(pathname)?.pageTitle ?? ''

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F3F0FF' }}>
      {/* Topbar */}
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          px: 4,
          bgcolor: '#FFFFFF',
          borderBottom: '1px solid #E0D9FF',
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            flex: 1,
            fontWeight: 700,
            fontSize: 18,
            color: '#1D1D1D',
            fontFamily: 'Calibri, sans-serif',
          }}
        >
          {pageTitle}
        </Typography>
        <UserInfo variant="topbar" />
      </Box>

      {/* Contenido de la página */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </Box>
    </Box>
  )
}
