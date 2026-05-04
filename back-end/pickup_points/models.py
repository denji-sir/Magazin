from django.db import models


class PickupPoint(models.Model):
    name = models.CharField(max_length=150)
    city = models.CharField(max_length=120)
    address = models.CharField(max_length=255)
    schedule = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    eta_text = models.CharField(max_length=120, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["city", "name"]

    def __str__(self):
        return f"{self.name} ({self.city})"
