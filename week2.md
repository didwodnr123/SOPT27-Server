### week2

## Contents
01. [Node.js](#nodejs)
02. [Flow Control](#flowcontrol)
03. [Module](#module)

<!--nodejs-->
## Node.js

- 자바스크립트 기반 서버 플랫폼
- 이벤트 기반
- 싱글 스레드 기반
- non-blocking I/O
- 비동기 방식

> 프로그램 언어  ❌
>
> 프레임워크  ❌
>
> **자바스크립트를 실행시키는 *런타임 환경***  ⭕️

**Express**

- NodeJS 기반의 웹 어플리케이션 ***프레임 워크***
- 서버를 구축하기 쉽게 틀을 제공

**Event-Driven**

- 이벤트가 발생할 때, 미리 지정해둔 작업을 수행하는 방식

![스크린샷 2020-09-02 오후 10 04 54](https://user-images.githubusercontent.com/56633607/91986986-6380f980-ed68-11ea-9d87-4efc0e0e5b6e.png)

> 출처 : Node.js 공식 홈페이지

<!--flowcontrol-->

## Flow Control (흐름 제어)

***Blocking & Non-Blocking?***

**Blocking (동기)**

- 요청을 하고 완료를 할 때 까지 기다리는 방식
- 백그라운드 작업 완료 여부를 계속 확인

**Non-Blocking (비동기)**

- I/O 작업이 진행되는 동안 작업이 멈추지 않고 다음 작업 수행
- **요청을 하고 바로 제어권을 돌려 받는 방식**

> Blocking

```javascript
var fs = require("fs");
var data = fs.readFileSync('input.txt');

console.log(data.toString());
console.log("Program Ended");		
```

> result

```
this is a sample text
Program Ended
```

> Non-Blocking

```javascript
var fs = require("fs");

fs.readFile('input.txt', function (err, data) {
   if (err) return console.error(err);
   console.log(data.toString());
});

console.log("Program Ended");
```

> result

``` 
Program Ended
this is a sample text
```

**Promise**

- ES6부터 공식적으로 포함된 흐름 제어 패턴
- 내부적 예외처리 구조

> Fulfilled (이행)

```javascript
new Promise(function(resolve, reject) {
	resolve();
})
```

> Rejected (실패)

```javascript
new Promise(function(resolve, reject){	
	reject();
})
```

> practice

```javascript
let isMomHappy = false;
let phone = {
    brand: 'Samsung',
    color: 'black'
}

var willIGetNewPhone = new Promise((resolve, reject) => {
    if(isMomHappy){
        resolve(console.log(phone));
    }else{
        //reject(console.error());
        reject(console.log(new Error('Mom is not happy')))
    }
})
```

**Async**

- ES7부터 지원하는 자바스크립트 비동기 패턴
- 장황한 **promise** 코드를 한번 더 깔끔하게 줄여줌
- 동기 코드와 매---우 유사함

> Async

- promise를 사용하지 않고도 효과적으로 콜백헬 해결
- **async는 암묵적으로 promise를 반환**

> Await

- promise를 기다림 (성공 or 실패)
- async로 정의된 내부에서만 사용 가능

<!--module-->

- 독립된 기능을 하는 함수나 변수들의 집합
- 모듈 자체가 하나의 프로그램이면서 다른 프로그램의 **부품**으로 사용할 수 있음
- 재사용에 용이함
- Node에서는 각 파일을 모듈화, **1파일 = 1모듈**
