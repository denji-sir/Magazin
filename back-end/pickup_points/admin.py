from django.contrib import admin

from .models import PickupPoint


@admin.register(PickupPoint)
class PickupPointAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "city", "address", "is_active")
    list_filter = ("is_active", "city")
    search_fields = ("name", "city", "address")
