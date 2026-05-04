from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from cart.models import CartItem
from catalog.models import Category, Product
from orders.models import Order, OrderItem, PaymentStatus
from pickup_points.models import PickupPoint

User = get_user_model()


class PaymentSimulationApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="buyer2@example.com", password="123456")
        self.other = User.objects.create_user(email="other@example.com", password="123456")
        cat = Category.objects.create(name="Earrings", slug="earrings")
        self.product = Product.objects.create(category=cat, name="Earring", price=Decimal("250.00"), stock_quantity=10)
        pvz = PickupPoint.objects.create(name="PVZ", city="Moscow", address="Center", is_active=True)
        self.order = Order.objects.create(
            user=self.user,
            first_name="A",
            last_name="B",
            email="buyer2@example.com",
            phone="+79990001123",
            city="Moscow",
            pickup_point=pvz,
            total=Decimal("500.00"),
        )
        OrderItem.objects.create(
            order=self.order,
            product=self.product,
            product_name=self.product.name,
            product_image=self.product.image_url,
            unit_price=self.product.price,
            quantity=2,
            line_total=Decimal("500.00"),
        )

    def test_success_payment_updates_statuses(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.post(
            "/api/payments/simulate/",
            {
                "order_id": self.order.id,
                "card_number": "4111111111111111",
                "expiry": "12/30",
                "cvv": "123",
                "holder": "IVAN IVANOV",
                "outcome": "success",
            },
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["order"]["payment_status"], PaymentStatus.PAID)

    def test_cannot_pay_other_user_order(self):
        self.client.force_authenticate(user=self.other)
        resp = self.client.post(
            "/api/payments/simulate/",
            {
                "order_id": self.order.id,
                "card_number": "4111111111111111",
                "expiry": "12/30",
                "cvv": "123",
                "holder": "OTHER USER",
            },
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)
