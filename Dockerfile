# syntax=docker/dockerfile:1.7

# ─── Stage 1: build ─────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ─── Stage 2: runtime ───────────────────────────────────────
FROM nginx:1.27-alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
