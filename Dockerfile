# Use Node.js LTS version
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the frontend
RUN npm run build

# Production image
FROM node:20-slim

WORKDIR /app

# Copy built assets and necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/tsconfig.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Set production environment
ENV NODE_ENV=production

# Expose the port (Cloud Run will override this)
EXPOSE 3000

# Start the application
CMD ["npx", "tsx", "server.ts"]
