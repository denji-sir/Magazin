from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .jwt import BlockAwareTokenObtainPairSerializer, BlockAwareTokenRefreshSerializer


class BlockAwareTokenObtainPairView(TokenObtainPairView):
    serializer_class = BlockAwareTokenObtainPairSerializer


class BlockAwareTokenRefreshView(TokenRefreshView):
    serializer_class = BlockAwareTokenRefreshSerializer
