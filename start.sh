#!/bin/sh

# Start Nginx
nginx -g 'daemon off;' &

# Start the Node.js server
node /app/backend/server.js  # Update with your correct server file name
