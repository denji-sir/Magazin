from rest_framework import serializers

from .models import CartItem


class CartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source="product.id", read_only=True)
    name = serializers.CharField(source="product.name", read_only=True)
    price = serializers.DecimalField(source="product.price", read_only=True, max_digits=10, decimal_places=2)
    image = serializers.CharField(source="product.image_url", read_only=True)
    inStock = serializers.BooleanField(source="product.in_stock", read_only=True)

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product_id",
            "name",
            "price",
            "image",
            "inStock",
            "quantity",
            "created_at",
            "updated_at",
        ]


class CartItemCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)


class CartItemUpdateSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)
