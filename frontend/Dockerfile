# Etapa 1: Construir el frontend
FROM node:18 AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Construye el frontend
RUN npm run build

# Etapa 2: Servir el frontend con Nginx
FROM nginx:stable-alpine

# Copia los archivos compilados del frontend al contenedor Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia el archivo de configuración de Nginx (asegúrate de que `nginx.conf` esté actualizado)
COPY nginx.conf /etc/nginx/nginx.conf

# Expone el puerto 80
EXPOSE 80

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]