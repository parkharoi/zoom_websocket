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
  socket["nickname"] = "Anon";
  socket.onAny((event) => {
    console.log(`Socket Event:${event}`);
    //Socket Event:enter_room
  });

  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    //방에 입장해서 프론트엔드에게 알렸고
    done();
    socket.to(roomName).emit("welcome", socket.nickname);
    //"welcome" event를 rommName에 있는 모든 사람들에게 emit함
  });

  socket.on("disconnecting", () => {
    //클라이언트가 서버와 연결이 끊어지기 전에 마지막 "굿바이" message 보내는거임
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname)
    );
  });

  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
    done();
  });

  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
  //여기서 닉네임을 받고 nickname event가 발생하면 nickname을 가져와서 socket에 저장
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
