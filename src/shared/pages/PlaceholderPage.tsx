import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { ConstructionOutlined as ConstructionIcon } from '@mui/icons-material'
import { typo } from '../styles/typography'

interface PlaceholderPageProps {
  title: string
  description?: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          bgcolor: '#FFFFFF',
          border: '1px solid #EAE5FF',
          borderRadius: '18px',
          p: 6,
          minHeight: 360,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 2.5,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            right: -80,
            top: -120,
            width: 360,
            height: 360,
            borderRadius: '50%',
            bgcolor: '#B19BFD',
            opacity: 0.12,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            right: 40,
            bottom: -100,
            width: 220,
            height: 220,
            borderRadius: '50%',
            border: '36px solid #F3BB4A',
            opacity: 0.4,
            clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)',
          }}
        />

        <Box
          sx={{
            position: 'relative',
            width: 56,
            height: 56,
            borderRadius: '14px',
            bgcolor: '#F3F0FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ConstructionIcon sx={{ fontSize: 28, color: '#8B6CFB' }} />
        </Box>

        <Typography sx={{ ...typo.eyebrowAccent, position: 'relative' }}>
          PRÓXIMAMENTE
        </Typography>

        <Typography sx={{ ...typo.display2, fontSize: 32, position: 'relative', maxWidth: 520 }}>
          {title}
        </Typography>

        {description && (
          <Typography sx={{ ...typo.bodyLg, color: '#7A7390', position: 'relative', maxWidth: 520 }}>
            {description}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
