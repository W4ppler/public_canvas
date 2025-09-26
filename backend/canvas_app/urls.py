from django.urls import path
from .views import GetInitialCanvasChunks
from . import consumers

urlpatterns = [
    path('canvas/', GetInitialCanvasChunks.as_view(), name='get_current_canvas'),
]

websocket_urlpatterns = [
    path("ws/canvas/", consumers.CanvasConsumer.as_asgi()),
]
