import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.render("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  //누군가 우리 서버에 연결하면, 그 connection을 여기에 넣을거야
  // 이 뜻은 firefox가 연결될 떄, firefox를 이 array에 넣어 준다.

  sockets.push(socket);
  socket["nickname"] = "Anon";
  //닉네임을 지정하지 않은 사람들을 위한 익명 배려임

  console.log("Connected to Browser ✅");
  socket.on("close", () => console.log("Disconected the Browser ⛔️"));
  socket.on("message", (msg) => {
    //sovket이 메시지를 보낼 때까지 기다릴꼬얌 (msg) string을 받고

    const message = JSON.parse(msg);
    //string을 parse해서 massage로 바꿨어

    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname} : ${message.payload}`)
        );
      //모두에게 익명의 socket이 보낸 메시지를 전달 하는거여 nickname property(익명)를 socket object에 저장하는겨
      //이렇게 하는이유는 닉네임만 입력하고 버튼을 눌렀을경우 전송하는 것을 방지해준다.

      case "nickname":
        socket["nickname"] = message.payload;
      //나중에 nickname ype의 메시지를 전송할 수도 있겠지?
    }
  });
  // 각 브라우저를 aSocket으로 표시하고 메시지를 보낸다는 의미 이제 연결된 모든 소켓 연결
});
//connection이 생기면 socket을 받는다
//서버 socket에서 hello 보내줌
//socket.on("message")는 메세지 이벤트 등록한거임  뒤에 ,message가 메세지 받은거

server.listen(3000, handleListen);
