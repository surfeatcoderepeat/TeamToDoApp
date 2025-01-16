# Usa Python 3.11 como base
FROM --platform=linux/amd64 python:3.11-slim

# Establece el directorio de trabajo
WORKDIR /app

ARG VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

# Copia y instala dependencias
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copia el código fuente del backend
COPY . .

# Expone el puerto dinámico para Railway
EXPOSE 8000

# Comando para producción: Ejecuta Gunicorn
CMD ["gunicorn", "--bind", "[::]:8000", "wsgi:application"]