export const ROLES = {
  ROL_ESTUDIO: 17,
  ROL_SUPERVISOR_ESTUDIO: 20,
  ROL_ESPECIALES: 61,
  ROL_SUPERVISOR_ESPECIALES: 62,
} as const

export type RolId = (typeof ROLES)[keyof typeof ROLES]

export const esRolSupervisor = (rolId?: RolId): boolean =>
  rolId === ROLES.ROL_SUPERVISOR_ESTUDIO ||
  rolId === ROLES.ROL_SUPERVISOR_ESPECIALES

export const esRolEstudio = (rolId?: RolId): boolean =>
  rolId === ROLES.ROL_ESTUDIO || rolId === ROLES.ROL_ESPECIALES

export const tieneRolSupervisor = (rolIds?: readonly RolId[]): boolean =>
  rolIds?.some(esRolSupervisor) ?? false

export const tieneRolEstudio = (rolIds?: readonly RolId[]): boolean =>
  rolIds?.some(esRolEstudio) ?? false
