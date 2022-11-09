const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function backendDone(msg) {
  console.log(`The backend says: `, msg);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, backendDone);
  // backend는 2개의 argument를 받는다. 근데 backendDone이라는 함수는 백에서 모르기 때문에 보안 문제로 프론트에서 실행함
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);
