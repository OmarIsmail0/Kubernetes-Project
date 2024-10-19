# ===========================
# Stage 1: Build Frontend
# ===========================
FROM node:18 AS frontend-build

# Set working directory
WORKDIR /usr/src/frontend

# Install frontend dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source code
COPY frontend ./

# Build the frontend
RUN npm run build

# ===========================
# Stage 2: Backend Setup
# ===========================
FROM node:18 AS backend-build

# Set working directory for backend
WORKDIR /usr/src/backend

# Install backend dependencies
COPY backend/package*.json ./
RUN npm install

# Copy backend source code
COPY backend ./

# ===========================
# Stage 3: Final Stage (Combine Frontend & Backend)
# ===========================
FROM nginx:alpine

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built frontend from Stage 1
COPY --from=frontend-build /usr/src/frontend/dist /usr/share/nginx/html

# Copy backend code from Stage 2
COPY --from=backend-build /usr/src/backend /app/backend

# Expose both ports (Frontend on 80, Backend on 5000)
EXPOSE 80 5000

# Install necessary tools (for process management)
RUN apk add --no-cache bash curl && \
    npm install -g pm2

# Command to start both Nginx and Node.js backend using pm2
CMD ["sh", "-c", "pm2 start /app/backend/server.js && nginx -g 'daemon off;'"]
