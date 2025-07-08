FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencie
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment variables needed during build
ARG MONGODB_URI

# Set environment variables for build
ENV MONGODB_URI=$MONGODB_URI
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]