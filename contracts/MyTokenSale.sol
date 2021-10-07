//SPDX-License-Identifier: MIT
pragma solidity 0.8.6;
import './CrowdSale.sol';
import './kyc.sol';
contract MyTokenSale is CrowdSale{
    KYC kyc;
    constructor(
        uint256 rate,
        address payable wallet,
        ERC20 token,
        KYC _kyc
    ) CrowdSale(rate, wallet, token)
    {
        kyc = _kyc;
    }

    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal override virtual{
        super._preValidatePurchase(_beneficiary,_weiAmount);
        require(kyc.KycCompleted(msg.sender) ,"KYC is not completed");
    }
    
}