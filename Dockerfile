# Etapa 1: Construcción del frontend
FROM --platform=linux/amd64 node:18-alpine AS build
WORKDIR /app

# Define los argumentos para las variables de entorno
ARG VITE_BACKEND_URL
ARG VITE_GOOGLE_CLIENT_ID

# Configura las variables de entorno para el build
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

COPY frontend ./
RUN npm run build

# Etapa 2: Servir los archivos estáticos con nginx
FROM --platform=linux/amd64 nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]