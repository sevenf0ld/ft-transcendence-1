// create a chat socket object to establish a websocket connection for handshake via endpoint
let url = `wss://${window.location.host}/ws/chat/`;
const chatSocket = new WebSocket(url);
chatSocket.onmessage = function (e) {
  let data = JSON.parse(e.data)
  console.log('websocket received the following msg: ', data)
}
