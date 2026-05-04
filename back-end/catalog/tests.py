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
