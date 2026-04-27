import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const BADGES = ['Descarga única', 'Trazabilidad', 'Flujo de aprobación']

export function AuthBrandPanel() {
  return (
    <Box
      sx={{
        width: 520,
        flexShrink: 0,
        position: 'relative',
        bgcolor: '#1D1D1D',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Línea acento lila */}
      <Box sx={{ position: 'absolute', left: 0, top: 0, width: 4, height: '100%', bgcolor: '#B19BFD' }} />

      {/* Círculos decorativos */}
      <Box sx={{ position: 'absolute', right: -60, top: -100, width: 320, height: 320, borderRadius: '50%', bgcolor: '#B19BFD', opacity: 0.18 }} />
      <Box sx={{ position: 'absolute', left: -60, bottom: -60, width: 260, height: 260, borderRadius: '50%', bgcolor: '#B19BFD', opacity: 0.12 }} />

      {/* Logo */}
      {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 6, pt: 6, position: 'relative' }}>
        <Box sx={{ width: 32, height: 32, borderRadius: '7px', bgcolor: '#B19BFD', flexShrink: 0 }} />
        <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: 20, fontFamily: 'Calibri, sans-serif' }}>
          Terceros
        </Typography>
      </Box> */}

      {/* Tagline */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', px: 6, gap: 2, position: 'relative' }}>
        <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: 24, lineHeight: 1.3, fontFamily: 'Calibri, sans-serif', maxWidth: 380 }}>
          Gestión de cobranza centralizada.
        </Typography>
        <Typography sx={{ color: '#AAAAAA', fontSize: 13, lineHeight: 1.6, fontFamily: 'Calibri, sans-serif', maxWidth: 380 }}>
          Entrega segura, trazabilidad total y aprobación jerárquica para tus estudios terceros.
        </Typography>
      </Box>

      {/* Badges */}
      <Box sx={{ display: 'flex', gap: 1, px: 6, pb: 6, flexWrap: 'wrap', position: 'relative' }}>
        {BADGES.map((label) => (
          <Box
            key={label}
            sx={{ px: 1.5, height: 26, display: 'flex', alignItems: 'center', bgcolor: '#2A2A2A', borderRadius: '13px' }}
          >
            <Typography sx={{ color: '#B19BFD', fontSize: 11, fontFamily: 'Calibri, sans-serif' }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
