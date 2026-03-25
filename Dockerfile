# ── Etapa 1: Build ──
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar archivos de dependencias primero (cache de capas)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma
COPY prisma.config.ts ./

RUN pnpm install --frozen-lockfile

# Copiar el resto del código fuente
COPY tsconfig.json ./
COPY src ./src

# Generar el cliente de Prisma
RUN pnpm prisma generate

# Compilar TypeScript
RUN pnpm build

# Copiar swagger.yaml al dist (compatible con Linux)
RUN mkdir -p dist/docs && cp src/docs/swagger.yaml dist/docs/

# ── Etapa 2: Producción ──
FROM node:20-alpine AS production

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma
COPY prisma.config.ts ./

# Solo dependencias de producción
RUN pnpm install --frozen-lockfile --prod

# Copiar el build y el cliente generado de Prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated

EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/server.js"]
