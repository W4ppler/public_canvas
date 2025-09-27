from django.db import migrations

def create_chunks(apps, schema_editor):
    PixelChunks = apps.get_model('canvas_app', 'PixelChunks')
    PixelChunks.objects.all().delete()
    chunk_size = 50
    width, height = 1000, 500
    for chunk_x in range(width // chunk_size):
        for chunk_y in range(height // chunk_size):
            PixelChunks.objects.create(
                chunk_x=chunk_x,
                chunk_y=chunk_y,
                data="000000" * (chunk_size * chunk_size)
            )

class Migration(migrations.Migration):
    dependencies = [
        ('canvas_app', '0007_alter_pixelchunks_data'),
    ]
    operations = [
        migrations.RunPython(create_chunks),
    ]
