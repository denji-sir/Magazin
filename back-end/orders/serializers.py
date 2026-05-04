from decimal import Decimal

from rest_framework import serializers

from pickup_points.serializers import PickupPointSerializer

from .models import Order, OrderItem, OrderStatus, PaymentStatus


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_image",
            "unit_price",
            "quantity",
            "line_total",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    pickup_point_data = PickupPointSerializer(source="pickup_point", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "number",
            "first_name",
            "last_name",
            "email",
            "phone",
            "city",
            "comment",
            "pickup_point",
            "pickup_point_data",
            "pickup_code",
            "total",
            "status",
            "payment_status",
            "created_at",
            "updated_at",
            "items",
        ]


class CheckoutSerializer(serializers.Serializer):
    firstName = serializers.CharField(min_length=2)
    lastName = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField()
    phone = serializers.CharField(min_length=10)
    city = serializers.CharField(required=False, allow_blank=True)
    pvzId = serializers.IntegerField()
    comment = serializers.CharField(required=False, allow_blank=True)


class AdminStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=OrderStatus.choices)


class AdminPaymentStatusUpdateSerializer(serializers.Serializer):
    payment_status = serializers.ChoiceField(choices=PaymentStatus.choices)


class AdminCancelSerializer(serializers.Serializer):
    reason = serializers.CharField(required=False, allow_blank=True)


class CheckoutResponseSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ["id", "number", "total", "status", "payment_status", "pickup_point", "created_at", "items"]
