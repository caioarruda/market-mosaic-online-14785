# FROM node:22-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN npm install -f
# COPY . .
# EXPOSE 3000
# CMD ["npm", "run", "dev"]
# STAGE 1 — BUILD
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# STAGE 2 — SERVE (NGINX)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]