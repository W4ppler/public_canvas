from django.db import models

# Create your models here.
class Pixels(models.Model):
    id = models.AutoField(primary_key=True)
    x = models.IntegerField()
    y = models.IntegerField()
    colour = models.CharField(max_length=7)

class PixelChunks(models.Model):
    id = models.AutoField(primary_key=True)
    chunk_x = models.IntegerField()
    chunk_y = models.IntegerField()
    data = models.TextField()