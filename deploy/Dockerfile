# Uygulama imajı. Proje kökünden derlenir: docker compose -f deploy/docker-compose.yml build

FROM node:24-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# builder aşaması migration ve seed için de kullanılır (drizzle-kit ve tsx burada var)
FROM node:24-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# NEXT_PUBLIC_* değerleri derleme sırasında koda gömülür
ARG NEXT_PUBLIC_ROOT_DOMAIN
ARG NEXT_PUBLIC_PLATFORM_NAME
ENV NEXT_PUBLIC_ROOT_DOMAIN=$NEXT_PUBLIC_ROOT_DOMAIN \
    NEXT_PUBLIC_PLATFORM_NAME=$NEXT_PUBLIC_PLATFORM_NAME
RUN npm run build

FROM node:24-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Yüklenen fotoğraflar bu klasöre yazılır (docker-compose'da kalıcı volume olarak bağlanır)
RUN mkdir -p /app/.media && chown nextjs:nodejs /app/.media

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
