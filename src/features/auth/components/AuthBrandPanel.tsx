import Box from '@mui/material/Box'

const ACCENT_DOTS = ['#B19BFD', '#E3734F', '#F3BB4A', '#456648', '#4574BF', '#E8C8D6']

interface AuthBrandPanelProps {
  glow2Color?: string
}

export function AuthBrandPanel({ glow2Color = '#E3734F' }: AuthBrandPanelProps) {
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
      {/* Lila accent line */}
      <Box sx={{ position: 'absolute', left: 0, top: 0, width: 4, height: '100%', bgcolor: '#B19BFD' }} />

      {/* Soft glows */}
      <Box
        sx={{
          position: 'absolute',
          right: -100,
          top: -180,
          width: 520,
          height: 520,
          borderRadius: '50%',
          bgcolor: '#B19BFD',
          opacity: 0.18,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: 280,
          bottom: -180,
          width: 340,
          height: 340,
          borderRadius: '50%',
          bgcolor: glow2Color,
          opacity: 0.10,
        }}
      />

      {/* Support arc (manual de marca A.2.8) */}
      <Box
        sx={{
          position: 'absolute',
          left: 80,
          bottom: -10,
          width: 380,
          height: 380,
          borderRadius: '50%',
          border: '52px solid #B19BFD',
          clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Logo */}
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', px: 6, pt: 6 }}>
        <Box
          component="img"
          src="/Logo%20Finanty%20blanco.png"
          alt="Finanty"
          sx={{ height: '25rem', width: 'auto', display: 'block' }}
        />
      </Box>

      {/* Spacer */}
      <Box sx={{ flex: 1 }} />

      {/* Accent dots */}
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 1.25, px: 6, pb: 6 }}>
        {ACCENT_DOTS.map((c) => (
          <Box key={c} sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: c }} />
        ))}
      </Box>
    </Box>
  )
}
