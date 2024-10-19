# Base image for the backend
FROM node:latest AS backend-build

# Set the working directory for the backend
WORKDIR /app/backend

# Copy backend package.json and install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy the backend code
COPY backend ./

# Expose the backend port
EXPOSE 5000

# Command to run the backend server
# CMD ["node", "server.js"]

# ---------------------------------------------------------------

# Base image for the frontend
FROM node:18 AS frontend-build

# Set the working directory for the frontend
WORKDIR /app/frontend

# Copy frontend package.json and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy the frontend code
COPY frontend ./

# Build the frontend app
RUN npm run build

# Install Nginx to serve the frontend
FROM nginx:alpine

# Copy the built frontend from the previous stage
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

COPY --from=backend-build /app/backend /app/backend

COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh
# Expose the Nginx port
EXPOSE 80

# Start Nginx and the backend server
CMD ["node", "server.js"]