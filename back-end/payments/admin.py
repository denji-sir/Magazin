from django.contrib import admin

from .models import PaymentSimulation


@admin.register(PaymentSimulation)
class PaymentSimulationAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "status", "amount", "masked_card", "trace_id", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("order__number", "masked_card", "trace_id")
