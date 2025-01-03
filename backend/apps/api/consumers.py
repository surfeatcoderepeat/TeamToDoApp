from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json

class ProjectConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.project_id = self.scope['url_route']['kwargs']['project_id']
        self.group_name = f"project_{self.project_id}"

        # Unirse al grupo del proyecto
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Salir del grupo
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        
    async def receive(self, text_data):
        """
        Maneja los eventos enviados por los clientes
        """
        data = json.loads(text_data)
        event_type = data.get('type')
        payload = data.get('payload', {})

        # Enviar mensaje al grupo
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': event_type, # llama al handler correspontiente como project_created, etc.
                'payload': payload,
            }
        )

    # Handlers especificos para cada evento
    async def project_created(self, event):
        await self.send(text_data=json.dumps({
            'type': 'project_created',
            'payload': event['payload']
        }))

    async def project_updated(self, event):
        await self.send(text_data=json.dumps({
            'type': 'project_updated',
            'payload': event['payload']
        }))

    async def project_deleted(self, event):
        await self.send(text_data=json.dumps({
            'type': 'project_deleted',
            'payload': event['payload']
        }))

    async def participant_added(self, event):
        await self.send(text_data=json.dumps({
            'type': 'participant_added',
            'payload': event['payload']
        }))
    
    async def participant_removed(self, event):
        await self.send(text_data=json.dumps({
            'type': 'participant_removed',
            'payload': event['payload']
        }))

    async def task_created(self, event):
        await self.send(text_data=json.dumps({
            'type': 'task_created',
            'payload': event['payload']
        }))

class TaskConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.project_id = self.scope['url_route']['kwargs']['project_id']
        self.group_name = f"project_{self.project_id}"

        # Unirse al grupo del proyecto
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Salir del grupo
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        
    async def receive(self, text_data):
        """
        Maneja los eventos enviados por los clientes
        """
        data = json.loads(text_data)
        event_type = data.get('type')
        payload = data.get('payload', {})

        # Enviar mensaje al grupo
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': event_type,
                'payload': payload,
            }
        )

    async def task_updated(self, event):    
        await self.send(text_data=json.dumps({
            'type': 'task_updated',
            'payload': event['payload']
        }))

    async def task_deleted(self, event):
        await self.send(text_data=json.dumps({
            'type': 'task_deleted',
            'payload': event['payload']
        }))

    async def task_assigned(self, event):
        await self.send(text_data=json.dumps({
            'type': 'task_assigned',
            'payload': event['payload']
        }))

    async def task_unassigned(self, event):
        await self.send(text_data=json.dumps({
            'type': 'task_unassigned',
            'payload': event['payload']
        }))