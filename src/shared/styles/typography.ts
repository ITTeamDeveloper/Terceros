import type { SxProps, Theme } from '@mui/material'

/**
 * Sistema tipográfico Finanty / Terceros.
 *
 * Familias:
 *  - Display (titulares, marca): Fraunces (Recoleta-like)
 *  - Body (UI, formularios): Inter (Lota Grotesque-like)
 *
 * Uso: <Typography sx={typo.pageTitle}>...
 *      <Box sx={[typo.body, { color: '#fff' }]}>...
 */

const FONT_DISPLAY = 'Fraunces, "Recoleta", Georgia, serif'
const FONT_BODY = 'Inter, "Lota Grotesque", system-ui, sans-serif'

const TEXT = '#1D1D1D'
const TEXT_MUTE = '#7A7390'
const ACCENT = '#8B6CFB'

/** Display 1 — Hero / brand title (Login brand panel, marketing). */
export const display1: SxProps<Theme> = {
  fontFamily: FONT_DISPLAY,
  fontSize: 48,
  fontWeight: 400,
  lineHeight: 1.05,
  letterSpacing: '-0.02em',
  color: TEXT,
}

/** Display 2 — Form headlines, section heroes. */
export const display2: SxProps<Theme> = {
  fontFamily: FONT_DISPLAY,
  fontSize: 40,
  fontWeight: 700,
  lineHeight: 1.1,
  letterSpacing: '-0.02em',
  color: TEXT,
}

/** H1 — Page title (Topbar). */
export const h1: SxProps<Theme> = {
  fontFamily: FONT_DISPLAY,
  fontSize: 22,
  fontWeight: 400,
  lineHeight: 1.15,
  letterSpacing: '-0.02em',
  color: TEXT,
}

/** H2 — Section / card title. */
export const h2: SxProps<Theme> = {
  fontFamily: FONT_DISPLAY,
  fontSize: 18,
  fontWeight: 400,
  lineHeight: 1.2,
  letterSpacing: '-0.01em',
  color: TEXT,
}

/** H3 — Subsection title (sans-serif, fuerte). */
export const h3: SxProps<Theme> = {
  fontFamily: FONT_BODY,
  fontSize: 14,
  fontWeight: 700,
  lineHeight: 1.3,
  color: TEXT,
}

/** Subtitle — texto de apoyo bajo un title (descripción). */
export const subtitle: SxProps<Theme> = {
  fontFamily: FONT_BODY,
  fontSize: 13,
  fontWeight: 400,
  lineHeight: 1.55,
  color: TEXT_MUTE,
}

/** Body grande — Texto base de página. */
export const bodyLg: SxProps<Theme> = {
  fontFamily: FONT_BODY,
  fontSize: 14,
  fontWeight: 400,
  lineHeight: 1.55,
  color: TEXT,
}

/** Body — Texto estándar (tablas, contenido). */
export const body: SxProps<Theme> = {
  fontFamily: FONT_BODY,
  fontSize: 13,
  fontWeight: 400,
  lineHeight: 1.5,
  color: TEXT,
}

/** Body small — Texto secundario. */
export const bodySm: SxProps<Theme> = {
  fontFamily: FONT_BODY,
  fontSize: 12,
  fontWeight: 400,
  lineHeight: 1.45,
  color: TEXT,
}

/** Caption — microcopy / metadatos. */
export const caption: SxProps<Theme> = {
  fontFamily: FONT_BODY,
  fontSize: 11,
  fontWeight: 500,
  lineHeight: 1.4,
  color: TEXT_MUTE,
}

/** Label — Etiqueta de formulario. */
export const label: SxProps<Theme> = {
  fontFamily: FONT_BODY,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.04em',
  color: TEXT,
}

/** Eyebrow — Sección en mayúsculas (NAVEGACIÓN, CUENTA, PRÓXIMAMENTE). */
export const eyebrow: SxProps<Theme> = {
  fontFamily: FONT_BODY,
  display: 'flex',
  paddingBottom: '1rem',
  fontSize: 14,
  fontWeight: 700,
  color: ' #FFFFFF',
  borderBottom: '3px solid ' + TEXT_MUTE
}

/** Eyebrow accent — Eyebrow en color de marca. */
export const eyebrowAccent: SxProps<Theme> = {
  ...eyebrow,
  color: ACCENT,
}

/** Button — Texto de botón primario. */
export const button: SxProps<Theme> = {
  fontFamily: FONT_BODY,
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: '0.02em',
  lineHeight: 1,
  textTransform: 'none',
}

/** Button large — CTAs principales. */
export const buttonLg: SxProps<Theme> = {
  fontFamily: FONT_BODY,
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: '0.02em',
  lineHeight: 1,
  textTransform: 'none',
}

/** Stat number — Cifras grandes (Fraunces). */
export const statNumber: SxProps<Theme> = {
  fontFamily: FONT_DISPLAY,
  fontSize: 42,
  fontWeight: 400,
  letterSpacing: '-0.02em',
  lineHeight: 1,
  color: TEXT,
}

/** Link — Enlaces inline. */
export const link: SxProps<Theme> = {
  fontFamily: FONT_BODY,
  fontSize: 12,
  fontWeight: 700,
  color: ACCENT,
  textDecoration: 'none',
  cursor: 'pointer',
}

export const fontFamily = {
  display: FONT_DISPLAY,
  body: FONT_BODY,
}

/** Bundle exportado para uso `sx={typo.h1}`. */
export const typo = {
  display1,
  display2,
  h1,
  h2,
  h3,
  subtitle,
  bodyLg,
  body,
  bodySm,
  caption,
  label,
  eyebrow,
  eyebrowAccent,
  button,
  buttonLg,
  statNumber,
  link,
}
