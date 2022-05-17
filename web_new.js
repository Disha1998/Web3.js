// const Web3 = require("web3");
var Contract = require('web3-eth-contract');
Contract.setProvider('ws://localhost:8546');


solc = require("solc"); //for generating ABI or bytecode we need of Compiler --that is "solc"  compiler   ---Solidity ke smart contract ko Compile karta hai
fs = require("fs");  // for read the 'demo.sol' file (for read smart contract)
Web3 = require("web3");

let web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));


let fileContent = fs.readFileSync("demo.sol").toString();

console.log(fileContent, "<-----Filecontent");


// input For Solc compiler  

var input = {
    language: "Solidity",
    sources: {
        "demo.sol": {
            content: fileContent,

        },
    },
    settings: {
        outputSelection: {
            "*": {
                "*": ["*"],
            },
        },
    },
};

var output = JSON.parse(solc.compile(JSON.stringify(input)));
console.log(output, "output");

ABI = output.contracts["demo.sol"]["demo"].abi;
bytecode = output.contracts["demo.sol"]["demo"].evm.bytecode.object;

console.log("abi :", ABI);
console.log("bytecde :", bytecode);

contract = new web3.eth.Contract(ABI);

let defaultAcc;
web3.eth.getAccounts().then((accounts) => {
    console.log("Accounts :", accounts);
    defaultAcc = accounts[0];
    console.log("defaultAcc==>", defaultAcc);

    contract.deploy({ data: bytecode })
        .send({ from: defaultAcc, gas: 500000 })
        .on("receipt", (receipt) => {
            console.log("Contract Address : ", receipt.contractAddress);
        })
        .then((demoContract) => {
            demoContract.methods.x().call((err, data) => {
                console.log("Initial Value", data);
            });
        });
});