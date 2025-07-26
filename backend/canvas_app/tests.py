import json
from django.test import TestCase
from channels.testing import WebsocketCommunicator
from .consumers import CanvasConsumer
from .models import CanvasModel


class CanvasConsumerTest(TestCase):
    async def test_canvas_update_message(self):
        application = CanvasConsumer.as_asgi()
        communicator = WebsocketCommunicator(application, "/ws/canvas/")

        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        test_message = {
            'x': 10,
            'y': 20,
            'colour': '#123456'
        }
        await communicator.send_to(text_data=json.dumps(test_message))

        response = await communicator.receive_from()
        self.assertEqual(json.loads(response), test_message)

        pixel_exists = await CanvasModel.objects.filter(x=10, y=20, colour='#123456').aexists()
        self.assertTrue(pixel_exists)

        await communicator.disconnect()