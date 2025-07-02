# Step 1: Build the app
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Start app with production server
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app ./
ENV NODE_ENV=production

EXPOSE 8080
CMD ["npm", "start"]
