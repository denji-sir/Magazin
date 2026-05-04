from django.urls import path

from .views import (
    CartClearAPIView,
    CartHealthView,
    CartItemCreateAPIView,
    CartItemDetailAPIView,
    CartView,
)

urlpatterns = [
    path("health/", CartHealthView.as_view(), name="cart-health"),
    path("", CartView.as_view(), name="cart-detail"),
    path("items/", CartItemCreateAPIView.as_view(), name="cart-item-create"),
    path("items/<int:pk>/", CartItemDetailAPIView.as_view(), name="cart-item-detail"),
    path("clear/", CartClearAPIView.as_view(), name="cart-clear"),
]
