const Left = artifacts.require("./Left.sol");
const Right = artifacts.require("./Right.sol");
const ethJsUtil = require('../node_modules/ethereumjs-util/');
Extensions = require("../utils/extensions.js");
Extensions.init(web3, {});

module.exports = function(deployer) {

    var account0;

    return deployer
        .then(() => web3.eth.getAccountsPromise())
        .then(accounts => {
            account0 = accounts[0];
            return web3.eth.getTransactionCountPromise(account0);
        })
        .then(currentNonce => {
            var futureLeftNonce = currentNonce;
            var futureLeftAddress = ethJsUtil.bufferToHex(ethJsUtil.generateAddress(
                account0, futureLeftNonce));
            var futureRightNonce = futureLeftNonce + 1;
            var futureRightAddress = ethJsUtil.bufferToHex(ethJsUtil.generateAddress(
                account0, futureRightNonce));

            deployer.deploy(Left, futureRightAddress);
            deployer.deploy(Right, futureLeftAddress);
        });

};
