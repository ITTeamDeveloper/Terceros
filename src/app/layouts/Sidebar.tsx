import { NavLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { SvgIconComponent } from '@mui/icons-material'
import { typo, fontFamily } from '../../shared/styles/typography'
import { useIcons, type IconName } from '../../shared/hooks/useIcons'
import { useSidebarNav, type NavItem } from './sidebar/useSidebarNav'

interface NavRowProps {
  item: NavItem
  expanded: boolean
}

function NavRow({ item, expanded }: NavRowProps) {
  const { getIcon } = useIcons()
  const isIconName = typeof item.icon === 'string'

  const renderIcon = (isActive: boolean) => {
    if (isIconName) {
      return getIcon(item.icon as IconName, { active: isActive })
    }
    const Icon = item.icon as SvgIconComponent
    return (
      <Icon sx={{ fontSize: 18, color: isActive ? '#1D1D1D' : '#9C9CA8', flexShrink: 0 }} />
    )
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
            color: isActive ? '#1D1D1D' : '#FFFFFF',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.label}
        </Typography>
      )}
    </Box>
  )

  return (
    <NavLink to={item.path} end={item.path === '/'} style={{ textDecoration: 'none' }}>
      {({ isActive }) =>
        expanded ? (
          content(isActive)
        ) : (
          <Tooltip title={item.label} placement="right" arrow>
            {content(isActive)}
          </Tooltip>
        )
      }
    </NavLink>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Typography sx={{ ...typo.eyebrow, px: 1.75, pt: 1, pb: 0.5 }}>
      {children}
    </Typography>
  )
}

interface SidebarProps {
  expanded: boolean
}

export function Sidebar({ expanded }: SidebarProps) {
  const { primaryNav } = useSidebarNav()

  return (
    <Box
      sx={{
        width: expanded ? 248 : 72,
        flexShrink: 0,
        bgcolor: '#1D1D1D',
        display: 'flex',
        flexDirection: 'column',
        alignItems: expanded ? 'stretch' : 'center',
        gap: 0.75,
        py: 2.5,
        px: expanded ? 2 : 1.75,
        height: '100dvh',
        position: 'sticky',
        top: 0,
        transition: 'width 0.2s ease, padding 0.2s ease',
        overflow: 'hidden',
      }}
    >
      {expanded && <SectionLabel>NAVEGACIÓN</SectionLabel>}
      {primaryNav.map((item) => <NavRow key={item.path} item={item} expanded={expanded} />)}
    </Box>
  )
}
