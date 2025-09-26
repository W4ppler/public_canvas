import math

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import Pixels, PixelChunks
import os

CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE"))
CANVAS_WIDTH = int(os.environ.get("CANVAS_WIDTH"))
CANVAS_HEIGHT = int(os.environ.get("CANVAS_HEIGHT"))

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

    def get_affected_pixels(self, x, y, thiccness):
        affected = []
        offset = -thiccness // 2
        for dx in range(thiccness):
            for dy in range(thiccness):
                px = x + offset + dx
                py = y + offset + dy
                affected.append((px, py))
        return affected

    @database_sync_to_async
    def update_pixel(self, x, y, colour, thiccness):
        affected_pixels = self.get_affected_pixels(x, y, thiccness)

        for (px, py) in affected_pixels:
            x = px
            y = py

            colour = colour.lstrip('#')

            affected_chunk_x = math.floor(x / CHUNK_SIZE)
            affected_chunk_y = math.floor(y / CHUNK_SIZE)

            affected_chunk = PixelChunks.objects.get(chunk_x=affected_chunk_x, chunk_y=affected_chunk_y)

            pixel_x_in_chunk = x % CHUNK_SIZE
            pixel_y_in_chunk = y % CHUNK_SIZE

            pixel_index = pixel_y_in_chunk * CHUNK_SIZE * 6 + pixel_x_in_chunk * 6

            data = list(affected_chunk.data)
            for i in range(6):
                data[pixel_index + i] = colour[i]

            affected_chunk.data = ''.join(data)
            affected_chunk.save()
