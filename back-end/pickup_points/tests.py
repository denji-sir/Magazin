from rest_framework import status
from rest_framework.test import APITestCase

from .models import PickupPoint


class PickupPointApiTests(APITestCase):
    def test_active_pickup_points(self):
        PickupPoint.objects.create(name="A", city="Moscow", address="x", is_active=True)
        PickupPoint.objects.create(name="B", city="Moscow", address="y", is_active=False)

        resp = self.client.get("/api/pickup-points/active/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data["results"]), 1)
