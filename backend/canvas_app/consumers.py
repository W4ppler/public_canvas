from channels.generic.websocket import AsyncWebsocketConsumer
import json

class CanvasConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Accept the WebSocket connection
        await self.accept()

    async def disconnect(self, close_code):
        # WebSocket disconnection
        pass

    async def receive(self, text_data):
        # Handle messages received from the WebSocket
        data = json.loads(text_data)
        message = data.get('message', '')

        # Echo the message back to the WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))