const Token = artifacts.require("MyToken");

const chai = require("./setupchai");
const BN = web3.utils.BN

const expect = chai.expect
require("dotenv").config({path: "../.env"});

contract("Token Test", async (accounts)=>{

    const [deployerAccount, recipient, anotherAccount] = accounts;
    beforeEach(async ()=>{
        this.Token = await Token.new(process.env.INITIAL_TOKEN);
    })

    it("all tokens should be in my account", async ()=>{
        let instance = this.Token;
        let totalSupply = await instance.totalSupply();
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    })

    it("is possible to send tokens to other accounts", async ()=>{
        let sentTokens = 1;
        let instance = this.Token;
        let totalSupply = await instance.totalSupply();
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        expect(instance.transfer(recipient, sentTokens)).to.eventually.be.fulfilled;
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sentTokens)));
        return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sentTokens));
    })

    it("not possible to send more tokens than total supply", async ()=>{
        let instance = this.Token;
        let balanceDeployer = await instance.balanceOf(deployerAccount);
        expect(instance.transfer(recipient, new BN(balanceDeployer+1))).to.be.rejected;
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceDeployer);

    })

});

