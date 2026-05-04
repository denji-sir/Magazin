from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.models import Product
from users.permissions import IsNotBlocked

from .models import CartItem
from .serializers import CartItemCreateSerializer, CartItemSerializer, CartItemUpdateSerializer


class CartHealthView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({"domain": "cart", "status": "ok"})


class CartView(APIView):
    permission_classes = [IsAuthenticated, IsNotBlocked]

    def get(self, request):
        items = CartItem.objects.filter(user=request.user).select_related("product")
        serializer = CartItemSerializer(items, many=True)
        total = sum(item.product.price * item.quantity for item in items)
        return Response(
            {
                "items": serializer.data,
                "total": total,
                "item_count": sum(item.quantity for item in items),
            }
        )


class CartItemCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsNotBlocked]

    @transaction.atomic
    def post(self, request):
        serializer = CartItemCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = get_object_or_404(Product, pk=serializer.validated_data["product_id"])
        quantity = serializer.validated_data["quantity"]

        if product.stock_quantity < quantity:
            return Response({"detail": "Недостаточно товара на складе"}, status=status.HTTP_400_BAD_REQUEST)

        item, created = CartItem.objects.get_or_create(
            user=request.user,
            product=product,
            defaults={"quantity": quantity},
        )

        if not created:
            new_qty = item.quantity + quantity
            if product.stock_quantity < new_qty:
                return Response({"detail": "Недостаточно товара на складе"}, status=status.HTTP_400_BAD_REQUEST)
            item.quantity = new_qty
            item.save()

        return Response(CartItemSerializer(item).data, status=status.HTTP_201_CREATED)


class CartItemDetailAPIView(APIView):
    permission_classes = [IsAuthenticated, IsNotBlocked]

    def patch(self, request, pk):
        item = get_object_or_404(CartItem.objects.select_related("product"), pk=pk, user=request.user)
        serializer = CartItemUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        quantity = serializer.validated_data["quantity"]

        if item.product.stock_quantity < quantity:
            return Response({"detail": "Недостаточно товара на складе"}, status=status.HTTP_400_BAD_REQUEST)

        item.quantity = quantity
        item.save()
        return Response(CartItemSerializer(item).data)

    def delete(self, request, pk):
        item = get_object_or_404(CartItem, pk=pk, user=request.user)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CartClearAPIView(APIView):
    permission_classes = [IsAuthenticated, IsNotBlocked]

    def delete(self, request):
        CartItem.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
