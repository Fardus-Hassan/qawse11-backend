# Builder stage: install dependencies and build
FROM node:18-alpine AS builder
WORKDIR /app

# enable Corepack (pnpm) and install deps using the lockfile
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

# Copy sources and generate prisma client + build
COPY . .
RUN pnpm prisma:generate
RUN pnpm build

# Production image: copy artifacts only
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only what's needed for running the app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY package.json ./package.json

EXPOSE 5005
CMD ["node", "dist/server.js"]