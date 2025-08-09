from django.db import models

# Create your models here.
class CanvasModel(models.Model):
    id = models.AutoField(primary_key=True)
    x = models.IntegerField()
    y = models.IntegerField()
    colour = models.CharField(max_length=7)