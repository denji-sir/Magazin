from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from cart.models import CartItem
from catalog.models import Category, Product
from pickup_points.models import PickupPoint

User = get_user_model()


class CheckoutApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="buyer@example.com", password="123456")
        cat = Category.objects.create(name="Rings", slug="rings")
        self.product = Product.objects.create(category=cat, name="Ring", price=Decimal("300.00"), stock_quantity=8)
        self.pvz = PickupPoint.objects.create(name="PVZ-1", city="Moscow", address="Lenina 1", is_active=True)
        CartItem.objects.create(user=self.user, product=self.product, quantity=2)
        self.client.force_authenticate(user=self.user)

    def test_checkout_creates_order(self):
        payload = {
            "firstName": "Ivan",
            "lastName": "Ivanov",
            "email": "buyer@example.com",
            "phone": "+79990001122",
            "city": "Moscow",
            "pvzId": self.pvz.id,
            "comment": "test",
        }
        resp = self.client.post("/api/orders/checkout/", payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["status"], "pending_payment")
        self.assertEqual(len(resp.data["items"]), 1)

        my_orders = self.client.get("/api/orders/my/")
        self.assertEqual(my_orders.status_code, status.HTTP_200_OK)
        self.assertEqual(len(my_orders.data["results"]), 1)
