from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AdminUserViewSet, UsersHealthView

router = DefaultRouter()
router.register("admin", AdminUserViewSet, basename="admin-users")

urlpatterns = [
    path("health/", UsersHealthView.as_view(), name="users-health"),
    path("", include(router.urls)),
]
