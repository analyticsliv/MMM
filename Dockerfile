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

# Accept all environment variables as build arguments
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG NEXTAUTH_SECRET
ARG BASE_API_URL
ARG GA4_REDIRECT_URI
ARG FACEBOOK_REDIRECT_URI
ARG GOOGLE_ADS_REDIRECT_URI
ARG LINKEDIN_REDIRECT_URI
ARG DV360_REDIRECT_URI
ARG NEXTAUTH_URL
ARG MONGODB_URI
ARG FACEBOOK_CLIENT_ID
ARG FACEBOOK_CLIENT_SECRET
ARG LINKEDIN_CLIENT_ID
ARG LINKEDIN_CLIENT_SECRET
ARG DEVELOPER_TOKEN

# Set environment variables for build time (so Next.js can access them)
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV BASE_API_URL=$BASE_API_URL
ENV GA4_REDIRECT_URI=$GA4_REDIRECT_URI
ENV FACEBOOK_REDIRECT_URI=$FACEBOOK_REDIRECT_URI
ENV GOOGLE_ADS_REDIRECT_URI=$GOOGLE_ADS_REDIRECT_URI
ENV LINKEDIN_REDIRECT_URI=$LINKEDIN_REDIRECT_URI
ENV DV360_REDIRECT_URI=$DV360_REDIRECT_URI
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV MONGODB_URI=$MONGODB_URI
ENV FACEBOOK_CLIENT_ID=$FACEBOOK_CLIENT_ID
ENV FACEBOOK_CLIENT_SECRET=$FACEBOOK_CLIENT_SECRET
ENV LINKEDIN_CLIENT_ID=$LINKEDIN_CLIENT_ID
ENV LINKEDIN_CLIENT_SECRET=$LINKEDIN_CLIENT_SECRET
ENV DEVELOPER_TOKEN=$DEVELOPER_TOKEN

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]