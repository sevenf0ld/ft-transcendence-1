// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

// ============================================================ //
//                       SOCKET CREATION                        //
//                       ENDPOINT /ws/chat                      //
// ============================================================ //
let url = `wss://${window.location.host}/ws/chat/`;
const chat_socket = new WebSocket(url);

chat_socket.addEventListener("error", (event) => {
	console.error("chat socket creation error: ", event);
});

//chat_socket.addEventListener("open", (event) => {
//	console.log("chat socket has established a connection with the server.");
//});

//chat_socket.addEventListener("close", (event) => {
//	console.log("connection with chat socket has been closed.");
//});

// ============================================================ //
//                        DIFFERENT USERS                       //
// ============================================================ //
let sender = localStorage.getItem('sender');
if (!sender)
	localStorage.setItem('sender', sender);

// ============================================================ //
//                        RECEIVE MESSAGES                      //
//                        FROM BACKEND                          //
// ============================================================ //
chat_socket.addEventListener("message", (event) => {
  let data = JSON.parse(event.data);

  if (data.type == 'connection_established')
  {
    console.log("chat socket connection established:", data.message);
  }
  else if (data.type === 'message_received')
  {
    console.log("chat socket message received:", data.message);

    let messages = document.getElementById('messages');
    let css_class = data.sender === sender ? 'sender' : 'receiver';
    messages.insertAdjacentHTML('beforeend', `<div class="${css_class}"><p>${data.message}</p></div>`);
  };
});

// ============================================================ //
//                          SEND MESSAGES                       //
//                          TO BACKEND                          //
// ============================================================ //
let form = document.getElementById('form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  let message = event.target.msg.value;

  if (chat_socket.readyState === WebSocket.OPEN)
  {
    console.log("chat socket message sending:", message);

    chat_socket.send(JSON.stringify({
      'message': message,
      'sender': sender
    }));
    form.reset();
  }
  else if (chat_socket.readyState === WebSocket.CONNECTING)
  {
    console.log("chat socket is waiting on an open connection with the server.");
  }
  else if (chat_socket.readState >= 2)
  {
    console.error("connection with chat socket is closing or closed.");
  }
});
