from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('backend.apps.google_auth.urls')),  # Rutas de autenticación con Google
]