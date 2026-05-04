from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ActivePickupPointViewSet, AdminPickupPointViewSet, PickupPointsHealthView

active_router = DefaultRouter()
active_router.register("active", ActivePickupPointViewSet, basename="pickup-active")

admin_router = DefaultRouter()
admin_router.register("admin", AdminPickupPointViewSet, basename="pickup-admin")

urlpatterns = [
    path("health/", PickupPointsHealthView.as_view(), name="pickup-points-health"),
    path("", include(active_router.urls)),
    path("", include(admin_router.urls)),
]
