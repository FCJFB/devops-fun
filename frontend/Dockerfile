# ==========================================
# STAGE 1: Build the React App
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ==========================================
# STAGE 2: Serve with Nginx
# ==========================================
FROM nginx:alpine
# Copy the compiled React files from Stage 1 into the Nginx web folder
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy our traffic cop rulebook
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]