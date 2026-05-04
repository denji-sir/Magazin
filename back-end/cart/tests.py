from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from catalog.models import Category, Product

User = get_user_model()


class CartApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="u1@example.com", password="123456")
        cat = Category.objects.create(name="Rings", slug="rings")
        self.product = Product.objects.create(category=cat, name="Ring", price=Decimal("150.00"), stock_quantity=10)
        self.client.force_authenticate(user=self.user)

    def test_add_update_remove_item(self):
        add_resp = self.client.post("/api/cart/items/", {"product_id": self.product.id, "quantity": 2}, format="json")
        self.assertEqual(add_resp.status_code, status.HTTP_201_CREATED)

        item_id = add_resp.data["id"]
        patch_resp = self.client.patch(f"/api/cart/items/{item_id}/", {"quantity": 3}, format="json")
        self.assertEqual(patch_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_resp.data["quantity"], 3)

        cart_resp = self.client.get("/api/cart/")
        self.assertEqual(cart_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(cart_resp.data["item_count"], 3)

        del_resp = self.client.delete(f"/api/cart/items/{item_id}/")
        self.assertEqual(del_resp.status_code, status.HTTP_204_NO_CONTENT)
