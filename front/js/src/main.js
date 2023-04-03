// connection 확인 타이틀  page_title - content;
// @ 02 09 김유민
//index.html
const WsocketStatus = ["Connection", "Error", "Close"];
const ServerSocketMethodList = [
  "blockList",
  "getBlockByTransactionHashList",
  "latestBlock",
];

const networkTryObj = new NetworkTryObj("108.136.46.103", "5009");
window.onload = () => {
  networkTryObj.webSocketInit(async thisScope => {
    if (thisScope.connection === WsocketStatus[0]) {
      const resblocklist = await thisScope.sendMsgToSocket(["blockList", 10]);
      thisScope
        .sendMsgToSocket(["getBlockByTransactionHashList", 10])
        .then(data => {
          if (data.length) {
            const filterResultTransactionList = data.map((element, index) => {
              const { topics, address, transactionHash, data } = element;
              let obj = new Object();
              obj["from"] = decodingCurlOfResponseResult(topics[1], "address");
              obj["contract"] = address;
              obj["to"] = decodingCurlOfResponseResult(topics[2], "address");
              obj["hash"] = transactionHash;
              // console.log(obj.to.slice(2).match(/0/g).length);
              // if (
              //   obj.to.slice(2).match(/0/g).length === obj.to.slice(2).length
              // ) {
              //   obj["to"] = decodingCurlOfResponseResult(topics[3], "address");
              // } else {
              //   obj["value"] = decodingCurlOfResponseResult(data, "uint256");
              // }
              return obj;
            });
            console.log(filterResultTransactionList);
            mappingTranscationList(filterResultTransactionList);
          } else {
            document.getElementById("transactionListLoad").remove();
            document.getElementById("latestTransactions").innerHTML =
              "트랜잭션이 존재하지 않습니다.";
          }
        })
        .catch(error => {
          console.log(
            "getBlockByTransactionHashList 메소드 접근간에 오류가 발생하였습니다."
          );
          document.getElementById("transactionListLoad").remove();
          document.getElementById("latestTransactions").innerHTML =
            "트랜잭션이 존재하지 않습니다.";
          console.log(error);
        });
      if (resblocklist.length !== 0) mappingBlockList(resblocklist);
      else
        document.getElementById("latestBlocks").innerHTML =
          "블럭이 존재하지 않습니다.";
      // 0218
      //close Event
      // global_socket.WSsocket.close("4242");
    }
  });
};

//리펙토링 mappingData , mappingTransaction
function mappingData(jsonData, Dom, parsingData) {
  // console.log(jsonData);
}

function mappingBlockList(jsonData) {
  const mappingDom = jsonData.reduce((prev, cur, idx) => {
    const domElements = `
              <div class="flex-grow-1">
                  <p class="wallet-address text-dark">
                      miner :
                      <a class="text-eth" href ="./account_transaction_list.html?account=${
                        cur.miner
                      }">
                      ${cur.miner}
                      </a>
                  </p>
                  <p class="wallet-address text-dark">time : ${unixToDate(
                    cur.timestamp
                  )}
                  </p>
                   <p class="wallet-address text-dark">txs : ${
                     cur.transactions.length
                   }
                 
                  </p>
                  
              </div>
              <div class="text-right">
                    <h4>BlockNumber</h4>
                  <h4>
                  <a class="text-eth" href="./detail_block.html?bn=${
                    cur.number
                  }">
                  ${cur.number}
                  </h4>
              </div>
      `;
    const li = document.createElement("li");
    li.classList.add("d-flex");
    li.classList.add("blockListEle");
    li.innerHTML = domElements;
    prev.push(li);
    return prev;
  }, []);
  document.getElementById("blockListLoad").remove();
  document.getElementById("latestBlocks").append(...mappingDom);
}

function mappingTranscationList(jsonData) {
  const mappingDom = jsonData.reduce((prev, cur, idx) => {
    const domElements = `
            <span class="buy-thumb"><i class="la la-chevron-circle-down"></i></span>
            <div class="flex-grow-1">
                <p class="hash-tag wallet-address text-dark ">
                TX : 
                    <a class="text-eth" href="./detail_transaction.html?tx=${cur.hash}">${cur.hash}</a>
                </p>
                <p class="wallet-address text-dark hash-tag ">
                from : 
                <a class="text-eth" href="./account_transaction_list.html?account=${cur.from}">
                ${cur.from}
                </a>
                </p>
                <p class="wallet-address text-dark  hash-tag">to :
                <a class="text-eth" href="./account_transaction_list.html?account=${cur.to}">
                ${cur.to}
                </a>
                </p>
            </div>
            <div class="text-right ">
               
            </div>
      `;
    const li = document.createElement("li");
    li.classList.add("d-flex");
    li.innerHTML = domElements;
    prev.push(li);
    return prev;
  }, []);
  document.getElementById("transactionListLoad").remove();
  document.getElementById("latestTransactions").append(...mappingDom);
}
