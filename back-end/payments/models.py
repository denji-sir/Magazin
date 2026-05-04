import uuid

from django.db import models

from orders.models import Order, PaymentStatus


class PaymentSimulation(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="payment_attempts")
    status = models.CharField(max_length=32, choices=PaymentStatus.choices, default=PaymentStatus.PROCESSING)
    amount = models.DecimalField(max_digits=12, decimal_places=2)

    masked_card = models.CharField(max_length=32, blank=True)
    card_brand = models.CharField(max_length=32, blank=True)
    holder_name = models.CharField(max_length=120, blank=True)

    trace_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    error_message = models.CharField(max_length=255, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.order.number} [{self.status}]"
