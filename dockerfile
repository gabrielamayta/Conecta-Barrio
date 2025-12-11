# ----------------------------------------------------------------------
# 1. ETAPA DE CONSTRUCCIÓN (BUILDER STAGE)
# ----------------------------------------------------------------------
FROM oven/bun:1 as builder

WORKDIR /app

# Copia los archivos de configuración
# Usamos .mjs y los archivos que SÍ existen en tu repositorio
#COPY package.json next.config.mjs bun.lock ./
#COPY tsconfig.json tailwind.config.js postcss.config.mjs ./

# Instala las dependencias y construye la aplicación
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# ----------------------------------------------------------------------
# 2. ETAPA DE PRODUCCIÓN (RUNNER STAGE)
# ----------------------------------------------------------------------
FROM oven/bun:1-slim as runner

WORKDIR /app

# Configura variables de entorno críticas
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Copia solo los archivos construidos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Comando de inicio
CMD ["bun", "run", "start"]