# Use an official Node runtime as a parent image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy source files
COPY . .

# Expose the port the server runs on
EXPOSE 4000

# Run the server
CMD ["node", "server.js"]
