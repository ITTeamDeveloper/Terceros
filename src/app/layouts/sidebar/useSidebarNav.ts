import { useEffect, useState } from 'react'
import type { SvgIconComponent } from '@mui/icons-material'
import { sidebarServices } from '../../../services/sidebarServices'
import type { IconName } from '../../../shared/hooks/useIcons'

export interface NavItem {
  label: string
  path: string
  icon: IconName | SvgIconComponent
}

export function useSidebarNav() {
  const [primaryNav, setPrimaryNav] = useState<NavItem[]>([])

  useEffect(() => {
    const ctrl = new AbortController()
    sidebarServices
      .listar(ctrl.signal)
      .then((items) => {
        setPrimaryNav(
          items.map((item) => ({
            label: item.nombre,
            path: item.url,
            icon: item.icon as IconName,
          })),
        )
      })
      .catch(() => {})
    return () => ctrl.abort()
  }, [])

  return { primaryNav }
}
