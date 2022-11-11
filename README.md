# Noom

Zoom Clone using NddeJS, WebRTC and Websockets.

======================

> 계기 : 실전 프젝에서 웹소켓이 필요해서 공부 목적으로 시작
> 참고영상 : https://nomadcoders.co/noom/lobby

# 1. WebRTC

## 1.WebRTC란?

[**WebRTC**]브라우저와 모바일 애플리케이션에 피어 투 피어 연결을 통해 실시간 통신(RTC) 기능을 제공하는 일련의 프로토콜, 메커니즘 및 API입니다.

### 문제1

back-end가 javascipt object를 전혀 이해하지 못하고 있다.
우리는 string만 보낼 수 있으니까 이건 중요하다 오로지 프로그래밍 언어에만 의존하면 안되니까
ex) back-end로 javasctipt object를 보내면 좋지 않다.
왜냐? 연결하고 싶은 front-end와 back-end서버가 javascript 서버가 아닐 수도 있기 때문에 이러한 이유로 javascipt object를 back-end로 보내면 안된다.
그리고 back-end에 있는 모든 서버는 그 string을 가지고 뭘 할지 결정하는거다.
그래서 우리는 string으로 back-end에 보내주어야 한다.

## 새로 알게된 점

### 1.

- 우리가 on 하고 백엔드가 emit 하는거 같음

### 클라이언트 -> 서버

(클라이언트가 서버에게 전송한 메시지 수신)

on 메소드
: 현재 접속되어 있는 클라이언트로부터 메시지를 수신하려면 on 메소드 사용
io.on('connection', function(socket) {

});

socket.on('event_name', function(data) {
console.log('Message from Client: ' + data);
});

'connection'
: socket.io의 기본 이벤트, 사용자가 웹사이트에 접속하면 자동으로 발생하는 이벤트

### 서버 -> 클라이언트

(서버가 클라이언트에게 메시지 전송)

io.emit
:서버가 현재 접속해있는 모든 클라이언트에게 이벤트 전달

io.emit('event_name', msg);

socket.emit
:서버쪽에서 event를 발생시키는 함수
서버에서 이벤트 발생시키면 클라이언트 페이지의 해당 이벤트 리스너에서 처리
해당 소켓을 통해 클라이언트에게 메시지 전송

socket.emit('event_name', msg);

소켓은 기본적으로 객체다.

socket IO는 실시간, 양방향, event 기반의 통신을 가능하게 한다.
? : 웹 소켓이랑 비슷한거 같은데?
둘 다 메시지를 주고 받는건 똑같아 보이는데 뭐가 다를까?
Socket IO는 브라우저와 node.js의 통신 외에 다른 것도 사용한다.
만일 websocket을 지원하지 않는 경우, HTTP longpolling 같은 것을 사용 = 만약 wifi연결이 잠시동안 끝겨도 socket IO는 재연결을 시도한다.

ws라는 아주 멋진 package의 도움을 받아서 시작해본다.

ws는 사용하기 편하고, 아주 빠르며, 클라이언트와 서버 사이의 webSocket실행에서 검증된거다.

app.js 가 프론트이고 server가 백엔드 꺼임

서버 종료하는 법 ctrl + c

시작 npm run dev

clear 하면 깨끗해짐

WebSocket()

프론트엔드는 아무것도 설치할 필요가 없고 브라우저에서 지원하지

백엔드에서 socket은 연결된 어떤 사람이다. 연결된 브라우저와의 contact(연락)라인 브라우저와 너의 연결

### part2

한개의 서버가 서로 다른 두 브라우저로 부터 메시지를 받고 있고, 그 메시지에 각각 답장해주고 있지만, 서로 다른 브라우저는 서로 메시지를 주고받지 못합니다.

만약 끝날 때 실행되는 argument(매개변수)는 function을 보내고 싶으면 마지막에 넣얻야돼
Back-end는 front-end에서 오는 코드를 실행시키면 안돼 엉청난 보안 문제가 생겨서
사람들이 아무코드나 입력하면 백이 실행시켜서

Disconnecting은 고객이 접속을 중단할 것이지만 아직 방을 완전히 나가지는 않은 것이다.
disconnect와 다르다.

2-8
adapter는 누가 연결 되었는지, 현재 어플리케이션에 room이 얼마나 있는 지 알려줌
중요한거 두가지

1. 어플리케이션에 있는 rooms이다. //우리는 어플리케이션에 있는 모든 rooms를 볼 수 있다.
2. 우리는 socketID 를 볼 수 있다.

- rooms.forEach((value, key) => console.log(value, key))
  true "R98ps0fmEt3D"
  true "3kdsjkd3ksjl
  true "nana"
- 우리는 value 값이 아니라 key 값이 필요하다는 것을 알 수 있어
  무언가를 얻고 싶다면 get이랑 key를 사용하면 된다.

- rooms. forEach((\_, key) => {
  if(sids.get(key) === undifined)
  }
  만약 내가 key를 가지고 socket ID를 가지려고 하고 그 값이 undefined라면
  내 key는 public room의 key라는 뜻이다.
  모든 socket은 private room이 있다는걸 기억해라 그건 바로 id가 방제목인 경우이다.
  그래서 우리가 private message를 보낼 수 있음

socket io 패키지 설치
socket i socket.io
