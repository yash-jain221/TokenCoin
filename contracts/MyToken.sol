//SPDX-License-Identifier: MIT
pragma solidity 0.8.6;
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("STARDUCKS CAFE", "SHIV") {
        _mint(msg.sender, initialSupply);
    }
}
