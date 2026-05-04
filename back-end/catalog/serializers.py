from rest_framework import serializers

from .models import Category, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    productCount = serializers.IntegerField(source="products.count", read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "productCount", "created_at", "updated_at"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image_url", "is_primary", "sort_order"]


class ProductSerializer(serializers.ModelSerializer):
    categoryName = serializers.CharField(source="category.name", read_only=True)
    category = serializers.CharField(source="category.slug", read_only=True)
    inStock = serializers.BooleanField(source="in_stock", read_only=True)
    isNew = serializers.BooleanField(source="is_new", read_only=True)
    image = serializers.CharField(source="image_url", read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "price",
            "material",
            "size",
            "stock_quantity",
            "inStock",
            "image",
            "image_url",
            "isNew",
            "is_popular",
            "category",
            "categoryName",
            "images",
            "created_at",
            "updated_at",
        ]


class ProductWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "price",
            "material",
            "size",
            "stock_quantity",
            "image_url",
            "is_new",
            "is_popular",
            "category",
        ]
