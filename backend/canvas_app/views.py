from django.shortcuts import render
from rest_framework.generics import ListAPIView
from .models import PixelChunks
from .serializers import PixelChunkSerializer

# Create your views here.
class GetInitialCanvasChunks(ListAPIView):
    serializer_class = PixelChunkSerializer

    def get_queryset(self):
        return PixelChunks.objects.all().order_by('chunk_y', 'chunk_x')