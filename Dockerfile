# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm ci

# Copy application source code
COPY . .

# Build the NestJS application
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS production

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV production

# Copy only production package files and install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built application from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the application port (default for NestJS is 3000)
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main.js"]
