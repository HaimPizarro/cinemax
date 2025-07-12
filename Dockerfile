# Stage 1: Build the Angular app
FROM node:18-alpine AS builder

WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala dependencias
RUN npm ci

# Copia el resto del código y construye
COPY . .
RUN npm run build -- --prod

# Stage 2: Serve with nginx
FROM nginx:stable-alpine

# Borra la configuración default de nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia tu configuración personalizada
COPY nginx.conf /etc/nginx/conf.d

# Copia los archivos compilados desde el builder
COPY --from=builder /app/dist/<tu-app-name> /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
