from django.db import models

# Create your models here.
class CanvasModel(models.Model):
    x = models.IntegerField()
    y = models.IntegerField()
    colour = models.CharField(max_length=7)
