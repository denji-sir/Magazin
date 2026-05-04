from django.db import transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cart.models import CartItem
from catalog.models import Product
from orders.models import Order, OrderStatus, PaymentStatus
from users.permissions import IsNotBlocked

from .models import PaymentSimulation
from .serializers import PaymentSimulationRequestSerializer, PaymentSimulationSerializer


def _mask_card(card_number: str) -> str:
    normalized = "".join(ch for ch in card_number if ch.isdigit())
    if len(normalized) < 4:
        return "****"
    return f"**** **** **** {normalized[-4:]}"


def _card_brand(card_number: str) -> str:
    normalized = "".join(ch for ch in card_number if ch.isdigit())
    if normalized.startswith("4"):
        return "VISA"
    if normalized.startswith("5"):
        return "MASTERCARD"
    if normalized.startswith("2"):
        return "MIR"
    return "UNKNOWN"


class PaymentsHealthView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({"domain": "payments", "status": "ok"})


class PaymentSimulationAPIView(APIView):
    permission_classes = [IsAuthenticated, IsNotBlocked]

    @transaction.atomic
    def post(self, request):
        serializer = PaymentSimulationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        order = Order.objects.select_for_update().prefetch_related("items").filter(pk=data["order_id"]).first()
        if not order:
            return Response({"detail": "Заказ не найден"}, status=status.HTTP_404_NOT_FOUND)

        is_owner = order.user_id == request.user.id
        is_admin = getattr(request.user, "role", None) == "admin"
        if not is_owner and not is_admin:
            return Response({"detail": "Нет доступа к заказу"}, status=status.HTTP_403_FORBIDDEN)

        if order.status == OrderStatus.CANCELED:
            return Response({"detail": "Нельзя оплатить отмененный заказ"}, status=status.HTTP_400_BAD_REQUEST)
        if order.payment_status == PaymentStatus.PAID:
            return Response({"detail": "Заказ уже оплачен"}, status=status.HTTP_409_CONFLICT)

        attempt = PaymentSimulation.objects.create(
            order=order,
            status=PaymentStatus.PROCESSING,
            amount=order.total,
            masked_card=_mask_card(data["card_number"]),
            card_brand=_card_brand(data["card_number"]),
            holder_name=data["holder"],
        )

        outcome = data.get("outcome", "success")

        if outcome == "success":
            product_ids = [i.product_id for i in order.items.all() if i.product_id]
            locked_products = {p.id: p for p in Product.objects.select_for_update().filter(id__in=product_ids)}
            for item in order.items.select_related("product"):
                product = locked_products.get(item.product_id)
                if product is None or product.stock_quantity < item.quantity:
                    return Response({"detail": f"Недостаточно товара на складе: {item.product_name}"}, status=status.HTTP_409_CONFLICT)

            attempt.status = PaymentStatus.PAID
            order.payment_status = PaymentStatus.PAID
            if order.status in {OrderStatus.CREATED, OrderStatus.PENDING_PAYMENT}:
                order.status = OrderStatus.PROCESSING

            for item in order.items.select_related("product"):
                product = locked_products.get(item.product_id)
                if product:
                    product.stock_quantity -= item.quantity
                    product.save(update_fields=["stock_quantity", "updated_at"])

            CartItem.objects.filter(user=order.user).delete()

        elif outcome == "cancel":
            attempt.status = PaymentStatus.CANCELED
            order.payment_status = PaymentStatus.CANCELED
            if order.status == OrderStatus.CREATED:
                order.status = OrderStatus.PENDING_PAYMENT
        else:
            attempt.status = PaymentStatus.ERROR
            attempt.error_message = "Имитация ошибки оплаты"
            order.payment_status = PaymentStatus.ERROR
            if order.status == OrderStatus.CREATED:
                order.status = OrderStatus.PENDING_PAYMENT

        attempt.processed_at = timezone.now()
        attempt.save(update_fields=["status", "error_message", "processed_at"])
        order.save(update_fields=["payment_status", "status", "updated_at"])

        return Response(
            {
                "payment": PaymentSimulationSerializer(attempt).data,
                "order": {
                    "id": order.id,
                    "number": order.number,
                    "status": order.status,
                    "payment_status": order.payment_status,
                    "total": order.total,
                },
            }
        )
