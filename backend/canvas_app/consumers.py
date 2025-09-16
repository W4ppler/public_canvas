from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import Pixels


class CanvasConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = "canvas_room"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)

        if(data['type'] == 'draw'):
            x = data['x']
            y = data['y']
            colour = data.get('colour')
            thiccness = data.get('thiccness')

            await self.update_pixel(x, y, colour, thiccness)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'canvas_update',
                    'x': x,
                    'y': y,
                    'colour': colour,
                    'thiccness': thiccness,
                    'sender_channel_name': self.channel_name,
                }
            )

    async def canvas_update(self, event):
        if event.get('sender_channel_name') == self.channel_name:
            return

        message = {
            'x': event['x'],
            'y': event['y'],
            'colour': event['colour'],
            'thiccness': event['thiccness'],
        }
        await self.send(text_data=json.dumps(message))

    @database_sync_to_async
    def update_pixel(self, x, y, colour, thiccness):
        coords = [(x + k, y + i) for k in range(thiccness) for i in range(thiccness)]
        existing = Pixels.objects.filter(
            x__in=[c[0] for c in coords],
            y__in=[c[1] for c in coords]
        )
        for pixel in existing:
            pixel.colour = colour
        if existing:
            Pixels.objects.bulk_update(existing, ['colour'])
