# Etapa 1: Construcción del frontend
FROM --platform=linux/amd64 node:18-alpine AS build
WORKDIR /app

# Define los argumentos para las variables de entorno
ARG VITE_BACKEND_URL
ARG VITE_GOOGLE_CLIENT_ID

# Configura las variables de entorno para el build
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

COPY frontend ./
RUN npm run build

# Etapa 2: Servir los archivos estáticos con nginx
FROM --platform=linux/amd64 nginx:alpine
# Copiar la plantilla de nginx y el script
COPY nginx.template.conf /etc/nginx/nginx.template.conf
COPY start-nginx.sh /usr/local/bin/start-nginx.sh
COPY --from=build /app/dist /usr/share/nginx/html

# Dar permisos al script
RUN chmod +x /usr/local/bin/start-nginx.sh
EXPOSE 80
CMD ["start-nginx.sh"]