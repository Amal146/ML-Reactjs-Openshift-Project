# Step 1: Build the Flask backend
FROM python:3.11 as backend

# Setup working directory and install dependencies
WORKDIR /backend
COPY wheat-disease-detection/requirements.txt ./
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    libffi-dev \
    libssl-dev

RUN pip install --no-cache-dir -r requirements.txt

# Copy Flask app code
COPY wheat-disease-detection /backend

# Step 2: Build the React frontend
FROM node:14 as frontend-build
WORKDIR /frontend

# Install dependencies and build React app
COPY open-shift-test/package.json open-shift-test/package-lock.json ./
RUN npm install

COPY open-shift-test ./
RUN npm run build

# Step 3: Combine and serve with Nginx
FROM nginx:alpine

# Copy frontend build to Nginx
COPY --from=frontend-build /frontend/build /usr/share/nginx/html

# Copy Flask backend code to /backend
COPY --from=backend /backend /backend

# Add custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
