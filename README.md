# Noom

Zoom Clone using NddeJS, WebRTC and Websockets.

======================

> 계기 : 실전 프젝에서 웹소켓이 필요해서 공부 목적으로 시작
> 참고영상 : https://nomadcoders.co/noom/lobby

# 1. WebRTC

## 1.1.WebRTC란?

[**WebRTC**]브라우저와 모바일 애플리케이션에 피어 투 피어 연결을 통해 실시간 통신(RTC) 기능을 제공하는 일련의 프로토콜, 메커니즘 및 API입니다.

### 문제1

back-end가 javascipt object를 전혀 이해하지 못하고 있다.
우리는 string만 보낼 수 있으니까 이건 중요하다 오로지 프로그래밍 언어에만 의존하면 안되니까
ex) back-end로 javasctipt object를 보내면 좋지 않다.
왜냐? 연결하고 싶은 front-end와 back-end서버가 javascript 서버가 아닐 수도 있기 때문에 이러한 이유로 javascipt object를 back-end로 보내면 안된다.
그리고 back-end에 있는 모든 서버는 그 string을 가지고 뭘 할지 결정하는거다.
그래서 우리는 string으로 back-end에 보내주어야 한다.

## 새로 알게된 점

### 1

소켓은 기본적으로 객체다.
