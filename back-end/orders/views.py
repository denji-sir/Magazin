from decimal import Decimal

from django.db import transaction
from django.db.models import Count, Q, Sum
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework import mixins, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.models import Product
from cart.models import CartItem
from pickup_points.models import PickupPoint
from users.permissions import IsAdminRole, IsNotBlocked

from .models import Order, OrderItem, OrderStatus, PaymentStatus
from .serializers import (
    AdminCancelSerializer,
    AdminPaymentStatusUpdateSerializer,
    AdminStatusUpdateSerializer,
    CheckoutResponseSerializer,
    CheckoutSerializer,
    OrderSerializer,
)

User = get_user_model()


class OrdersHealthView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({"domain": "orders", "status": "ok"})


class CheckoutAPIView(APIView):
    permission_classes = [IsAuthenticated, IsNotBlocked]

    @transaction.atomic
    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        cart_items = list(
            CartItem.objects.select_related("product")
            .select_for_update(of=("self",))
            .filter(user=request.user)
        )
        if not cart_items:
            return Response({"detail": "Корзина пуста"}, status=status.HTTP_400_BAD_REQUEST)

        pickup_point = get_object_or_404(PickupPoint, pk=data["pvzId"], is_active=True)

        product_ids = [i.product_id for i in cart_items]
        locked_products = {
            p.id: p
            for p in Product.objects.select_for_update().filter(id__in=product_ids)
        }

        for cart_item in cart_items:
            product = locked_products.get(cart_item.product_id)
            if product is None or product.stock_quantity < cart_item.quantity:
                raise ValidationError(f"Недостаточно товара на складе: {cart_item.product.name}")

        order = Order.objects.create(
            user=request.user,
            first_name=data["firstName"],
            last_name=data.get("lastName", ""),
            email=data["email"],
            phone=data["phone"],
            city=data.get("city", ""),
            comment=data.get("comment", ""),
            pickup_point=pickup_point,
            status=OrderStatus.CREATED,
            payment_status=PaymentStatus.PENDING_PAYMENT,
        )

        total = Decimal("0.00")
        order_items = []

        for cart_item in cart_items:
            product = locked_products[cart_item.product_id]

            line_total = product.price * cart_item.quantity
            total += line_total
            order_items.append(
                OrderItem(
                    order=order,
                    product=product,
                    product_name=product.name,
                    product_image=product.image_url,
                    unit_price=product.price,
                    quantity=cart_item.quantity,
                    line_total=line_total,
                )
            )

        OrderItem.objects.bulk_create(order_items)
        order.total = total
        order.status = OrderStatus.PENDING_PAYMENT
        order.save(update_fields=["total", "status", "updated_at"])

        return Response(CheckoutResponseSerializer(order).data, status=status.HTTP_201_CREATED)


class MyOrderViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsNotBlocked]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).select_related("pickup_point").prefetch_related("items")


class AdminOrderViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get_queryset(self):
        queryset = Order.objects.select_related("pickup_point", "user").prefetch_related("items")
        status_q = self.request.query_params.get("status")
        payment_q = self.request.query_params.get("payment_status")
        if status_q:
            queryset = queryset.filter(status=status_q)
        if payment_q:
            queryset = queryset.filter(payment_status=payment_q)
        return queryset


class AdminOrderStatusAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def patch(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        serializer = AdminStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order.status = serializer.validated_data["status"]
        order.save(update_fields=["status", "updated_at"])
        return Response(OrderSerializer(order).data)


class AdminOrderPaymentStatusAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def patch(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        serializer = AdminPaymentStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order.payment_status = serializer.validated_data["payment_status"]

        if order.payment_status == PaymentStatus.PAID and order.status == OrderStatus.PENDING_PAYMENT:
            order.status = OrderStatus.PROCESSING

        order.save(update_fields=["payment_status", "status", "updated_at"])
        return Response(OrderSerializer(order).data)


class AdminOrderCancelAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def post(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        serializer = AdminCancelSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        order.status = OrderStatus.CANCELED
        order.save(update_fields=["status", "updated_at"])
        return Response(OrderSerializer(order).data)


class AdminStatsAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        totals = Order.objects.aggregate(
            orders_total=Count("id"),
            paid_revenue=Sum("total", filter=Q(payment_status=PaymentStatus.PAID)),
            paid_orders=Count("id", filter=Q(payment_status=PaymentStatus.PAID)),
            processing_orders=Count("id", filter=Q(status=OrderStatus.PROCESSING)),
            ready_orders=Count("id", filter=Q(status=OrderStatus.READY_FOR_PICKUP)),
        )

        recent_orders = Order.objects.order_by("-created_at")[:10]
        return Response(
            {
                "total_products": Product.objects.count(),
                "total_users": User.objects.count(),
                "total_orders": totals["orders_total"] or 0,
                "paid_orders": totals["paid_orders"] or 0,
                "processing_orders": totals["processing_orders"] or 0,
                "ready_for_pickup_orders": totals["ready_orders"] or 0,
                "paid_revenue": totals["paid_revenue"] or Decimal("0.00"),
                "recent_orders": OrderSerializer(recent_orders, many=True).data,
            }
        )
