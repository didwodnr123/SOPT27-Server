### week3

## Contents

01. [HTTP](#http)
02. [EXPRESS](#express)
03. [AWS](#aws)

<!--http-->
## HTTP/HTTPS

HTTP: Hyper Text Transfer Protocol
- 웹에서 클라이언트와 서버가 데이터를 주고받을 수 있는 프로토콜(규칙)

|Method|Action|Request Body|
|-----|-------|------------|
|Post|Create|O|
|GET|Read|X|
|PUT|Update|O|
|DELETE|Delete|X|

<!--express-->
## Express
**express**
- 웹 및 모바일 애플리케이션을 위한 Node.js 기반 웹 애플리케이션 프레임워크
  - HTTP 요청에 대해 라우팅 및 미들웨어 기능 제공
  - 노드 패키지 매니저(npm)을 사용해서 수천만개의 재사용 가능하 패키지에 접근 가능
 
**미들웨어**
- 미들웨어란 서버가 요청-응답과정을 하는 동안 중간에 어떠한 동작을 해주는 함수

**Routing**
- 라우팅은 URI 및 특정한 HTTP 요청 메소드(GET, POST 등)인 특정 엔드포인트에 대한 클라이언트 요청에 애플리케이션이 응답하는 방법을 결정하는 것을 뜻함!
- Express의 장점 중 하나가 라우팅이 편리하다!

라우팅 예시
```
https://news/society
https://news/politics
https://news/sports/football
```

