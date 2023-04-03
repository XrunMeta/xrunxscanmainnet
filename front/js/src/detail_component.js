// @ 02 10 김유민
//detail_transaction.html
//detail_block.html
//account_transaction_list.html
const pathNames = [
  "detail_transaction",
  "detail_block",
  "account_transaction_list",
  "detail_contract",
];
const networkTryObj_Component = new NetworkTryObj("108.136.46.103", "5009");
window.onload = () => {
  const parsePathname = location.pathname.split("/");
  const [, queryString] = location.search.split("=");
  networkTryObj_Component.webSocketInit(async thisScope => {
    await pathNames.forEach(async value => {
      if (value === parsePathname[parsePathname.length - 1].split(".")[0]) {
        await strategyRefreshPage(thisScope, {
          socketRequetMethod: value,
          socketRequestParam: queryString,
        });
      }
    });
  });
};

async function strategyRefreshPage(
  networkObjScope,
  { socketRequetMethod, socketRequestParam }
) {
  if (socketRequetMethod === "account_transaction_list") {
    let responseData = await Web3GetPastLog({
      splitBlockNumber: 1.8,
      topics: [
        null,
        `0x000000000000000000000000${socketRequestParam.slice(2)}`,
      ],
    });
    let innerHTMLData = `
      <p>최근 500트랜잭션 조회간 관련 트랜잭션이 존재하지 않습니다.</p>
      `;
    if (responseData.length !== 0) {
      responseData = responseData.reverse();
      const transformResponseData = await Promise.all(
        responseData.map(
          async element =>
            await Web3GetTransactionReceipt(element.transactionHash)
        )
      );
      innerHTMLData = transformResponseData.reduce((prev, cur) => {
        if (cur.logs[0].topics.length > 2) {
          prev.push(
            innerHTMLOfCollect.accountListPagetableUI({
              from: decodingCurlOfResponseResult(
                cur.logs[0].topics[1],
                "address"
              ),
              to: decodingCurlOfResponseResult(
                cur.logs[0].topics[2],
                "address"
              ),
              contractAddress: cur.logs[0].address,
              transactionHash: cur.transactionHash,
              value: decodingCurlOfResponseResult(cur.logs[0].data, "uint256"),
              status: cur.status ? "Success" : "Failure",
            })
          );
          return prev;
        }
        return prev;
      }, []);
      innerHTMLData.unshift(innerHTMLOfCollect.startAccountListPageTableUI);
      innerHTMLData = innerHTMLData.join();
      innerHTMLData = innerHTMLData.replaceAll(",", "");
      innerHTMLData.trim() === ""
        ? (innerHTMLData =
            "<p>최근 500트랜잭션 조회간 관련 트랜잭션이 존재하지 않습니다.</p>")
        : innerHTMLData;
    }
    document.getElementById("tableUI").innerHTML = innerHTMLData;
  } else if (socketRequetMethod === "detail_contract") {
    getContractName(socketRequestParam).then(data => {
      document.getElementById("contractName").textContent = data;
    });
    getContractInfo(socketRequestParam).then(({ decimals, totalSupply }) => {
      totalSupply = Math.floor(
        Number.parseFloat(totalSupply).toFixed(2) / 100000000000000000
      );
      document.getElementById("contractTotalSupply").textContent =
        totalSupply.toLocaleString();
      document.getElementById("contractDecimals").textContent = decimals;
    });
    getContractInfo_NodeJS("xrunHolder", socketRequestParam).then(data => {
      document.getElementById("contractHolder").textContent = data.length;
    });

    let contractList = await getContractPastEvents({
      contractAddress: socketRequestParam,
      splitBlockNumber: 1.8,
    });
    contractList = contractList.reverse();
    let innerHTMLData =
      "<p>최근 500트랜잭션 조회간 관련 트랜잭션이 존재하지 않습니다.</p>";
    if (contractList.length !== 0) {
      innerHTMLData = await contractList.reduce(async (prevPromise, cur) => {
        const arr = await prevPromise.then();
        const { timestamp } = await web3.eth.getBlock(cur.blockNumber);
        arr.push(
          innerHTMLOfCollect.contractListPagetableUI({
            from: cur.returnValues["0"],
            to: cur.returnValues["1"],
            transactionHash: cur.transactionHash,
            blockNumber: cur.blockNumber,
            timestamp: unixToDate(timestamp),
            method: cur.event,
          })
        );
        return Promise.resolve(arr);
      }, Promise.resolve([]));
      innerHTMLData.unshift(innerHTMLOfCollect.startContractListPageTableUI);
      innerHTMLData = innerHTMLData.join();
      innerHTMLData = innerHTMLData.replaceAll(",", "");
      innerHTMLData.trim() === ""
        ? (innerHTMLData =
            "<p>최근 500트랜잭션 조회간 관련 트랜잭션이 존재하지 않습니다.</p>")
        : innerHTMLData;
    }

    document.getElementById("tableUI").innerHTML = innerHTMLData;
  } else {
    let responseData = await networkObjScope.sendMsgToSocket([
      socketRequetMethod,
      socketRequestParam,
    ]);
    if (socketRequetMethod === "detail_transaction") {
      responseData = filterDetailTransacationResposeData(responseData);
      const timestamp = await getDetailTransaction(
        socketRequestParam,
        responseData.blockNumber
      );
      responseData.timeStamp = timestamp;
    }
    mappingDetailTxAndBlockTable(responseData);
  }
}

