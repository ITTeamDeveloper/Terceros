import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import {
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CheckBox as CheckBoxIcon,
} from '@mui/icons-material'

export interface ComboOption {
  data: string
  value: string
}

interface SharedComboboxProps {
  label?: string
  placeholder?: string
  options: ComboOption[]
  value: ComboOption[]
  onChange: (selected: ComboOption[]) => void
  multiple?: boolean
  loading?: boolean
  disabled?: boolean
}

export function SharedCombobox({
  label,
  placeholder = 'Selecciona una opción',
  options,
  value,
  onChange,
  multiple = true,
  loading = false,
  disabled = false,
}: SharedComboboxProps) {
  return (
    <Box>
      {label && (
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: '#1D1D1D',
            fontFamily: 'Calibri, sans-serif',
            mb: 1,
          }}
        >
          {label}
        </Typography>
      )}
      <Autocomplete
        multiple={multiple}
        disableCloseOnSelect={multiple}
        options={options}
        value={value}
        loading={loading}
        disabled={disabled}
        getOptionLabel={(option) => option.data}
        isOptionEqualToValue={(opt, val) => opt.value === val.value}
        onChange={(_, newValue) => {
          const next = Array.isArray(newValue)
            ? newValue
            : newValue
              ? [newValue]
              : []
          onChange(next as ComboOption[])
        }}
        renderOption={(props, option, { selected }) => {
          const { key, ...rest } = props as { key: string } & Record<string, unknown>
          return (
            <li key={key} {...rest}>
              {multiple && (
                <Checkbox
                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                  checked={selected}
                  sx={{
                    mr: 1,
                    color: '#B19BFD',
                    '&.Mui-checked': { color: '#B19BFD' },
                  }}
                />
              )}
              <Typography
                sx={{ fontSize: 12, fontFamily: 'Calibri, sans-serif', color: '#1D1D1D' }}
              >
                {option.data}
              </Typography>
            </li>
          )
        }}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index })
            return (
              <Chip
                key={key}
                label={option.data}
                size="small"
                {...tagProps}
                sx={{
                  bgcolor: '#F3F0FF',
                  color: '#1D1D1D',
                  borderRadius: '4px',
                  height: 22,
                  '& .MuiChip-label': {
                    fontFamily: 'Calibri, sans-serif',
                    fontSize: 12,
                    fontWeight: 500,
                    px: 1,
                  },
                  '& .MuiChip-deleteIcon': {
                    fontSize: 14,
                  },
                }}
              />
            )
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={value.length === 0 ? placeholder : ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: 12,
                fontFamily: 'Calibri, sans-serif',
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
                fontFamily: 'Calibri, sans-serif',
                py: '2px !important',
                minWidth: '40px !important',
              },
            }}
          />
        )}
        slotProps={{
          paper: {
            sx: {
              fontFamily: 'Calibri, sans-serif',
              borderRadius: '6px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            },
          },
        }}
      />
    </Box>
  )
}
