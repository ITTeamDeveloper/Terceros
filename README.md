# Terceros

Plataforma web diseñada para centralizar y automatizar la entrega de información de cobranza a empresas terceras (estudios de cobranza).

## Stack

- Vite + React + TypeScript
- React Router (`react-router-dom`)
- Axios
- pnpm (gestor de paquetes)

## Requisitos

- Node.js 18+
- pnpm (`npm install -g pnpm`)

## Instalación

```bash
pnpm install
```

## Scripts

- `pnpm dev` — Servidor de desarrollo en `http://localhost:8081`
- `pnpm build` — Compila TypeScript y genera el bundle de producción
- `pnpm preview` — Previsualiza el build en el puerto `8081`
- `pnpm lint` — Ejecuta ESLint

## Configuración

- Puerto fijo `8081` (`strictPort`) en [vite.config.ts](vite.config.ts).
- Variable de entorno opcional `VITE_API_BASE_URL` para la URL base de la API (fallback: `/api`).

## Regla: archivos de configuración por scope

Existen dos niveles de configuración en el proyecto:

| Scope | Archivo | Contenido |
|---|---|---|
| **General** | `src/config.ts` | Constantes globales de toda la app (nombre, versión, API base, timeouts) |
| **Por sección** | `src/features/{seccion}/constants.ts` | Constantes propias de cada feature (endpoints, labels, valores por defecto) |

**Regla:** toda constante que solo use una sección va en su propio `constants.ts`. Si la necesitan dos o más secciones, sube a `src/config.ts`.

## Estructura (Screaming Architecture)

```
src/
├── app/                          # Composición y enrutamiento
├── features/
│   └── {seccion}/
│       └── constants.ts          # Config de scope por sección
├── services/                     # Cliente HTTP y servicios de API
├── shared/
│   ├── components/
│   ├── hooks/
│   └── types/
├── config.ts                     # Config de scope general
├── App.tsx
└── main.tsx
```
