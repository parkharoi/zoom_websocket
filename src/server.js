import http from "http";
import WebSocket from "ws";
import express from "express";
import { Socket } from "dgram";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.render("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (socket) => {
  console.log("Connected to Browser ✅");
  socket.on("close", () => console.log("Disconected the Browser ⛔️"));
  socket.on("message", (message) => {
    console.log(message.toString(`utf8`));
  });
  socket.send("hello !!");
});
//connection이 생기면 socket을 받는다
//서버 socket에서 hello 보내줌
//socket.on("message")는 메세지 이벤트 등록한거임  뒤에 ,message가 메세지 받은거

server.listen(3000, handleListen);
