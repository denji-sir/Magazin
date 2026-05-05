from catalog.models import Product, ProductImage

IMAGE_POOL = [
    "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1602752250015-52934bc45613?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop",
]

updated = 0
created_images = 0

products = Product.objects.select_related("category").all().order_by("id")
for idx, product in enumerate(products):
    primary = IMAGE_POOL[idx % len(IMAGE_POOL)]
    secondary = IMAGE_POOL[(idx + 3) % len(IMAGE_POOL)]

    product.image_url = primary
    product.save(update_fields=["image_url", "updated_at"])
    updated += 1

    ProductImage.objects.filter(product=product).delete()
    ProductImage.objects.create(product=product, image_url=primary, is_primary=True, sort_order=0)
    ProductImage.objects.create(product=product, image_url=secondary, is_primary=False, sort_order=1)
    created_images += 2

print(f"Updated products: {updated}")
print(f"Created product_images: {created_images}")
