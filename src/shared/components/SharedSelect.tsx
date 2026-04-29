import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { ComboOption } from './SharedCombobox'

interface SharedSelectProps {
  label?: string
  placeholder?: string
  options: ComboOption[]
  value: ComboOption | null
  onChange: (selected: ComboOption | null) => void
  loading?: boolean
  disabled?: boolean
}

export function SharedSelect({
  label,
  placeholder = 'Selecciona una opción',
  options,
  value,
  onChange,
  loading = false,
  disabled = false,
}: SharedSelectProps) {
  return (
    <Box>
      {label && (
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: '#1D1D1D',
            fontFamily: 'Inter, sans-serif',
            mb: 1,
          }}
        >
          {label}
        </Typography>
      )}
      <Autocomplete
        options={options}
        value={value}
        loading={loading}
        disabled={disabled}
        noOptionsText="No hay opciones disponibles"
        loadingText="Cargando..."
        getOptionLabel={(option) => option.data ?? ''}
        isOptionEqualToValue={(opt, val) => opt.value === val.value}
        onChange={(_, newValue) => onChange(newValue)}
        renderOption={(props, option) => {
          const { key, ...rest } = props as { key: string } & Record<string, unknown>
          return (
            <li key={key} {...rest}>
              <Typography
                sx={{ fontSize: 12, fontFamily: 'Inter, sans-serif', color: '#1D1D1D' }}
              >
                {option.data}
              </Typography>
            </li>
          )
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={value ? '' : placeholder}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: 12,
                fontFamily: 'Inter, sans-serif',
                borderRadius: '6px',
                bgcolor: '#FFFFFF',
                py: '4px !important',
                px: '8px !important',
                gap: '4px',
                minHeight: 36,
                '& fieldset': { borderColor: '#EEEEEE' },
                '&:hover fieldset': { borderColor: '#B19BFD' },
                '&.Mui-focused fieldset': { borderColor: '#B19BFD', borderWidth: 1 },
              },
              '& .MuiAutocomplete-input': {
                fontSize: 12,
                fontFamily: 'Inter, sans-serif',
                py: '2px !important',
                minWidth: '40px !important',
              },
            }}
          />
        )}
        slotProps={{
          paper: {
            sx: {
              fontFamily: 'Inter, sans-serif',
              borderRadius: '6px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            },
          },
        }}
      />
    </Box>
  )
}
