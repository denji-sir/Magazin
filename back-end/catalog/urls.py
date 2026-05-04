from django.urls import include, path
from rest_framework.response import Response
from rest_framework.routers import DefaultRouter
from rest_framework.views import APIView

from .views import AdminCategoryViewSet, AdminProductViewSet, CategoryPublicViewSet, ProductViewSet


class CatalogHealthView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({"domain": "catalog", "status": "ok"})


public_router = DefaultRouter()
public_router.register("products", ProductViewSet, basename="products")
public_router.register("categories", CategoryPublicViewSet, basename="categories")

admin_router = DefaultRouter()
admin_router.register("products", AdminProductViewSet, basename="admin-products")
admin_router.register("categories", AdminCategoryViewSet, basename="admin-categories")

urlpatterns = [
    path("health/", CatalogHealthView.as_view(), name="catalog-health"),
    path("", include(public_router.urls)),
    path("admin/", include(admin_router.urls)),
]
