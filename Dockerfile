# Stage 1: Frontend Build
FROM node:18 AS frontend-build

WORKDIR /usr/src/app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend ./

RUN npm run build

# Stage 2: Backend Build
FROM node:18 AS backend-build

WORKDIR /usr/src/app/backend

COPY backend/package*.json ./

RUN npm install

COPY backend ./

# Copy the frontend build from the frontend-build stage to the backend's public folder
COPY --from=frontend-build /usr/src/app/frontend/dist ./public

# Expose the backend port
EXPOSE 5000

# Command to run the backend server
CMD ["node", "server.js"]
