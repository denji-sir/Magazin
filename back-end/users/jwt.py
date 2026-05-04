from django.contrib.auth import get_user_model
from rest_framework import exceptions
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class BlockAwareTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.EMAIL_FIELD

    @classmethod
    def get_token(cls, user):
        if getattr(user, "is_blocked", False):
            raise exceptions.PermissionDenied("Пользователь заблокирован")
        return super().get_token(user)

    def validate(self, attrs):
        data = super().validate(attrs)
        if getattr(self.user, "is_blocked", False):
            raise exceptions.PermissionDenied("Пользователь заблокирован")
        return data


class BlockAwareTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        refresh_token = RefreshToken(attrs["refresh"])
        user_id = refresh_token.payload.get("user_id")
        user = User.objects.filter(pk=user_id).first()
        if user is None:
            raise exceptions.AuthenticationFailed("Пользователь не найден")
        if getattr(user, "is_blocked", False):
            try:
                refresh_token.blacklist()
            except Exception:
                pass
            raise exceptions.PermissionDenied("Пользователь заблокирован")
        return super().validate(attrs)
