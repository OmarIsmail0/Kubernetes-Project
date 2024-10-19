# Base image for the backend
FROM node:20 AS backend-build

# Set the working directory for the backend
WORKDIR /app/backend

# Copy backend package.json and install dependencies
COPY backend/package.json ./
RUN npm install

# Copy the backend code
COPY backend ./

# Expose the backend port
EXPOSE 5000

# Command to run the backend server

# Base image for the frontend
FROM node:20 AS frontend-build

# Set the working directory for the frontend
WORKDIR /app/frontend

# Copy frontend package.json and install dependencies
COPY frontend/package.json ./



RUN npm install

# Copy the frontend code
COPY frontend ./

# Build the frontend app
RUN npm run build

# Install Nginx to serve the frontend
FROM nginx:alpine

# Install bash and Node.js
RUN apk add --no-cache bash nodejs npm

# Copy the built frontend from the previous stage
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Copy the backend from the previous stage
COPY --from=backend-build /app/backend /app/backend

# Expose the Nginx port
EXPOSE 80



# Start Nginx and the backend server
CMD ["bash", "-c", "nginx -g 'daemon off;' & node /app/backend/server.js"]