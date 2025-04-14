# Etapa 1: build del frontend
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: contenedor Nginx
FROM nginx:alpine

# Copiar archivos compilados al root web de nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar archivo de configuración custom de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
