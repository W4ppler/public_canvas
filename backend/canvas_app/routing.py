from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/canvas/", consumers.CanvasConsumer.as_asgi()),
]
