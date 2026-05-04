from rest_framework import serializers

from .models import PickupPoint


class PickupPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupPoint
        fields = [
            "id",
            "name",
            "city",
            "address",
            "schedule",
            "is_active",
            "eta_text",
            "created_at",
            "updated_at",
        ]
