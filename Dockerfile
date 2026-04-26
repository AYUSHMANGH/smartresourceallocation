# Use the official Node.js image (full version for build tools).
FROM node:20

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Build the static site and show logs.
RUN npm run build && ls -la dist/

# Expose the port the app runs on.
EXPOSE 8080

# Run the web service on container startup.
CMD [ "node", "server.js" ]
