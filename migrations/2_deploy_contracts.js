module.exports = function(deployer) {
    var ethJsUtil = require('../node_modules/ethereumjs-util/');

    var currentNonce = web3.eth.getTransactionCount(web3.eth.accounts[0]);
    var futureLeftNonce = currentNonce;
    var futureLeftAddress = ethJsUtil.bufferToHex(ethJsUtil.generateAddress(
        web3.eth.accounts[0], futureLeftNonce));
    var futureRightNonce = futureLeftNonce + 1;
    var futureRightAddress = ethJsUtil.bufferToHex(ethJsUtil.generateAddress(
        web3.eth.accounts[0], futureRightNonce));

    deployer.deploy(Left, futureRightAddress);
    deployer.deploy(Right, futureLeftAddress);
};
