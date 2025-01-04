# Step 1: Build React App
FROM node:16 AS build

WORKDIR /app

# Install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy source files
COPY . .

# Build React app
RUN npm run build

# Step 2: Setup Node.js Backend
FROM node:16 AS backend

WORKDIR /app

# Install backend dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy React build output
COPY --from=build /app/build /app/build

# Copy backend files
COPY . .

# Expose port (3000 is common for React and Node apps)
EXPOSE 3000

# Start the Node.js backend
CMD ["node", "bin/www.js"]
