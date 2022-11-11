import http from "http";
import express from "express";
import SocketIO from "socket.io";
import { WebSocketServer } from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.render("/"));

// 먼저 http 서버를 만들었지 그리고 새로운 websocket을 만들 때 http를 위에 쌓아 올리면서 만듬 socket io도 마찬가지
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

//wsServer.sockets.adapter로 부터 sids와 rooms를 가져와서 실행
function publicRooms() {
  //sockets안으로 들어가서 adapter을 갖고 sids와 rooms를 가져온다. wsServer안에서
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  // keym value값인데 key값이 방이 나오는 값이라서 key 값만 적음
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName) {
  //가끔 roomName을 찾을 수도 있지만 아닐 수도 있기 때문에 .? 표시
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

// 위에 wsServer 받아주고 여기서 받는 socket이 있어 괄호 안에 socket
wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon";
  //socket.onAny는 마치 미들웨어 같은거다. 어느 event에서든지 console.log할 수 있음
  socket.onAny((event) => {
    console.log(wsServer.sockets.adapter);
    console.log(`Socket Event:${event}`);
    //출력값 : Socket Event:enter_room
    // 확인 내용 : user의 id는 user가 있는 방의 id와 같다.
    //why? socketIO에서 모든 socket은 기본적으로 User와 서버 사이에 private room이 있음
  });

  //socket.on뒤에 우리가 원하는 메시지 event를 넣어주면 된다.
  socket.on("enter_room", (roomName, done) => {
    //socket IO는 기본적으로 room을 제공한다. 그래서 socket.join()하고 괄호안에 room이름만 입력하면 됨 이게 방에 참가하는 기능
    socket.join(roomName);
    //서버는 back-end에서 function을 호출하지만 function은 front-end에서 실행된거야
    //done()function을 back-end에서 실행 시키지 않아 왜냐면 보안 문제가 생길 수 있거든 누군가 내 database를 지우는 코드를 작성할 수도 있잖아
    // 그래서 신뢰하지 못하는 코드는 백엔드에서 실행시키지 않아
    done();
    //"welcome" event를 rommName에 있는 모든 사람들에게 emit함
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
    //이건 모든 socket에 메세지를 보내준다.
    wsServer.sockets.emit("room_change", publicRooms());
  });

  //클라이언트가 서버와 연결이 끊어지기 전에 마지막 "굿바이" message 보내는거임
  socket.on("disconnecting", () => {
    //forEach를 사용하여 종료 이벤트 발생 socket.rooms를 하면 방의 ID를 얻을 수 있었다.
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
    );
  });

  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });

  socket.on("new_message", (msg, room, done) => {
    //메세지를 보내지만 어느쪽으로 메세지를 보내주는걸 설정하기 위해 room이라는 argument를 추가함
    socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
    done();
  });

  //여기서 닉네임을 받고 nickname event가 발생하면 nickname을 가져와서 socket에 저장
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

// const wss = new WebSocket.Server({ server });

// const sockets = [];

// wss.on("connection", (socket) => {

//   sockets.push(socket);
//   socket["nickname"] = "Anon";

//   console.log("Connected to Browser ✅");
//   socket.on("close", () => console.log("Disconected the Browser ⛔️"));
//   socket.on("message", (msg) => {

//     const message = JSON.parse(msg);

//     switch (message.type) {
//       case "new_message":
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${socket.nickname} : ${message.payload}`)
//         );
//       case "nickname":
//         socket["nickname"] = message.payload;
//     }
//   });
// });

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
