// SPDX-License-Identifier: MIT
pragma solidity 0.8.8;
import "hardhat/console.sol";

contract Hello {
    uint8 constant INITIAL_VALUE  = 23;
   

    function hello() external pure returns(string memory _hello) {
        _hello = "Hello";
    }

    function logValue() external view returns(uint8 x) {
        x = INITIAL_VALUE;
        console.log(INITIAL_VALUE);
    }
}