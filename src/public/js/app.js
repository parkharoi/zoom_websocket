const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});
//element를 만들고, socket에 이벤트 open 사용 connection이 open일떄 사용하는 listener 등록

socket.addEventListener("message", (message) => {
  console.log("New message:", message.data);
});
// 서버 연결되어 메세지 받을 때 발생하는 listener

socket.addEventListener("close", () => {
  console.log("Disconected to Server ⛔️");
});
//close 이벤트 서버와 연결이 끊김 = 서버가 오프라인이 됐을 때 사용하는 listener

setTimeout(() => {
  socket.send("hello from the browser!");
}, 10000);
