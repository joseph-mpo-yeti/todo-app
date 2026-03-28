# ---- Builder stage ----
FROM node:18-alpine AS builder
WORKDIR /app

# Install all dependencies (including dev) for building
COPY package*.json ./
RUN npm ci

# Copy source and build the Vite app
COPY . .
RUN npm run build

# ---- Production stage ----
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
