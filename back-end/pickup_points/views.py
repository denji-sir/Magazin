from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from users.permissions import IsAdminRole

from .models import PickupPoint
from .serializers import PickupPointSerializer


class PickupPointsHealthView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({"domain": "pickup_points", "status": "ok"})


class ActivePickupPointViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PickupPoint.objects.filter(is_active=True)
    serializer_class = PickupPointSerializer
    permission_classes = [AllowAny]


class AdminPickupPointViewSet(viewsets.ModelViewSet):
    queryset = PickupPoint.objects.all()
    serializer_class = PickupPointSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]