function mappingDetailTxAndBlockTable(data) {
  const tbody = document.createElement("tbody");
  const jsonMappingDomList = Object.entries(data).reduce(
    (jsonPrev, jsonEle, index) => {
      const tr = document.createElement("tr");
      const tdList = jsonEle.reduce((prev, cur, idx) => {
        const td = document.createElement("td");
        td.setAttribute("class", "text-dark");
        if (cur === "gasPrice") cur = "xfee";
        let aTag = cur;
        if (
          (jsonEle[0] === "from" ||
            jsonEle[0] === "contractAddress" ||
            jsonEle[0] === "to") &&
          idx == 1
        ) {
          aTag = document.createElement("a");
          if (jsonEle[0] === "contractAddress") {
            aTag.setAttribute(
              "href",
              `./detail_contract.html?contract=${jsonEle[1]}`
            );
          } else {
            aTag.setAttribute(
              "href",
              `./account_transaction_list.html?account=${jsonEle[1]}`
            );
          }
          aTag.setAttribute("class", "text-eth");
          aTag.textContent = cur;
        }
        td.append(aTag);
        prev.push(td);
        return prev;
      }, []);
      tr.append(...tdList);
      jsonPrev.push(tr);
      return jsonPrev;
    },
    []
  );
  tbody.append(...jsonMappingDomList);
  document.getElementById("loading").remove();
  document.getElementById("detail_table").append(tbody);
}

function filterDetailTransacationResposeData(responseData) {
  const {
    transactionHash,
    gasUsed: gasPrice,
    to: contractAddress,
    logs,
    status,
  } = responseData;
  const { data, blockNumber, topics } = logs[0];
  const [, from, to] = topics;
  console.log(status);
  return {
    transactionHash,
    gasPrice,
    contractAddress,
    status: status.includes("1") ? "Success" : "Failure",
    value: decodingCurlOfResponseResult(data, "uint256"),
    from: decodingCurlOfResponseResult(from, "address"),
    to: decodingCurlOfResponseResult(to, "address"),
  };
}

//innerHTML 관련 문자열 객체
const innerHTMLOfCollect = {
  // 변경 필요
  accountListPagetableUI: ({
    from,
    to,
    status,
    transactionHash,
    contractAddress,
    value,
  }) => `
<tr>
<td class="text-dark hash-tag">
<a class="hash-tag text-eth" href="./detail_transaction.html?tx=${transactionHash}">${transactionHash}</a>
</td>
<td class="${
    status === "Success" ? "text-success" : "text-danger"
  }">${status}</td>
<td class="hash-tag text-dark"> ${value}</td>
<td class="hash-tag text-dark"><a class="text-eth" href="./detail_contract.html?contract=${contractAddress}">${contractAddress}</a></td>
<td class="hash-tag text-dark"><a class="text-eth" href="./account_transaction_list.html?account=${from}">${from}</a></td>
<td class="hash-tag text-dark" ><a class="text-eth" href="./account_transaction_list.html?account=${to}">${
    !to ? "Deploy Contract ERC20" : to
  }</a></td>
</tr>
`,
  contractListPagetableUI: ({
    transactionHash,
    blockNumber,
    timestamp,
    from,
    to,
    status = null,
    method,
  }) => `
<tr>
<td class="text-dark hash-tag">
<a class="hash-tag text-eth" href="./detail_transaction.html?tx=${transactionHash}">${transactionHash}</a>
</td>
<td class="hash-tag text-dark"> ${blockNumber}</td>
<td class="hash-tag text-dark">${timestamp}</td>
<td class="hash-tag text-dark"><a class="text-eth" href="./account_transaction_list.html?account=${from}">${from}</a></td>
<td class="hash-tag text-dark" ><a class="text-eth" href="./account_transaction_list.html?account=${to}">${
    !to ? "Deploy Contract ERC20" : to
  }</a></td>
<td class="hash-tag  ${!status ? "text-success" : "text-dark"} ">${
    !status ? "Suceess" : "Failure"
  }</td>
<td class="hash-tag text-dark">${method}</td>
</tr>
`,
  startAccountListPageTableUI: `
<tr>
<td class="text-dark hash-tag"> txs</td>
<td class="text-dark">status</td>
<td class="text-dark">value</td>
<td class="text-dark">contractAddress</td>
<td class="text-dark">from</td>
<td class="text-dark" >to</td>
</tr>
`,
  startContractListPageTableUI: `
<tr>
<td class="text-dark hash-tag">txs</td>
<td class="text-dark">blockNumber</td>
<td class="text-dark">timestamp</td>
<td class="text-dark">from</td>
<td class="text-dark">to</td>
<td class="text-dark">status</td>
<td class="text-dark">method</td>
</tr>
`,
};

// @Deprecated
// contract name , token 정보 제공
async function mappingAccountInfo(networkObjScope, fromHash, contractHash) {
  const JSON_RPCdata_ContractName = encodingCurlOfRequestParam(
    web3,
    {
      method: "name",
      fromHash,
      contractHash,
    },
    ERC20_abi
  );
  const JSON_RPCdata_ContractGetBalance = encodingCurlOfRequestParam(
    web3,
    {
      method: "balanceOf",
      fromHash,
      contractHash,
      data: [fromHash],
    },
    ERC20_abi
  );

  let contractName = await networkObjScope.sendMsgToSocketParamJSON([
    "curl_JSON_RPC",
    JSON_RPCdata_ContractName,
  ]);
  contractName = decodingCurlOfResponseResult(contractName, "string");
  let contractToken = await networkObjScope.sendMsgToSocketParamJSON([
    "curl_JSON_RPC",
    JSON_RPCdata_ContractGetBalance,
  ]);
  contractToken = decodingCurlOfResponseResult(contractToken, "uint256");

  return { contractName, contractToken };
}
