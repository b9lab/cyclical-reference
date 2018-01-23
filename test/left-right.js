const Promise = require("bluebird");
const Left = artifacts.require("./Left.sol");
const Right = artifacts.require("./Right.sol");

const ethUtil = require('../node_modules/ethereumjs-util/');
web3.eth.makeSureAreUnlocked = require("../utils/makeSureAreUnlocked.js");
const sequentialPromise = require("../utils/sequentialPromise.js");

if (typeof web3.eth.getBlockPromise !== "function") {
    Promise.promisifyAll(web3.eth, { suffix: "Promise" });
}

contract('Left and Right', function(accounts) {
    let owner;
    let left;
    let right;

    before("should prepare accounts", function() {
        assert.isAbove(accounts.length, 1, "should have at least 1 account");
        owner = accounts[0];
        return web3.eth.makeSureAreUnlocked([ owner ]);
    });

    it("should have deployed with each other's address in migration", function() {
        return sequentialPromise([
                () =>  Left.deployed(),
                () => Right.deployed()
            ])
            .then(([ left, right ]) => sequentialPromise([
                    () => left.right(),
                    () => right.left()
                ])
                .then(([ rightAddress, leftAddress ]) => {
                    assert.strictEqual(rightAddress, right.address, "should have been the same right address");
                    assert.strictEqual(leftAddress, left.address, "should have been the same left address");
                }))
    });

    describe("Cyclical", function() {

        beforeEach("should deploy", function() {

            return web3.eth.getTransactionCountPromise(owner)
                .then(currentNonce => {
                    const futureLeftNonce = currentNonce;
                    const futureLeftAddress = ethUtil.bufferToHex(ethUtil.generateAddress(
                        owner, futureLeftNonce));
                    const futureRightNonce = futureLeftNonce + 1;
                    const futureRightAddress = ethUtil.bufferToHex(ethUtil.generateAddress(
                        owner, futureRightNonce));

                    return sequentialPromise([ 
                            () => Left.new(futureRightAddress),
                            () => Right.new(futureLeftAddress)
                        ]);
                })
                .then(createds => {
                    left = createds[0];
                    right = createds[1];
                });

        });

        it("should have each other's address", function() {

            return left.right()
                .then(rightAddress => assert.strictEqual(
                        rightAddress,
                        right.address,
                        "should have been the same right address")
                )
                .then(() => right.left())
                .then(leftAddress => assert.strictEqual(
                    leftAddress,
                    left.address,
                    "should have been the same left address"));

        });

    });

});
