pragma solidity ^0.4.4;

contract Left {
    address public right;

    function Left(address _right) {
        right = _right;
    }
}