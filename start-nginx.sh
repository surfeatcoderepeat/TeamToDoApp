#!/bin/sh

# Verificar que la variable esté definida
if [ -z "$VITE_BACKEND_URL" ]; then
  echo "ERROR: La variable VITE_BACKEND_URL no está definida."
  exit 1
fi

# Reemplazar la variable en el archivo de configuración
echo "Configurando Nginx con VITE_BACKEND_URL=$VITE_BACKEND_URL"
envsubst '${VITE_BACKEND_URL}' < /etc/nginx/nginx.template.conf > /etc/nginx/nginx.conf

# Iniciar Nginx
nginx -g "daemon off;"