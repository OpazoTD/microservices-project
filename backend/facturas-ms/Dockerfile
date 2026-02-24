# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

ARG DATABASE_URL=mongodb://admin:admin123@mongodb:27017/facturas_db?authSource=admin&replicaSet=rs0
ENV DATABASE_URL=$DATABASE_URL

COPY package*.json ./
RUN npm install prisma@6.19.2 @prisma/client@6.19.2 --save-exact --legacy-peer-deps
RUN npm install --legacy-peer-deps

COPY . .

RUN ./node_modules/.bin/prisma generate --schema=./prisma/schema.prisma

RUN npm run build

# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl busybox-extras
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install prisma@6.19.2 @prisma/client@6.19.2 --save-exact --legacy-peer-deps
RUN npm install --legacy-peer-deps

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

ENV PORT=3003
EXPOSE 3003

CMD ["node", "dist/src/main.js"]
