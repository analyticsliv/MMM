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
ENV NEXTAUTH_SECRET="MMMSecret"
ENV NEXTAUTH_URL="https://mmm-tool-135392845747.asia-south1.run.app"
ENV MONGODB_URI="mongodb+srv://atulverma:vermaatul1234@cluster0.mm9pt5h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
ENV BASE_API_URL="https://mmm-tool-135392845747.asia-south1.run.app/"
ENV FACEBOOK_REDIRECT_URI="https://mmm-tool-135392845747.asia-south1.run.app/api/facebook-callback"
ENV GOOGLE_ADS_REDIRECT_URI="https://mmm-tool-135392845747.asia-south1.run.app/feature/connectors/googleAdsConnector/sucess"
ENV LINKEDIN_REDIRECT_URI="https://mmm-tool-135392845747.asia-south1.run.app/feature/connectors/linkedInConnector/sucess"
ENV DV360_REDIRECT_URI="https://mmm-tool-135392845747.asia-south1.run.app/feature/connectors/dv360Connector/sucess"
ENV FACEBOOK_CLIENT_ID="908433010270201"
ENV FACEBOOK_CLIENT_SECRET="64a93262f289e41cfc934f565343bfbb"
ENV LINKEDIN_CLIENT_ID="77ussk8nyildyr"
ENV LINKEDIN_CLIENT_SECRET="wyG1SscwboNSSWCH"
ENV DEVELOPER_TOKEN="GADvxdtoU2fCzjFRGNpleg"

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