pragma solidity >=0.4.25 <0.6.0;

contract Left {
    address public right;

    constructor(address _right) public {
        right = _right;
    }
}