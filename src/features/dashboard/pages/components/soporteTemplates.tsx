import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { useSoporte } from '../customHooks/useSoporte'

interface SoporteTemplatesProps {
  controller: ReturnType<typeof useSoporte>
}

export function SoporteTemplates({ controller }: SoporteTemplatesProps) {
  const { templates, aplicarTemplate, subject: currentSubject } = controller

  if (templates.length === 0) return null

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 700,
          color: '#1D1D1D',
          fontFamily: 'Inter, sans-serif',
          mb: 0.25,
        }}
      >
        Plantillas frecuentes
      </Typography>

      {templates.map((tpl) => {
        const seleccionado = currentSubject === tpl.subject
        return (
          <Box
            key={tpl.subject}
            onClick={() => aplicarTemplate(tpl)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                aplicarTemplate(tpl)
              }
            }}
            sx={{
              p: 2,
              bgcolor: seleccionado ? '#9B82FC' : '#B19BFD',
              color: '#FFFFFF',
              border: '1px solid',
              borderColor: seleccionado ? '#7C63E0' : '#B19BFD',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'background-color 0.15s, transform 0.1s',
              '&:hover': { bgcolor: '#9B82FC' },
              '&:active': { transform: 'scale(0.99)' },
              outline: 'none',
              '&:focus-visible': { boxShadow: '0 0 0 3px rgba(177,155,253,0.45)' },
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                mb: 0.5,
              }}
            >
              {tpl.subject}
            </Typography>
            <Typography
              sx={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.92)',
                fontFamily: 'Inter, sans-serif',
                lineHeight: 1.4,
              }}
            >
              {tpl.description}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}
