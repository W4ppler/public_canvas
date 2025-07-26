from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import CanvasModel


class CanvasConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = "canvas_room"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        x = data['x']
        y = data['y']
        colour = data.get('colour')

        await self.update_pixel(x, y, colour)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'canvas_update',
                'x': x,
                'y': y,
                'colour': colour
            }
        )

    async def canvas_update(self, event):
        message = {
            'x': event['x'],
            'y': event['y'],
            'colour': event['colour']
        }

        await self.send(text_data=json.dumps(message))

    @database_sync_to_async
    def update_pixel(self, x, y, colour):
        CanvasModel.objects.update_or_create(
            x=x, y=y,
            defaults={'colour': colour}
        )
