const Left = artifacts.require("./Left.sol");
const Right = artifacts.require("./Right.sol");

ethJsUtil = require('../node_modules/ethereumjs-util/');
Extensions = require("../utils/extensions.js");
Extensions.init(web3, assert);

contract('Left and Right', function(accounts) {
    var owner;
    var left;
    var right;

    before("should prepare accounts", function() {
        assert.isAbove(accounts.length, 1, "should have at least 1 account");
        owner = accounts[0];
        return Extensions.makeSureAreUnlocked([ owner ]);
    });

    describe("Cyclical", function() {

        beforeEach("should deploy", function() {

            return web3.eth.getTransactionCountPromise(owner)
                .then(currentNonce => {
                    var futureLeftNonce = currentNonce;
                    var futureLeftAddress = ethJsUtil.bufferToHex(ethJsUtil.generateAddress(
                        owner, futureLeftNonce));
                    var futureRightNonce = futureLeftNonce + 1;
                    var futureRightAddress = ethJsUtil.bufferToHex(ethJsUtil.generateAddress(
                        owner, futureRightNonce));

                    return Promise.all([ 
                            Left.new(futureRightAddress),
                            Right.new(futureLeftAddress)
                        ]);
                })
                .then(createds => {
                    left = createds[0];
                    right = createds[1];
                });

        });

        it("should have each other's address", function() {

            return left.right()
                .then(rightAddress => {
                    assert.equal(
                        rightAddress,
                        right.address,
                        "should have been the same right address");
                    return right.left();
                })
                .then(leftAddress => assert.equal(
                    leftAddress,
                    left.address,
                    "should have been the same left address"));

        });

    });

});
