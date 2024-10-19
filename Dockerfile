FROM node:18 AS frontend-build

WORKDIR /usr/src/app

COPY frontend/package*.json ./

RUN npm install

COPY frontend ./

RUN npm run build

FROM nginx:alpine

COPY --from=frontend-build /usr/src/app /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Base image for the backend
FROM node:latest AS backend-build

# Set the working directory for the backend
WORKDIR /usr/src/app

# Copy backend package.json and install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy the backend code
COPY backend ./

# Expose the backend port
EXPOSE 5000

# Command to run the backend server
CMD ["node", "server.js"]

# ---------------------------------------------------------------

