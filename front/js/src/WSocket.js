//전역 접근을 위한 socket 변수
let global_socket = null;

class NetworkTryObj {
  constructor(address, port) {
    this.locationAddress = address;
    this.locationPort = port;
    this.WSsocket;
    this.deadSocket;
    this.setTimer;
    this.connection;
  }

  ObservingWSSocket = () => {
    // if (this.WSSocketValidConnect()) {
    if (this.deadSocket) {
      clearInterval(this.setTimer);
    }
    this.setTimer = setInterval(() => {
      console.log("ObservingWSSocket connection");
      if (this.deadSocket) {
        this.webSocketInit();
      } else {
        this.WSsocket.onclose = e => {
          console.log("Try to WSocketConnection");
          this.connection = "Close";
          this.deadSocket = true;
          this.webSocketInit();
        };
        this.WSsocket.onerror = function (error) {
          this.connection = "Connect";
          console.log("ObservingWSSocket connection error");
          this.deadSocket = true;
          this.webSocketInit();
        };
      }
    }, 2000);
    // }
  };

  webSocketInit = callback => {
    console.log("webSocketInit");
    const classScope = this;
    let socket = new WebSocket(
      `ws://${this.locationAddress}:${this.locationPort}`
      // `wss://${this.locationAddress}:${this.locationPort}`
    );
    socket.onopen = function (e) {
      classScope.WSsocket = socket;
      classScope.setWSocketObjMember(
        "Connection",
        false,
        classScope,
        socket,
        callback
      );
    };
    socket.onerror = function (error) {
      classScope.setWSocketObjMember("Error", true, classScope, null, callback);
    };
  };
  // @Param 1차 배열
  sendMsgToSocket = param => {
    return new Promise((res, rej) => {
      if (typeof param !== "object") {
        rej("인자값 오류 format [ '배열' ]");
      }
      const requestData = param.length !== 0 ? param.join(",") : param[1];
      if (this.WSSocketValidConnect()) {
        this.WSsocket.send(requestData);
        this.WSsocket.onmessage = event => {
          console.log("sendMsgToSocket Method");
          let parseData = JSON.parse(event.data);
          if (typeof parseData === "string") parseData = JSON.parse(parseData);
          res(parseData);
        };
      }
    });
  };

  // @Param 1차 배열
  sendMsgToSocketParamJSON = param => {
    return new Promise((res, rej) => {
      if (typeof param !== "object") {
        rej("인자값 오류 format [ '배열' ]");
      }
      if (param.length < 2) {
        rej("최소 길이가 2이상이여야 합니다");
      }
      const requestData = param.length !== 0 ? param.join("/") : param[1];
      if (this.WSSocketValidConnect()) {
        this.WSsocket.send(requestData);
        this.WSsocket.onmessage = event => {
          console.log("sendMsgToSocket Method");
          let parseData = JSON.parse(event.data);
          if (typeof parseData === "string") parseData = JSON.parse(parseData);
          res(parseData.result);
        };
      }
    });
  };

  WSSocketValidConnect = () => {
    if (this.WSsocket) {
      return true;
    } else {
      console.log("Not connection socket");
      return false;
    }
  };

  setWSocketObjMember = (
    connectionName,
    deadSocket,
    scope,
    setData,
    callback
  ) => {
    console.log(
      `============[${connectionName}]Set Socekt Information==============`
    );
    scope.deadSocket = deadSocket;
    scope.connection = connectionName;
    clearInterval(scope.setTimer);
    if (typeof callback === "function") {
      global_socket = scope;
      callback(scope);
    } else global_socket = setData;
    scope.ObservingWSSocket();
  };
}
