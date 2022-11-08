const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
  //메세지를 스트링으로 바꿔서 리턴함
}

function handleOpen() {
  console.log("Connected to Server ✅");
}

socket.addEventListener("open", handleOpen);
//element를 만들고, socket에 이벤트 open 사용 connection이 open일떄 사용하는 listener 등록

socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});
// 서버 연결되어 메세지 받을 때 발생하는 listener 유저가 메시지 전송

socket.addEventListener("close", () => {
  console.log("Disconected to Server ⛔️");
});
//close 이벤트 서버와 연결이 끊김 = 서버가 오프라인이 됐을 때 사용하는 listener

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value));
  //front-end의 form에서 back-end로 무엇가를 보냄
  const li = document.createElement("li");
  li.innerText = `You: ${input.value}`;
  messageList.append(li);
  input.value = "";
  // 입력 다 하면 빈값으로 만들어줌
}
//이 부분의 메시지는 chat으로 보내는 메시지

function handleNickSubmit(event) {
  event.preventDefault();
  //다른 이벤트 실행중일 경우 이벤트 발생 방지
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
  //type은 nickname이고 payloa이고 input.valu이다.
  input.value = "";
}
//이 부분의 메시지는 내가 nickname을 변경하고 싶을 때 back-end로 보내는거

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
