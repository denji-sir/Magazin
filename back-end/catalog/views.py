from django.db.models import Q
from rest_framework import filters, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated

from users.permissions import IsAdminRole

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer, ProductWriteSerializer


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.select_related("category").prefetch_related("images")
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "description"]

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get("category")
        material = self.request.query_params.get("material")
        in_stock = self.request.query_params.get("in_stock")
        price_min = self.request.query_params.get("price_min")
        price_max = self.request.query_params.get("price_max")
        ordering = self.request.query_params.get("ordering")

        if category:
            queryset = queryset.filter(category__slug=category)

        if material:
            queryset = queryset.filter(material__icontains=material)

        if in_stock is not None:
            stock_flag = in_stock.lower() in {"1", "true", "yes"}
            if stock_flag:
                queryset = queryset.filter(stock_quantity__gt=0)
            else:
                queryset = queryset.filter(stock_quantity=0)

        if price_min:
            queryset = queryset.filter(price__gte=price_min)
        if price_max:
            queryset = queryset.filter(price__lte=price_max)

        if ordering in {"price", "-price", "created_at", "-created_at", "name", "-name"}:
            queryset = queryset.order_by(ordering)
        elif ordering == "popularity":
            queryset = queryset.order_by("-is_popular", "-created_at")
        elif ordering == "newest":
            queryset = queryset.order_by("-is_new", "-created_at")

        return queryset


class CategoryPublicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class AdminProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related("category")
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get_serializer_class(self):
        if self.action in {"list", "retrieve"}:
            return ProductSerializer
        return ProductWriteSerializer


class AdminCategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get_queryset(self):
        query = self.request.query_params.get("search")
        queryset = super().get_queryset()
        if query:
            queryset = queryset.filter(Q(name__icontains=query) | Q(slug__icontains=query))
        return queryset
