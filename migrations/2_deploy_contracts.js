let myToken = artifacts.require("MyToken.sol");
let MyTokenSale = artifacts.require("MyTokenSale.sol");
let KycContract = artifacts.require("kyc.sol");
require("dotenv").config({path:"../.env"})

module.exports = async (deployer)=>{
    let addr = await web3.eth.getAccounts(); 
    await deployer.deploy(myToken,process.env.INITIAL_TOKEN);
    await deployer.deploy(KycContract);
    await deployer.deploy(MyTokenSale, 1, addr[0], myToken.address, KycContract.address);
    let instance = await myToken.deployed();
    await instance.transfer(MyTokenSale.address,process.env.INITIAL_TOKEN);
}


