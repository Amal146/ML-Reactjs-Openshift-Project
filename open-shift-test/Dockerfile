# # Stage 1: Build the React app
# FROM node:14 as build

# WORKDIR /app

# # Copy package.json and package-lock.json (if available)
# COPY package.json package-lock.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code
# COPY . .

# # Build the React app
# RUN npm run build

# # Stage 2: Serve the React app using Nginx
# FROM nginx:alpine

# # Copy the build output to the Nginx HTML directory
# COPY --from=build /app/build /usr/share/nginx/html

# # Expose port 80
# EXPOSE 80

# # Start Nginx
# CMD ["nginx", "-g", "daemon off;"]


# Stage 1: Build the React app
FROM node:14 as build

WORKDIR /app

# Copy package.json and package-lock.json for both backend and frontend
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the React source code
COPY src/ /app/src
COPY public/ /app/public

# Build the React app
RUN npm run build


# Expose ports for both frontend (3000) and backend (8080)
EXPOSE 3000
EXPOSE 8080


CMD ["sh", "-c", "concurrently \"react-scripts start\" \"node backend/bin/www.js\""]

