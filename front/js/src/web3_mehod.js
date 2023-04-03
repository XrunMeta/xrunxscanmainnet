let web3 = new Web3();
const gethIPAddresss = "http://108.136.46.103:5006";
const deployContractAddrress = "0xE069c88a7aa76f8D9E82a861b02aF57F97eff6A7";
web3.setProvider(new web3.providers.HttpProvider(gethIPAddresss));
const ERC20_abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "initialSupply",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "tokenName",
        type: "string",
      },
      {
        internalType: "string",
        name: "tokenSymbol",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approveAndCall",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "_spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "ApproveByNFT",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Burn",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "target",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "limitBalance",
        type: "uint256[]",
      },
      {
        internalType: "bool",
        name: "freeze",
        type: "bool",
      },
    ],
    name: "multiLimit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "bool",
        name: "set",
        type: "bool",
      },
    ],
    name: "setAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_until",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_frozen",
        type: "bool",
      },
    ],
    name: "TESTsetlimit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_creatorAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_customerAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "TransferByNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "TransferFromByNFT",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "administrators",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
    ],
    name: "BalanceOfERC20Token",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "frozen",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "limitation",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "limitUntil",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "testTimeNow",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
//Define eth base Method
async function getBalance(owner) {
  const { eth } = web3;
  return await eth.getBalance(owner);
}
//
async function Web3GetPastLog({
  fromBlock = null,
  toBlock = null,
  topics = null,
  contractAddrres = null,
  splitBlockNumber = null,
  validSplitBlockNumber = false,
}) {
  const { eth } = web3;
  splitBlockNumber !== null ? splitBlockNumber : (splitBlockNumber = 5);
  toBlock !== null ? toBlock : (toBlock = await eth.getBlockNumber());
  if (!validSplitBlockNumber) fromBlock !== null ? fromBlock : (fromBlock = 0);
  else
    fromBlock !== null
      ? fromBlock
      : (fromBlock = Math.floor(toBlock / splitBlockNumber));
  let getAccountListLogs = null;
  getAccountListLogs = await eth.getPastLogs({
    fromBlock,
    toBlock,
    address: contractAddrres,
    topics,
  });
  if (getAccountListLogs.length === 0) {
    const [, from] = topics;
    getAccountListLogs = await eth.getPastLogs({
      fromBlock,
      toBlock,
      address: contractAddrres,
      topics: [null, null, from],
    });
  }
  return getAccountListLogs;
}
async function Web3GetTransactionReceipt(txh) {
  return web3.eth.getTransactionReceipt(txh);
}
async function getDetailTransaction(txs, BN = null) {
  const { eth } = web3;
  let currentBlockNumber;
  if (!BN) {
    const { blockNumber } = await eth.getTransactionReceipt(txs);
    currentBlockNumber = blockNumber;
  } else {
    currentBlockNumber = BN;
  }
  const { timestamp } = await eth.getBlock(currentBlockNumber);
  return unixToDate(timestamp);
}
//Define contract Method
async function transfer_test_func({
  eth,
  contract,
  userList,
  tokenFrom,
  password,
}) {
  try {
    await eth.personal.unlockAccount(tokenFrom, password);
    let UserTokenList = userList.map(
      async v => await contract.methods.balanceOf(v).call()
    );
    const data = await Promise.all(UserTokenList);
    await contract.methods
      .transfer("0xb343D82744514B03f81eB00fF18bb7C4ADc1a9DF", 6)
      .send({
        from: "0x3C9b507678E0C7C6390D696453e4739DA2a5BC44",
      })
      .then(async result => {
        userList.map(async v => await contract.methods.balanceOf(v).call());
        const data = await Promise.all(UserTokenList);
      })
      .catch(err => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
}
async function deployContract() {
  let web3 = new Web3(Web3.givenProvider || gethIPAddresss);
  web3.setProvider(new web3.providers.HttpProvider(gethIPAddresss));
  const source = await fs.readFile("./contract.json");
  const { abi, bytecode } = JSON.parse(source)["contract"];
  const XRUNContract = new web3.eth.Contract(abi);
  try {
    await web3.eth.personal.unlockAccount(
      "0x3c9b507678e0c7c6390d696453e4739da2a5bc44",
      "1234"
    );
    var block = await web3.eth.getBlock("latest");
    XRUNContract.deploy({
      data: bytecode,
      arguments: [99999999999, "XRUN_NodeDeploy", "XRUN_NodeDeploySym"],
    })
      .send(
        {
          from: "0x3C9b507678E0C7C6390D696453e4739DA2a5BC44",
          gas: 8000000,
          gasPrice: "8000000",
          //Returned error: tx fee (45.00 ether) exceeds the configured cap (1.00 ether) >> 가스값 에러
        },
        function (error, transactionHash) {
          if (error) throw console.log(error);
          console.log(transactionHash);
        }
      )
      .on("error", function (error) {
        console.log(error);
      })
      .on("transactionHash", function (transactionHash) {
        console.log("transactionHash");
        console.log(transactionHash);
      })
      .on("receipt", function (receipt) {
        console.log("receipt");
        console.log(receipt.contractAddress); // contains the new contract address
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        console.log("confirmation");
        console.log(confirmationNumber, receipt);
      })
      .then(function (newContractInstance) {
        console.log("deploy contract");
        console.log(newContractInstance.options.address); // instance with the new contract address
      });
  } catch (error) {
    console.log("Error unLock Error");
  }
  //eth.sendTransaction({from:eth.accounts[1],to: eth.accounts[0],value:web3.toWei(100,`ether`)})
}
async function ConnectTestContract() {
  let web3 = new Web3(Web3.givenProvider);
  web3.setProvider(new web3.providers.HttpProvider(gethIPAddresss));
  const { eth } = web3;
  eth.Contract.setProvider(gethIPAddresss);
  const contract = await new eth.Contract(ERC20_abi, deployContractAddrress, {
    from: "0x3C9b507678E0C7C6390D696453e4739DA2a5BC44",
  });
  const owner = await eth.getCoinbase();
  const userList = [
    "0x3C9b507678E0C7C6390D696453e4739DA2a5BC44",
    "0xb343D82744514B03f81eB00fF18bb7C4ADc1a9DF",
  ];
}
async function getContractName(contractAddress) {
  const { eth } = web3;
  eth.Contract.setProvider(gethIPAddresss);
  const contract = await new eth.Contract(ERC20_abi, contractAddress);
  return contract.methods.name().call();
}
async function getContractPastEvents({
  contractAddress = null,
  contractMethodName = null,
  fromBlock = null,
  toBlock = null,
  topics = null,
  splitBlockNumber = null,
  validSplitBlockNumber = false,
}) {
  const { eth } = web3;
  splitBlockNumber !== null ? splitBlockNumber : (splitBlockNumber = 5);
  toBlock !== null ? toBlock : (toBlock = await eth.getBlockNumber());
  if (!validSplitBlockNumber) fromBlock !== null ? fromBlock : (fromBlock = 0);
  else
    fromBlock !== null
      ? fromBlock
      : (fromBlock = Math.floor(toBlock / splitBlockNumber));
  const contract = await new eth.Contract(ERC20_abi, contractAddress);
  console.log(fromBlock, toBlock);
  return contract.getPastEvents(contractMethodName, {
    fromBlock,
    toBlock,
    topics,
  });
}
async function getContractInfo(contractAddress) {
  const { eth } = web3;
  eth.Contract.setProvider(gethIPAddresss);
  const contract = await new eth.Contract(ERC20_abi, contractAddress);
  const decimals = await contract.methods.decimals().call();
  const totalSupply = await contract.methods.totalSupply().call();
  return { decimals, totalSupply };
}
//Convert response and request data
function encodingCurlOfRequestParam(
  web3,
  { method, fromHash, contractHash, data = "" },
  abi
) {
  const requestJSONRPCFormat = {
    jsonrpc: "2.0",
    id: Math.floor(Math.random() * 10),
    method: "",
    params: [
      {
        data: "",
        from: `${fromHash}`,
        to: `${contractHash}`,
      },
    ],
  };

  const sendTransactionMethodList = ["transfer", "allowance", "burn"];
  const findABIByMethodName = abi.find(v => v.name === method);
  if (findABIByMethodName === undefined) {
    console.log("Method명을 확인해주세요");
    return;
  }
  if (sendTransactionMethodList.includes(method)) {
    requestJSONRPCFormat["method"] = "eth_sendTransaction";
    requestJSONRPCFormat["params"][0].data = web3.eth.abi.encodeFunctionCall(
      findABIByMethodName,
      data
    );
    requestJSONRPCFormat["params"][0]["gasPrice"] = "0x3b9aca00";
  } else {
    requestJSONRPCFormat["method"] = "eth_call";
    requestJSONRPCFormat["params"].push("latest");
    if (findABIByMethodName.inputs.length !== 0) {
      requestJSONRPCFormat["params"][0].data = web3.eth.abi.encodeFunctionCall(
        findABIByMethodName,
        data
      );
    } else {
      requestJSONRPCFormat["params"][0].data =
        web3.eth.abi.encodeFunctionSignature(findABIByMethodName);
    }
  }
  return JSON.stringify(requestJSONRPCFormat);
}

function decodingCurlOfResponseResult(data, convertType) {
  return web3.eth.abi.decodeParameter(convertType, data);
}

function unixToDate(date) {
  var time = new Date(date * 1000),
    month = time.getMonth() + 1,
    day = time.getDate(),
    year = time.getFullYear(),
    hour = time.getHours(),
    min = time.getMinutes();
  res = year + "." + month + "." + day + "  " + hour + ":" + min;

  return res;
}
//NodeJS
async function getContractInfo_NodeJS(param1, param2) {
  console.log("getContractInfo_NodeJS");
  let socket = new WebSocket("ws://108.136.46.103:5010");
  return new Promise((Socketres, Socketrej) => {
    socket.onopen = function (e) {
      socket.send(param1);
      socket.onmessage = event => {
        console.log("NodeJS Socket Method");
        let parseData = JSON.parse(event.data);
        if (typeof parseData === "string") parseData = JSON.parse(parseData);
        Socketres(parseData.result);
      };
    };
  });
}
//Test Code
async function getAccountTransactionList(data) {
  return await data.reduce(async (prev, cur) => {
    let deployContractName = "";
    if (cur.address) {
      deployContractName = await getContractName(cur.address);
    }
    var arr = await prev.then();
    arr.push(
      tableUI({
        deployContractName,
        contractAddress: cur.address,
        from: decodingCurlOfResponseResult(cur.topics[1], "address"),
        to: decodingCurlOfResponseResult(cur.topics[2], "address"),
      })
    );
    return Promise.resolve(prev);
  }, Promise.resolve([]));
}
