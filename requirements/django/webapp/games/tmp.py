from django.core.cache import cache

class GameRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.group_id = f'gameroom_{self.room_id}'
        if not self.user.is_authenticated or len(self.room_id) != 6:
            await self.close(code=3000)
            return

        members = await self.get_room_members()
        if len(members) < MAX_PVP_MEMBERS:
            await self.accept()
            members.append(self.user.username)
            await self.set_room_members(members)
            await self.channel_layer.group_add(self.group_id, self.channel_name)
            await self.broadcast_room_details(members)
        else:
            await self.close(code=3003)

    async def disconnect(self, code):
        if hasattr(self, 'group_id'):
            members = await self.get_room_members()
            if self.user.username in members:
                members.remove(self.user.username)
                await self.set_room_members(members)
                if not members:
                    await self.delete_room_members()
                await self.channel_layer.group_discard(self.group_id, self.channel_name)

    async def get_room_members(self):
        members = cache.get(self.group_id)
        return members if members else []

    async def set_room_members(self, members):
        cache.set(self.group_id, members)

    async def delete_room_members(self):
        cache.delete(self.group_id)

