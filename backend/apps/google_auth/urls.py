from django.urls import path
from .views import GoogleLoginView, ValidateTokenView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('google-login-success/', GoogleLoginView.as_view(), name='google_login_success'),
    path('validate-token/', ValidateTokenView.as_view(), name='validate-access-token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refreash'),
]