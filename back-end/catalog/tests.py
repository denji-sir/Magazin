from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Category, Product

User = get_user_model()


class CatalogApiTests(APITestCase):
    def setUp(self):
        rings = Category.objects.create(name="Rings", slug="rings")
        earrings = Category.objects.create(name="Earrings", slug="earrings")
        Product.objects.create(category=rings, name="Luna Ring", price=Decimal("100.00"), material="silver", stock_quantity=5)
        Product.objects.create(category=earrings, name="Aurora", price=Decimal("200.00"), material="gold", stock_quantity=0)

    def test_public_catalog_filters(self):
        resp = self.client.get("/api/catalog/products/?category=rings&in_stock=true")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data["results"]), 1)
        self.assertEqual(resp.data["results"][0]["name"], "Luna Ring")

    def test_categories_public(self):
        resp = self.client.get("/api/catalog/categories/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(resp.data["results"]), 2)

    def test_product_contract_fields_for_frontend(self):
        resp = self.client.get("/api/catalog/products/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(resp.data["results"]), 1)
        row = resp.data["results"][0]
        for key in [
            "id",
            "name",
            "price",
            "category",
            "image",
            "isNew",
            "description",
            "material",
            "inStock",
            "stock_quantity",
        ]:
            self.assertIn(key, row)

    def test_favorites_crud_requires_auth_and_works(self):
        user = User.objects.create_user(email="fav-user@example.com", password="123456")
        product = Product.objects.first()

        unauth_resp = self.client.post("/api/catalog/favorites/", {"product_id": product.id}, format="json")
        self.assertEqual(unauth_resp.status_code, status.HTTP_401_UNAUTHORIZED)

        self.client.force_authenticate(user=user)
        add_resp = self.client.post("/api/catalog/favorites/", {"product_id": product.id}, format="json")
        self.assertIn(add_resp.status_code, {status.HTTP_200_OK, status.HTTP_201_CREATED})
        self.assertTrue(add_resp.data["is_favorite"])

        list_resp = self.client.get("/api/catalog/favorites/")
        self.assertEqual(list_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_resp.data), 1)
        self.assertEqual(list_resp.data[0]["product_id"], product.id)

        delete_resp = self.client.delete(f"/api/catalog/favorites/{product.id}/")
        self.assertEqual(delete_resp.status_code, status.HTTP_200_OK)
        self.assertFalse(delete_resp.data["is_favorite"])
