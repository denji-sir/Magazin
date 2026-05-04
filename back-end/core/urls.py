from django.contrib import admin
from django.urls import include, path
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.views import AdminStatsAPIView
from users.jwt_views import BlockAwareTokenObtainPairView, BlockAwareTokenRefreshView
from users.views import LoginAPIView, LogoutAPIView, MeAPIView, RefreshAPIView, RegisterAPIView


class HealthCheckView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({"status": "ok", "service": "magazin-api"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", HealthCheckView.as_view(), name="api-health"),
    path("api/auth/login/", LoginAPIView.as_view(), name="auth-login"),
    path("api/auth/register/", RegisterAPIView.as_view(), name="auth-register"),
    path("api/auth/me/", MeAPIView.as_view(), name="auth-me"),
    path("api/auth/refresh/", RefreshAPIView.as_view(), name="auth-refresh"),
    path("api/auth/logout/", LogoutAPIView.as_view(), name="auth-logout"),
    path("api/auth/token/", BlockAwareTokenObtainPairView.as_view(), name="token-obtain"),
    path("api/auth/token/refresh/", BlockAwareTokenRefreshView.as_view(), name="token-refresh"),
    path("api/admin/stats/", AdminStatsAPIView.as_view(), name="admin-stats-global"),
    path("api/users/", include("users.urls")),
    path("api/catalog/", include("catalog.urls")),
    path("api/cart/", include("cart.urls")),
    path("api/orders/", include("orders.urls")),
    path("api/payments/", include("payments.urls")),
    path("api/pickup-points/", include("pickup_points.urls")),
]
