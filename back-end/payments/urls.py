from django.urls import path

from .views import PaymentSimulationAPIView, PaymentsHealthView

urlpatterns = [
    path("health/", PaymentsHealthView.as_view(), name="payments-health"),
    path("simulate/", PaymentSimulationAPIView.as_view(), name="payments-simulate"),
]
