import http from "http";
import express from "express";
import SocketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.render("/"));

const httpServer = http.createServer(app);
// 먼저 http 서버를 만들었지
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event:${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    // socketIO에서 모든 socket은 기본적으로 User와 서버 사이에 private romm이 있다.
    //이게 방에 참가하는 기능임
    setTimeout(() => {
      done("hello from the backend");
    }, 15000);
    //백에서 함수 done 함수 실행시킴
  });
});
//conection을 받을 준비

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
