# Build Stage for the frontend
FROM node:latest AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend ./
RUN npm run build  # This will generate the static files (e.g., in /app/frontend/build)

# Backend Stage
FROM node:latest AS backend-build
WORKDIR /app/backend
COPY backend/package.json ./
RUN npm install
COPY backend ./

# Copy the frontend static files to the backend
COPY --from=frontend-build /app/frontend/dist /app/backend/public

# Expose the backend port
EXPOSE 5000

# Command to run the backend (which also serves frontend)
CMD ["node", "server.js"]
