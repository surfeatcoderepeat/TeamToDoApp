from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.permissions import IsAuthenticated
import os


class GoogleLoginView(APIView):
    """
    Maneja la autenticación de usuarios usando un token de Google.
    Verifica el token de Google, crea o recupera un usuario en el sistema,
    y genera JWT para que el frontend los use.
    """
    permission_classes = [AllowAny] 

    def post(self, request, *args, **kwargs):
        # Obtener el token enviado por el frontend
        token = request.data.get("token")
        if not token:
            return Response(
                {"error": "Token no proporcionado"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Verificar el token usando las librerías de Google
            idinfo = id_token.verify_oauth2_token(
                token, 
                google_requests.Request(), 
                os.getenv('GOOGLE_CLIENT_ID')
            )
        except ValueError:
            # El token no es válido
            return Response(
                {"error": "Token inválido"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Extraer información del usuario desde el token
        email = idinfo.get("email")
        name = idinfo.get("name")

        # Crear o recuperar un usuario en el sistema
        user, created = User.objects.get_or_create(username=email, defaults={"first_name": name})

        # Generar tokens JWT para el usuario
        refresh = RefreshToken.for_user(user)
        tokens = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        # Responder al frontend con los tokens JWT
        return Response(tokens, status=status.HTTP_200_OK)



class ValidateTokenView(APIView):
    """
    Verifica si el token de acceso es válido.
    """
    permission_classes = [AllowAny]  # Solo usuarios autenticados pueden acceder a esta vista

    def post(self, request, *args, **kwargs):
        # Obtener el token del encabezado Authorization
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response(
                {"error": "Token no proporcionado"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        token = auth_header.split(' ')[1]  # Extraer el token después de "Bearer"

        try:
            # Decodificar y validar el token
            AccessToken(token)
            return Response({"valid": True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"valid": False, "error": str(e)},
                status=status.HTTP_401_UNAUTHORIZED,
            )