# Stage 1: Build React App
FROM node:16 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build

# Stage 2: Serve React App and Run Node.js Server
FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./
COPY --from=build /app/build ./build

EXPOSE 3000

CMD ["concurrently", "set PORT=3000 && react-scripts start", "node bin/www.js"]