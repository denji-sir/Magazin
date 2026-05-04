import uuid
from decimal import Decimal

from django.conf import settings
from django.db import models

from catalog.models import Product
from pickup_points.models import PickupPoint


class OrderStatus(models.TextChoices):
    CREATED = "created", "Заказ создан"
    PENDING_PAYMENT = "pending_payment", "Ожидает оплаты"
    PAID = "paid", "Оплачен"
    PROCESSING = "processing", "Принят в обработку"
    ASSEMBLING = "assembling", "Собирается"
    SENT_TO_PICKUP = "sent_to_pickup", "Передан в ПВЗ"
    READY_FOR_PICKUP = "ready_for_pickup", "Готов к выдаче"
    RECEIVED = "received", "Получен"
    CANCELED = "canceled", "Отменен"


class PaymentStatus(models.TextChoices):
    PENDING_PAYMENT = "pending_payment", "Ожидает оплаты"
    PROCESSING = "processing", "Оплата обрабатывается"
    PAID = "paid", "Оплачено"
    ERROR = "error", "Ошибка оплаты"
    CANCELED = "canceled", "Оплата отменена"


class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
    number = models.CharField(max_length=24, unique=True, db_index=True, blank=True)

    first_name = models.CharField(max_length=120)
    last_name = models.CharField(max_length=120, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=32)
    city = models.CharField(max_length=120, blank=True)
    comment = models.TextField(blank=True)

    pickup_point = models.ForeignKey(PickupPoint, on_delete=models.PROTECT, related_name="orders")
    pickup_code = models.CharField(max_length=16, blank=True)

    total = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    status = models.CharField(max_length=32, choices=OrderStatus.choices, default=OrderStatus.CREATED)
    payment_status = models.CharField(max_length=32, choices=PaymentStatus.choices, default=PaymentStatus.PENDING_PAYMENT)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.number:
            self.number = f"ORD-{uuid.uuid4().hex[:10].upper()}"
        if not self.pickup_code:
            self.pickup_code = uuid.uuid4().hex[:6].upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.number


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, null=True, blank=True, on_delete=models.SET_NULL, related_name="order_items")

    product_name = models.CharField(max_length=255)
    product_image = models.URLField(blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    line_total = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.order.number} - {self.product_name}"
