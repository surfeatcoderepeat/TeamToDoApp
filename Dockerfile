# Usa la imagen base de NGINX
FROM nginx:latest

# Copia la configuración personalizada de NGINX
COPY nginx.conf /etc/nginx/nginx.conf

# Copia los archivos compilados del frontend al contenedor
COPY ./frontend/dist /usr/share/nginx/html

EXPOSE 80