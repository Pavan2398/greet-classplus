# Stage 1: Build Frontend
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Build Backend & Production Image
FROM node:20-alpine
WORKDIR /app

# Copy server package files
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --production

# Copy server source
COPY server/ ./

# Copy built frontend from Stage 1 into the server folder
COPY --from=client-builder /app/client/dist ./dist

# Expose port
EXPOSE 5000

# Environment variables (Defaults)
ENV NODE_ENV=production
ENV PORT=5000

# Start the application
CMD ["node", "server.js"]
