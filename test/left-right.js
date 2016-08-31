contract('Left and Right', function(accounts) {

  it("should have each other's address", function() {
    var left = Left.deployed();
    var right = Right.deployed();

    return left.right()
      .then(function(rightAddress) {
        assert.equal(rightAddress, right.address, "should have been the same right address");
        return right.left();
      })
      .then(function(leftAddress) {
        assert.equal(leftAddress, left.address, "should have been the same left address");
      });
  });

});
