//SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

import '../node_modules/@openzeppelin/contracts/access/Ownable.sol';

contract KYC is Ownable{
    mapping (address=>bool) allowed;

    function setKycCompleted(address _addr) public onlyOwner{
        allowed[_addr] = true;
    }

    function setKycRevoked(address _addr) public onlyOwner{
        allowed[_addr] = false;
    }

    function KycCompleted(address addr) public view returns(bool) {
        return allowed[addr];
    }

}
