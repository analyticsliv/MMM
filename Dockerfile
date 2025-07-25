# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set NEXT_PUBLIC_ variables for build time (these get embedded in the bundle)
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID="360569391935-r3jj5sot4a9fg1aev0i40ujntcfl7cpt.apps.googleusercontent.com"
ENV NEXT_PUBLIC_GOOGLE_CLIENT_SECRET="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"
ENV NEXT_PUBLIC_GA4_REDIRECT_URI="https://mmm-tool-135392845747.asia-south1.run.app/feature/connectors/ga4Connector/sucess"

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]