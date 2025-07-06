from django.urls import path
from .views import GetCurrentCanvas

urlpatterns = [
    path('canvas/', GetCurrentCanvas.as_view(), name='get_current_canvas'),
]