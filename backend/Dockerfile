# Usa Python como base
FROM python:3.10-slim

# Establece el directorio de trabajo
WORKDIR /app

# Copia y instala dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código del backend
COPY . .

# Exponer el puerto 8000
EXPOSE 8000