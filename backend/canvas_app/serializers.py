from rest_framework import serializers
from .models import CanvasModel

class CanvasModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CanvasModel
        fields = "__all__"