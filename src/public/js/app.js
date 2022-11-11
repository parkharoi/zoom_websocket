//io는 자동적으로 back-end socket.io와 연결 해주는 function이야
//이제는 정말 쉽게 socket Id를 볼 수 있게 되었음
const socket = io();

//welcome div 가져옴
const welcome = document.getElementById("welcome");
//form 가져옴
const form = welcome.querySelector("form");
const room = document.getElementById("room");

//이렇게 하면 room이 숨겨짐
room.hidden = true;

//참가한 방에 누가 있는 지 사람들한테 알려주기 위해서 선언 (첨엔 비어있음)
//1. handleRoomSubmit function에 input.value로 넣어주면서 방 이름을 담음
//2. showroom에서 h3에 innerText로 넣어줌
let roomName;

//메세지 받는 function이라서 안에 message들어감
function addMessage(message) {
  const ul = room.querySelector("ul");
  //정렬되지 않은 목록을 나타냄 "ul"
  const li = document.createElement("li");
  //목록의 항목을 나타냅니다 반드시 정렬 목록(<ol>), 비정렬 목록(<ul>, 혹은 메뉴(<menu>) 안에 위치
  li.innerText = message;
  //li가 pug에
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  //input의 value를 사용하는 익명함수를 사용했는데 그 뒤에 input.value = ""를 비워줌
  //그래서 위에 const value를 선언하지 않았다면 이 함수를 실행됐을 때 input.value는 이미 없어진것이다.
  socket.emit("new_message", input.value, roomName, () => {
    //백엔드에서 실행해서 대화창에 메시지가 보이도록 만듬
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  const value = input.value;
  socket.emit("nickname", input.value);
}

function showRoom() {
  // 방이름 입력하고 버튼 누르면 백에서 showroom function 실행시켜서 front-end 쪽에서 동작
  // welcome form 사라지고 room form 등장 뚜둔
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#name");
  msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNicknameSubmit);
}

//반복되는 작업 event.preventDefault()를 쓰고 Form 안에 input을 가져온다.
function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  //socket.send가 아니라 socket.emit을 쓰는데 다른거임 지금과 같은 경우는 room이라는 event를 emit
  //emit을 하면 argument를 보낼 수 있다. / argument는 object가 될 수도 있다.
  //쩌번에 websocket할때는는 object를 string으로 변환시키고 그 다음에 string을 전송할 수 있었음 근데 socket io는 알아서 해줌
  // 1.특정한 event를 emit해 줄 수 있어 너가 원하는 모든걸, 어떤 이름이든 상관 x
  //1-2 socket.emit과 socket.on에는 같은 이름을 사용해야 돼
  //2. object 전송 가능
  // 첫번째 argument에는 event이름이 들어가고, 두번째는 보내고 싶은 payload 세번째는 서버에서 호출하는 function이 들어간다.
  // 마지막은 무조건 argument여야함
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${user} arrived!`);
});

socket.on("bye", (left, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${left} left ㅠㅠ`);
});

socket.on("new_message", addMessage);

//room_change event가 발생했을 때 나한테 rooms 배열을 줄거야
socket.on("room_change", (rooms) => {
  //welcome의 ul을 받아서 roomList로 만들어줘야함
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  //1번 실행할 때 화면에 방 목록을 paint 해주는데,
  //다시 실행할때 목록이 비어 있으면 아무것도 안해(방을 나갔을 경우) 그래서 if 문 돌려
  if (rooms.length === 0) {
    return;
  }
  //각각의 room에 li element를 만들어주고
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
