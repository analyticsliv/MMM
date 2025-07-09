FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Set temporary values for build time
ENV MONGODB_URI="mongodb://build-placeholder:27017/placeholder"
ENV NEXTAUTH_SECRET="build-time-secret"
ENV NEXTAUTH_URL="https://placeholder.com"
ENV GOOGLE_CLIENT_ID="placeholder"
ENV GOOGLE_CLIENT_SECRET="placeholder"
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application (NODE_ENV=production is available here)
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]