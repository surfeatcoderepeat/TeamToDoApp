# Usa Python 3.11 como base
FROM python:3.11-slim

# Establece el directorio de trabajo
WORKDIR /app

# Copia y instala dependencias
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copia el código del backend
COPY . .

# Ejecuta tareas necesarias antes de iniciar la aplicación
RUN python manage.py collectstatic --noinput && \
    python manage.py migrate

# Exponer el puerto dinámico
EXPOSE 8000

# Comando para ejecutar la aplicación
CMD ["sh", "-c", "python manage.py runserver 0.0.0.0:8000"]