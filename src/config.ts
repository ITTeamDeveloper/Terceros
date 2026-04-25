export const APP_CONFIG = {
  name: 'Terceros',
  version: '1.0.0',
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
    timeout: 15000,
  },
} as const
