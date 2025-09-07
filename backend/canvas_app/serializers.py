from rest_framework import serializers
from .models import Pixels

class CanvasModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pixels
        fields = "__all__"