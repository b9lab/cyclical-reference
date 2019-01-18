pragma solidity >=0.4.25 <0.6.0;

contract Right {
    address public left;

    constructor(address _left) public {
        left = _left;
    }   
}