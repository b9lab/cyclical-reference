const Promise = require("bluebird");
const Left = artifacts.require("./Left.sol");
const Right = artifacts.require("./Right.sol");
const ethUtil = require('../node_modules/ethereumjs-util/');
const sequentialPromise = require("../utils/sequentialPromise.js");

if (typeof web3.eth.getBlockPromise !== "function") {
    Promise.promisifyAll(web3.eth, { suffix: "Promise" });
}

module.exports = function(deployer, network, accounts) {

    return deployer
        .then(() => web3.eth.getTransactionCountPromise(accounts[0]))
        .then(currentNonce => {
            const futureLeftNonce = currentNonce;
            const futureLeftAddress = ethUtil.bufferToHex(ethUtil.generateAddress(
                accounts[0], futureLeftNonce));
            const futureRightNonce = futureLeftNonce + 1;
            const futureRightAddress = ethUtil.bufferToHex(ethUtil.generateAddress(
                accounts[0], futureRightNonce));

            return sequentialPromise([
                    () => deployer.deploy(Left, futureRightAddress),
                    () => deployer.deploy(Right, futureLeftAddress)
                ]);
        });

};
