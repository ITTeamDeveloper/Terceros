import {
  CalendarMonth as CalendarMonthIcon,
  Business as BusinessIcon,
  FolderOpen as FolderOpenIcon,
  VerifiedUser as VerifiedUserIcon,
  Settings as SettingsIcon,
  HelpOutlined as HelpOutlineIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  CloudDownloadOutlined as CloudDownloadOutlinedIcon,
  HistoryOutlined as HistoryOutlinedIcon,
} from '@mui/icons-material'
import type { SvgIconComponent } from '@mui/icons-material'

export type IconName =
  | 'calendario'
  | 'empresa'
  | 'carpeta'
  | 'aprobacion'
  | 'configuracion'
  | 'ayuda'
  | 'documento'
  | 'descarga'
  | 'historial'

const ICON_MAP: Record<IconName, SvgIconComponent> = {
  calendario: CalendarMonthIcon,
  empresa: BusinessIcon,
  carpeta: FolderOpenIcon,
  aprobacion: VerifiedUserIcon,
  configuracion: SettingsIcon,
  ayuda: HelpOutlineIcon,
  documento: DescriptionOutlinedIcon,
  descarga: CloudDownloadOutlinedIcon,
  historial: HistoryOutlinedIcon,
}

export interface IconOptions {
  active?: boolean
  size?: number
  color?: string
}

export function useIcons() {
  const getIcon = (name: IconName, opts: IconOptions = {}) => {
    const Icon = ICON_MAP[name]
    const { active = false, size = 18, color } = opts
    const resolvedColor = color ?? (active ? '#1D1D1D' : '#9C9CA8')
    return (
      <Icon sx={{ fontSize: size, color: resolvedColor, flexShrink: 0 }} />
    )
  }

  const getIconComponent = (name: IconName): SvgIconComponent => ICON_MAP[name]

  return {
    getIcon,
    getIconComponent,
    names: Object.keys(ICON_MAP) as IconName[],
  }
}
