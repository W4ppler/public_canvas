from django.shortcuts import render
from rest_framework.generics import ListAPIView
from .models import Pixels
from .serializers import CanvasModelSerializer

# Create your views here.
class GetCurrentCanvas(ListAPIView):
    serializer_class = CanvasModelSerializer

    def get_queryset(self):
        return Pixels.objects.all()