from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models

from catalog.models import Product


class CartItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cart_items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="cart_items")
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "product")
        ordering = ["-updated_at"]

    def clean(self):
        if self.quantity < 1:
            raise ValidationError("Количество должно быть больше нуля")
        if self.product.stock_quantity < self.quantity:
            raise ValidationError("Недостаточно товара на складе")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user_id} - {self.product_id} x {self.quantity}"
