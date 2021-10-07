const TokenSale = artifacts.require("MyTokenSale");
const Token = artifacts.require("MyToken");
const Kyc = artifacts.require("kyc.sol");

const chai = require("./setupchai")
const BN = web3.utils.BN

const expect = chai.expect
require("dotenv").config({path: "../.env"});

contract("TokenSale Test", async (accounts)=>{

    const [deployerAccount, recipient, anotherAccount] = accounts;
    
    it('should not have any tokens in my deployerAccount', async ()=>{
        let instance = await Token.deployed();
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it('all Tokens should be in token sale smart contract by default', async ()=>{
        let instance = await Token.deployed();
        let balanceOfTokenSale = await instance.balanceOf(TokenSale.address);
        let totalSupply = await instance.totalSupply()

        expect(balanceOfTokenSale).to.be.a.bignumber.equal(totalSupply);
    })

    it("should be possible to buy tokens",async ()=>{
        let instance = await Token.deployed();
        let TokenSaleInstance = await TokenSale.deployed();
        let kycInstance = await Kyc.deployed();
        let balanceBefore = await instance.balanceOf(deployerAccount);
        await kycInstance.setKycCompleted(deployerAccount,{from: deployerAccount});
        expect(TokenSaleInstance.sendTransaction({from: deployerAccount,value: web3.utils.toWei("1","wei")})).to.be.fulfilled;
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceBefore);
    })

});

