from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from cart.models import CartItem
from catalog.models import Category, Product
from pickup_points.models import PickupPoint

from .models import OrderStatus, PaymentStatus

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

    def test_checkout_contract_fields_for_frontend(self):
        payload = {
            "firstName": "Ivan",
            "lastName": "Ivanov",
            "email": "buyer@example.com",
            "phone": "+79990001122",
            "city": "Moscow",
            "pvzId": self.pvz.id,
            "comment": "contract",
        }
        resp = self.client.post("/api/orders/checkout/", payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        for key in ["id", "number", "total", "status", "payment_status", "pickup_point", "created_at", "items"]:
            self.assertIn(key, resp.data)
        self.assertEqual(resp.data["status"], OrderStatus.PENDING_PAYMENT)
        self.assertEqual(resp.data["payment_status"], PaymentStatus.PENDING_PAYMENT)
        self.assertEqual(len(resp.data["items"]), 1)

    def test_admin_order_status_payment_and_cancel(self):
        payload = {
            "firstName": "Ivan",
            "lastName": "Ivanov",
            "email": "buyer@example.com",
            "phone": "+79990001122",
            "city": "Moscow",
            "pvzId": self.pvz.id,
            "comment": "admin-flow",
        }
        checkout = self.client.post("/api/orders/checkout/", payload, format="json")
        order_id = checkout.data["id"]

        admin = User.objects.create_user(email="admin-orders@example.com", password="123456", role="admin", is_staff=True)
        self.client.force_authenticate(user=admin)

        status_resp = self.client.patch(
            f"/api/orders/admin/{order_id}/status/",
            {"status": OrderStatus.ASSEMBLING},
            format="json",
        )
        self.assertEqual(status_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(status_resp.data["status"], OrderStatus.ASSEMBLING)

        payment_resp = self.client.patch(
            f"/api/orders/admin/{order_id}/payment-status/",
            {"payment_status": PaymentStatus.PAID},
            format="json",
        )
        self.assertEqual(payment_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(payment_resp.data["payment_status"], PaymentStatus.PAID)

        cancel_resp = self.client.post(f"/api/orders/admin/{order_id}/cancel/", {"reason": "test"}, format="json")
        self.assertEqual(cancel_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(cancel_resp.data["status"], OrderStatus.CANCELED)


class FrontendBackendSmokeApiTests(APITestCase):
    def test_smoke_user_and_admin_critical_flow(self):
        admin = User.objects.create_user(email="admin-smoke@example.com", password="123456", role="admin", is_staff=True)

        self.client.force_authenticate(user=admin)
        category_resp = self.client.post(
            "/api/catalog/admin/categories/",
            {"name": "Bracelets", "slug": "bracelets"},
            format="json",
        )
        self.assertEqual(category_resp.status_code, status.HTTP_201_CREATED)

        product_resp = self.client.post(
            "/api/catalog/admin/products/",
            {
                "name": "Smoke Bracelet",
                "description": "smoke",
                "price": "999.00",
                "material": "silver",
                "size": "M",
                "stock_quantity": 6,
                "image_url": "https://example.com/img.jpg",
                "is_new": True,
                "is_popular": False,
                "category": category_resp.data["id"],
            },
            format="json",
        )
        self.assertEqual(product_resp.status_code, status.HTTP_201_CREATED)

        pvz_resp = self.client.post(
            "/api/pickup-points/admin/",
            {"name": "Smoke PVZ", "city": "Moscow", "address": "Main 1", "schedule": "10-20", "is_active": True},
            format="json",
        )
        self.assertEqual(pvz_resp.status_code, status.HTTP_201_CREATED)
        self.client.force_authenticate(user=None)

        register_resp = self.client.post(
            "/api/auth/register/",
            {
                "firstName": "Smoke",
                "lastName": "User",
                "email": "smoke-user@example.com",
                "phone": "+79990000000",
                "password": "strongpass123",
                "confirmPassword": "strongpass123",
            },
            format="json",
        )
        self.assertEqual(register_resp.status_code, status.HTTP_201_CREATED)
        access = register_resp.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

        catalog_resp = self.client.get("/api/catalog/products/")
        self.assertEqual(catalog_resp.status_code, status.HTTP_200_OK)
        product_id = catalog_resp.data["results"][0]["id"]

        add_cart_resp = self.client.post("/api/cart/items/", {"product_id": product_id, "quantity": 2}, format="json")
        self.assertEqual(add_cart_resp.status_code, status.HTTP_201_CREATED)

        checkout_resp = self.client.post(
            "/api/orders/checkout/",
            {
                "firstName": "Smoke",
                "lastName": "User",
                "email": "smoke-user@example.com",
                "phone": "+79990000000",
                "city": "Moscow",
                "pvzId": pvz_resp.data["id"],
                "comment": "smoke",
            },
            format="json",
        )
        self.assertEqual(checkout_resp.status_code, status.HTTP_201_CREATED)
        order_id = checkout_resp.data["id"]

        pay_resp = self.client.post(
            "/api/payments/simulate/",
            {
                "order_id": order_id,
                "card_number": "4111111111111111",
                "expiry": "12/30",
                "cvv": "123",
                "holder": "SMOKE USER",
                "outcome": "success",
            },
            format="json",
        )
        self.assertEqual(pay_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(pay_resp.data["order"]["payment_status"], PaymentStatus.PAID)

        my_orders_resp = self.client.get("/api/orders/my/")
        self.assertEqual(my_orders_resp.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(my_orders_resp.data["results"]), 1)

        self.client.credentials()
        login_admin = self.client.post(
            "/api/auth/login/",
            {"email": "admin-smoke@example.com", "password": "123456"},
            format="json",
        )
        self.assertEqual(login_admin.status_code, status.HTTP_200_OK)
        admin_access = login_admin.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {admin_access}")

        admin_orders = self.client.get("/api/orders/admin/")
        self.assertEqual(admin_orders.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(admin_orders.data["results"]), 1)
