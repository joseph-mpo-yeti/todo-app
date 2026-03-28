# ---- Builder stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install all dependencies (including dev) for building
COPY package*.json ./
RUN npm ci

# Copy source and build the Vite app
COPY . .
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine
# Install a lightweight static server
RUN npm install -g serve
# Copy built assets from builder
COPY --from=builder /app/dist /app/dist
EXPOSE 80
# Serve the static files
CMD ["serve", "-s", "/app/dist", "-l", "80"]
