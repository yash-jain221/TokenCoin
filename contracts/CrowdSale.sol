//SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

contract CrowdSale {
    using SafeMath for uint256;

    // The token being sold
    ERC20 public token;

    // Address where funds are collected
    address payable public  wallet;

    // How many token units a buyer gets per wei
    uint256 public rate;

    // Amount of wei raised
    uint256 public weiRaised;

    event TokenPurchase(
        address indexed purchaser,
        address indexed beneficiary,
        uint256 value,
        uint256 amount
    );

    constructor(
        uint256 _rate,
        address payable _wallet,
        ERC20 _token
    ) {
        require(_rate > 0);
        require(_wallet != address(0));
        require(address(_token) != address(0));

        rate = _rate;
        wallet = _wallet;
        token = _token;
    }

    receive() external payable {
        buyTokens(msg.sender);
    }

    function buyTokens(address _beneficiary) public payable {
        uint256 weiAmount = msg.value;
        _preValidatePurchase(_beneficiary, weiAmount);

        // calculate token amount to be created
        uint256 tokens = _getTokenAmount(weiAmount);

        // update state
        weiRaised = weiRaised.add(weiAmount);

        _processPurchase(_beneficiary, tokens);
        emit TokenPurchase(msg.sender, _beneficiary, weiAmount, tokens);

        _updatePurchasingState(_beneficiary, weiAmount);

        _forwardFunds();
        _postValidatePurchase(_beneficiary, weiAmount);
    }

    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount)
        internal
        virtual
    {
        require(_beneficiary != address(0));
        require(_weiAmount != 0);
    }

    function _postValidatePurchase(address _beneficiary, uint256 _weiAmount)
        internal
        virtual
    {
        // optional override
    }

    function _deliverTokens(address _beneficiary, uint256 _tokenAmount)
        internal
        virtual
    {
        token.transfer(_beneficiary, _tokenAmount);
    }

    function _processPurchase(address _beneficiary, uint256 _tokenAmount)
        internal
        virtual
    {
        _deliverTokens(_beneficiary, _tokenAmount);
    }

    function _updatePurchasingState(address _beneficiary, uint256 _weiAmount)
        internal
        virtual
    {
        // optional override
    }

    function _getTokenAmount(uint256 _weiAmount)
        internal
        view
        returns (uint256)
    {
        return _weiAmount.mul(rate);
    }

    function _forwardFunds() internal virtual {
        wallet.transfer(msg.value);
    }
}
