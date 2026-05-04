from rest_framework import serializers

from .models import PaymentSimulation


class PaymentSimulationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentSimulation
        fields = [
            "id",
            "order",
            "status",
            "amount",
            "masked_card",
            "card_brand",
            "holder_name",
            "trace_id",
            "error_message",
            "created_at",
            "processed_at",
        ]


class PaymentSimulationRequestSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    card_number = serializers.CharField(min_length=12, max_length=32)
    expiry = serializers.CharField(min_length=4, max_length=5)
    cvv = serializers.CharField(min_length=3, max_length=4)
    holder = serializers.CharField(min_length=3)
    outcome = serializers.ChoiceField(choices=["success", "error", "cancel"], required=False)
