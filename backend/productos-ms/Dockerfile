# FROM node:20-alpine AS builder
# WORKDIR /app

# # Install deps
# COPY package.json package-lock.json* ./
# RUN npm install

# # Copy sources and build
# COPY . .
# RUN npm run build

# FROM node:18-alpine AS runner
# WORKDIR /app
# ENV NODE_ENV=production

# # Install only production deps
# COPY package.json package-lock.json* ./
# RUN npm ci --omit=dev

# # Copy built files
# COPY --from=builder /app/dist ./dist

# # Expose HTTP and TCP ports (default: HTTP 3002, TCP 3003)
# EXPOSE 3002 3003

# CMD ["node", "dist/main"]



# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente y build NestJS
COPY . .
RUN npm run build

# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=${TCP_PORT:-3002}

# Instalar solo dependencias de producción
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar build
COPY --from=builder /app/dist ./dist

EXPOSE ${PORT}

CMD ["node", "dist/main.js"]
