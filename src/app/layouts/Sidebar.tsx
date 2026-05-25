import { NavLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { typo, fontFamily } from '../../shared/styles/typography'
import { useSidebarNav } from './sidebar/useSidebarNav'
import type { SidebarItem } from '../../services/interfaces'
import { useIcons, type IconName } from '../../shared/hooks/useIcons'

interface NavRowProps {
  item: SidebarItem
  expanded: boolean
}

function NavRow({ item, expanded }: NavRowProps) {
  const { getIcon, names } = useIcons()

  const renderIcon = (isActive: boolean) => {
    if (!names.includes(item.icon as IconName)) return null
    return getIcon(item.icon as IconName, { active: isActive, color: '#FFFFFF' })
  }


  const content = (isActive: boolean) => (
    <Box
      sx={{
        height: 44,
        width: expanded ? '100%' : 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: expanded ? 'flex-start' : 'center',
        gap: 1.5,
        px: expanded ? 1.75 : 0,
        borderRadius: '10px',
        cursor: 'pointer',
        bgcolor: isActive ? '#B19BFD' : 'transparent',
        transition: 'background-color 0.15s, width 0.2s ease',
        '&:hover': { bgcolor: isActive ? '#B19BFD' : 'rgba(255,255,255,0.06)' },
        overflow: 'hidden',
      }}
    >
      {renderIcon(isActive)}
      {expanded && (
        <Typography
          sx={{
            fontFamily: fontFamily.body,
            fontSize: 13,
            fontWeight: isActive ? 700 : 500,
            color: '#ffffff',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.nombre}
        </Typography>
      )}
    </Box>
  )

  return (
    <NavLink to={item.url} end={item.url === '/'} style={{ textDecoration: 'none' }}>
      {({ isActive }) =>
        expanded ? (
          content(isActive)
        ) : (
          <Tooltip title={item.nombre} placement="right" arrow>
            {content(isActive)}
          </Tooltip>
        )
      }
    </NavLink>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <>
      <Typography sx={{ ...typo.eyebrow, }}>
        <Box
          component="img"
          src="/isotopo_blanco.png"
          alt="Finanty"
          sx={{
            height: '2rem',
            width: 'auto',
            paddingRight: 1,
            display: 'block',
            borderRight: '2px solid white',
            marginRight: '1.5rem',

          }}
        />
        {children}
      </Typography>
    </>
  )
}

interface SidebarProps {
  expanded: boolean
}

export function Sidebar({ expanded }: SidebarProps) {
  const { primaryNav } = useSidebarNav()

  return (
    <>
      {primaryNav.map((item) => (
        <Box
          sx={{
            width: expanded ? 248 : 72,
            flexShrink: 0,
            bgcolor: '#456648',
            display: 'flex',
            flexDirection: 'column',
            alignItems: expanded ? 'stretch' : 'center',
            gap: 0.75,
            py: 2.5,
            px: expanded ? 2 : 1.75,
            height: '100dvh',
            position: 'sticky',
            top: 'var(--topbar-h)',
            transition: 'width 0.2s ease, padding 0.2s ease',
            overflow: 'hidden',
          }}
        >
          {expanded && <SectionLabel>{item.nombre}</SectionLabel>}
          {
            item.child?.map((child) => (
              <NavRow key={child.url} item={child} expanded={expanded} />
            ))
          }
        </Box>
      ))
      }
    </>
  )
}
