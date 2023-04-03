// @Webpack 5 >> @webpack4
// https://stackoverflow.com/questions/70429654/webpack-5-errors-cannot-resolve-crypto-http-and-https-in-reactjs-proje
// @webpack4 ts-loader 8.2.0
// https://stackoverflow.com/questions/68016372/webpack-ts-loader-error-loadercontext-getoptions-is-not-a-function
// @Webpack config
//https://stackoverflow.com/questions/67448791/webpack-import-web3-cant-find-module-http
import Web3 from "web3";
import { Eth, Transaction } from "web3-eth";
import { Contract } from "web3-eth-contract";
import { ERC20_abi } from "./ERC20Data";
const userList = [
  "0x3C9b507678E0C7C6390D696453e4739DA2a5BC44",
  "0xb343D82744514B03f81eB00fF18bb7C4ADc1a9DF",
];
(async () => {
  console.log("ts File loading...");
  const web3 = new Web3();
  web3.setProvider(
    new Web3.providers.HttpProvider("http://54.169.135.228:5006")
  );
  const { eth } = web3;
  const contract = await new eth.Contract(
    ERC20_abi,
    "0xBc7AC585B862AA8c693b22d924C28B9cB6D36f0A",
    {
      from: "0x3C9b507678E0C7C6390D696453e4739DA2a5BC44",
    }
  );
  const owner = await eth.getCoinbase();
  // contract.methods
  //   .name()
  //   .call()
  //   .then((data: any) => console.log(data))
  //   .catch((error: any) => {
  //     console.log(error);
  //   });
  // contract.methods
  //   .symbol()
  //   .call()
  //   .then((data: any) => console.log(data))
  //   .catch((error: any) => {
  //     console.log(error);
  //   });
  // var batch = new eth.BatchRequest();
  // const currentBlock = await eth.getBlockNumber();

  // batch.add(
  //   (eth.getBlock as any).request(currentBlock, (data: any) => {
  //     console.log(data);
  //   })
  // );
  // batch.execute();
  await transfer_test_func({
    eth,
    contract,
    userList,
    tokenFrom: owner,
    password: "1234",
  });
  // getTransactionList({ eth })
  //   .then(data => console.log(data))
  //   .catch(error => {
  //     console.log(error);
  //   });
})();
async function transfer_test_func({
  eth,
  contract,
  userList,
  tokenFrom,
  password,
}: {
  eth: Eth;
  contract: Contract;
  userList: string[];
  tokenFrom: string;
  password: string;
}) {
  try {
    await eth.personal.unlockAccount(tokenFrom, password, 600);
    let UserTokenList = userList.map(
      async v => await contract.methods.balanceOf(v).call()
    );
    const data = await Promise.all(UserTokenList);
    console.log("=======beforeUserToken=======\n", data);
    await contract.methods
      .transfer("0xb343D82744514B03f81eB00fF18bb7C4ADc1a9DF", 100000)
      .send({
        from: "0x3C9b507678E0C7C6390D696453e4739DA2a5BC44",
      })
      .then(async (result: any) => {
        console.log(result);
      })
      .catch((err: any) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
}

async function getTransactionList({
  eth,
  offsetBlockNumber,
}: {
  eth: Eth;
  offsetBlockNumber?: number;
}): Promise<Transaction[]> {
  const list = [];
  const setHashtx = new Set();
  let blockNumber = !offsetBlockNumber
    ? await eth.getBlockNumber()
    : offsetBlockNumber;
  while (list.length !== 20) {
    const currentBlock = await eth.getBlock(blockNumber);
    console.log(currentBlock.number, list);
    if (currentBlock && currentBlock.transactions.length !== 0) {
      currentBlock.transactions.forEach(v => setHashtx.add(v));
      list.push(...currentBlock.transactions);
    }
    blockNumber--;
  }
  console.log("list size ", list.length);
  console.log("setHashtx  size", setHashtx.size);
  const data = list.map(
    v => new Promise<Transaction>(res => res(eth.getTransaction(v)))
  );
  return await Promise.all(data);
}
