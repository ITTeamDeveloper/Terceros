import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { brandPanelSize, containerFlow, imageSize, textSize } from './AuthBrandPanelStyle'


export function AuthBrandPanel() {
  return (
    <Box
      className="auth-brand-panel"
      sx={{
        width: '100%',
        height: '100vh',
        flexShrink: 0,
        position: 'absolute',
        bgcolor: '#456648',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        animation: `${brandPanelSize} 0.58s cubic-bezier(0.4, 0, 0.2, 1) 2.42s forwards`,
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
          bgcolor: '#eae6db',
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
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          transformOrigin: 'center',
          animation: `${containerFlow} 2.42s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
        }}
      >
        <Box
          component="img"
          src="/logo.png"
          alt="Finanty"
          sx={{
            height: '9rem',
            width: 'auto',
            paddingRight: 1,
            display: 'block',
            borderRight: '2px solid white',
            marginRight: '1.5rem',
            animation: `${imageSize} 2.42s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
          }}
        />
        <Typography
          sx={{
            fontFamily: 'sans-serif',
            color: 'white',
            fontSize: '9rem',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            animation: `${textSize} 2.42s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
          }}
        >
          Terceros
        </Typography>
      </Box>
    </Box>
  )
}
