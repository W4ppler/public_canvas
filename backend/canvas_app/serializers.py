from rest_framework import serializers
from .models import PixelChunks
import base64

class PixelChunkSerializer(serializers.ModelSerializer):
    data = serializers.SerializerMethodField()

    class Meta:
        model = PixelChunks
        fields = ['chunk_x', 'chunk_y', 'data']

    def get_data(self, obj):
        return obj.data