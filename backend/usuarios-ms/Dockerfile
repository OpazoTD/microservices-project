# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar todo el código
COPY . .

# Generar cliente de Prisma y build de NestJS
RUN npx prisma generate
RUN npm run build && ls -la dist/
# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=${TCP_PORT:-3001}
#Herramienta para hacer health checks con TCP (usada por Docker Compose)
RUN apk add --no-cache busybox-extras
# Instalar solo dependencias de producción
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar build
COPY --from=builder /app/dist ./dist

# Copiar Prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE ${PORT}

CMD ["sh", "-c", "ls -la dist/ && node dist/main.js"]