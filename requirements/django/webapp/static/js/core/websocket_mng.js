// file : websocket_mng.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
class websocketManager
{
	constructor()
	{
		this.init_liveChat();
	}

	async init_liveChat()
	{
		this.liveChat =
		{
			ws: undefined,
			url: undefined,
			sender: undefined,
			target: undefined,
		};
	}

	async close_liveChat()
	{
		if (this.liveChat.ws === undefined)
		{
			await this.init_liveChat();
			return;
		}

		if (this.liveChat.ws.readyState === WebSocket.OPEN)
		{
			this.liveChat.ws.send(JSON.stringify({
			  'message': null,
			  'sender': this.liveChat.sender,
			  'room_name': this.liveChat.target,
			  'type': 'chat_close',
			}));
			this.liveChat.ws.close();
			await this.init_liveChat();
		}
	}
}

const data = new websocketManager();
export default data;
