# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Production Stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Set environment to production
ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
