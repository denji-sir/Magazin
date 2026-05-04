from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AdminOrderCancelAPIView,
    AdminOrderPaymentStatusAPIView,
    AdminOrderStatusAPIView,
    AdminOrderViewSet,
    AdminStatsAPIView,
    CheckoutAPIView,
    MyOrderViewSet,
    OrdersHealthView,
)

my_router = DefaultRouter()
my_router.register("my", MyOrderViewSet, basename="orders-my")

admin_router = DefaultRouter()
admin_router.register("admin", AdminOrderViewSet, basename="orders-admin")

urlpatterns = [
    path("health/", OrdersHealthView.as_view(), name="orders-health"),
    path("checkout/", CheckoutAPIView.as_view(), name="checkout"),
    path("", include(my_router.urls)),
    path("", include(admin_router.urls)),
    path("admin/<int:pk>/status/", AdminOrderStatusAPIView.as_view(), name="admin-order-status"),
    path("admin/<int:pk>/payment-status/", AdminOrderPaymentStatusAPIView.as_view(), name="admin-order-payment-status"),
    path("admin/<int:pk>/cancel/", AdminOrderCancelAPIView.as_view(), name="admin-order-cancel"),
    path("admin/stats/", AdminStatsAPIView.as_view(), name="admin-stats"),
]
