import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { AppMessage } from '../../../shared/components'
import { typo } from '../../../shared/styles/typography'
import { SoporteForm } from './components/soporteForm'
import { SoporteTemplates } from './components/soporteTemplates'
import { useSoporte } from './customHooks/useSoporte'

export const SoportePage = () => {
  const controller = useSoporte()
  const hayTemplates = controller.templates.length > 0

  return (
    <Box sx={{ pt: 3, px: 4, pb: 3.5 }}>
      <Box sx={{ mb: 2.5, maxWidth: 760 }}>
        <Typography sx={{ ...typo.h2, mb: 0.75 }}>Soporte</Typography>
        <Typography sx={typo.subtitle}>
          ¿Tienes algún problema con la plataforma? Envíanos un mensaje describiendo lo que
          ocurre y nuestro equipo te responderá lo antes posible.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: hayTemplates ? { xs: '1fr', md: '1fr 320px' } : '1fr',
          gap: 2.5,
          alignItems: 'start',
        }}
      >
        <SoporteForm controller={controller} />
        {hayTemplates && <SoporteTemplates controller={controller} />}
      </Box>

      <AppMessage
        open={controller.feedback.open}
        message={controller.feedback.message}
        statusCode={controller.feedback.statusCode}
        onClose={controller.cerrarFeedback}
      />
    </Box>
  )
}
