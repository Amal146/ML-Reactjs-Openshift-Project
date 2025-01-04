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

# Stage 2: Serve the React app using Nginx
FROM nginx:alpine

# Copy the build output to the Nginx HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for the frontend
EXPOSE 80

# Start Nginx to serve the React app
CMD ["nginx", "-g", "daemon off;"]
