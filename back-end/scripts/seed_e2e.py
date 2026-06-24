from django.contrib.auth import get_user_model

from catalog.models import Category, Product
from pickup_points.models import PickupPoint

User = get_user_model()

admin, created = User.objects.get_or_create(
    email="admin-e2e@example.com",
    defaults={
        "role": "admin",
        "is_staff": True,
        "first_name": "Admin",
        "last_name": "E2E",
    },
)
admin.role = "admin"
admin.is_staff = True
admin.first_name = "Admin"
admin.last_name = "E2E"
admin.set_password("Admin123456")
admin.save(update_fields=["role", "is_staff", "first_name", "last_name", "password"])

cat, _ = Category.objects.get_or_create(slug="e2e-rings", defaults={"name": "E2E Rings"})
Product.objects.get_or_create(
    name="E2E Ring",
    defaults={
        "category": cat,
        "price": "1200.00",
        "material": "silver",
        "stock_quantity": 20,
        "image_url": "https://placehold.co/400x500?text=E2E",
    },
)
PickupPoint.objects.get_or_create(
    name="E2E PVZ",
    city="Moscow",
    address="Test Street 1",
    defaults={"is_active": True, "schedule": "10:00-20:00", "eta_text": "30 минут"},
)

print("E2E seed: OK")
