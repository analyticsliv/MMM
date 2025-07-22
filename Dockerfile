# # Use Node.js 18 Alpine as base image
# FROM node:18-alpine AS base

# # Install dependencies only when needed
# FROM base AS deps
# RUN apk add --no-cache libc6-compat
# WORKDIR /app

# # Copy package files
# COPY package.json package-lock.json* ./
# RUN npm ci --only=production

# # Rebuild the source code only when needed
# FROM base AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

# # Accept all environment variables as build arguments
# ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
# ARG NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
# ARG NEXTAUTH_SECRET
# ARG BASE_API_URL
# ARG GA4_REDIRECT_URI
# ARG FACEBOOK_REDIRECT_URI
# ARG GOOGLE_ADS_REDIRECT_URI
# ARG LINKEDIN_REDIRECT_URI
# ARG DV360_REDIRECT_URI
# ARG NEXTAUTH_URL
# ARG MONGODB_URI
# ARG FACEBOOK_CLIENT_ID
# ARG FACEBOOK_CLIENT_SECRET
# ARG LINKEDIN_CLIENT_ID
# ARG LINKEDIN_CLIENT_SECRET
# ARG DEVELOPER_TOKEN

# # Set environment variables with default fallbacks for URLs
# ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID:-""}
# ENV NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=${NEXT_PUBLIC_GOOGLE_CLIENT_SECRET:-""}
# ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-"fallback-secret"}
# ENV BASE_API_URL=${BASE_API_URL:-"http://localhost:3000"}
# ENV GA4_REDIRECT_URI=${GA4_REDIRECT_URI:-"http://localhost:3000/feature/connectors/ga4Connector/sucess"}
# ENV FACEBOOK_REDIRECT_URI=${FACEBOOK_REDIRECT_URI:-"http://localhost:3000/api/facebook-callback"}
# ENV GOOGLE_ADS_REDIRECT_URI=${GOOGLE_ADS_REDIRECT_URI:-"http://localhost:3000/feature/connectors/googleAdsConnector/sucess"}
# ENV LINKEDIN_REDIRECT_URI=${LINKEDIN_REDIRECT_URI:-"http://localhost:3000/feature/connectors/linkedInConnector/sucess"}
# ENV DV360_REDIRECT_URI=${DV360_REDIRECT_URI:-"http://localhost:3000/feature/connectors/dv360Connector/sucess"}
# ENV NEXTAUTH_URL=${NEXTAUTH_URL:-"http://localhost:3000"}
# ENV MONGODB_URI=${MONGODB_URI:-""}
# ENV FACEBOOK_CLIENT_ID=${FACEBOOK_CLIENT_ID:-""}
# ENV FACEBOOK_CLIENT_SECRET=${FACEBOOK_CLIENT_SECRET:-""}
# ENV LINKEDIN_CLIENT_ID=${LINKEDIN_CLIENT_ID:-""}
# ENV LINKEDIN_CLIENT_SECRET=${LINKEDIN_CLIENT_SECRET:-""}
# ENV DEVELOPER_TOKEN=${DEVELOPER_TOKEN:-""}

# # Build the application
# RUN npm run build

# # Production image, copy all the files and run next
# FROM base AS runner
# WORKDIR /app

# ENV NODE_ENV production

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# COPY --from=builder /app/public ./public
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# USER nextjs

# EXPOSE 3000

# ENV PORT 3000
# ENV HOSTNAME "0.0.0.0"

# CMD ["node", "server.js"]



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
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
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

# Set NEXTPUBLIC environment variables for build time
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
ENV NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=${NEXT_PUBLIC_GOOGLE_CLIENT_SECRET}

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

# Create a script to start the application
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'exec node server.js' >> /app/start.sh && \
    chmod +x /app/start.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["/app/start.sh"]