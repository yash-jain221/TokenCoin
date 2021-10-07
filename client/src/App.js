import React, { Component } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from './contracts/MyTokenSale.json';
import Kyc from './contracts/KYC.json';
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {loaded: false, kycAddress: "", TokenSaleAddress: null, userTokens: 0};

  componentDidMount = async () => {
    try {
      this.web3 = await getWeb3();
      this.accounts = await this.web3.eth.getAccounts();

      this.networkId = await this.web3.eth.net.getId();
      console.log(this.networkId);
      this.MyTokenInstance = new this.web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address
      );

      this.MyTokenSaleInstance = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address
      );

      this.KycInstance = new this.web3.eth.Contract(
        Kyc.abi,
        Kyc.networks[this.networkId] && Kyc.networks[this.networkId].address
      );


      this.setState({loaded: true, TokenSaleAddress: MyTokenSale.networks[this.networkId].address}, this.updateUserTokens);
    } catch (error) {

      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  updateUserTokens = async ()=>{
    let _userTokens = await this.MyTokenInstance.methods.balanceOf(this.accounts[0]).call()
    this.setState({
      userTokens: _userTokens
    })
  }

  handleInputChange = (event)=>{
    let name = event.target.name;
    let value = event.target.value;
    this.setState({
      [name]: value
    })
  }

  handleSubmit = async ()=>{
    await this.KycInstance.methods.setKycCompleted(this.state.kycAddress).send({from: this.accounts[0]});
    alert("KYC for " + this.state.kycAddress + " is completed");
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Token Sale</h1>
        <p>get your tokens now!!</p>
        <h2>KYC Whitelisting</h2>
        <form>
          <label>Address to allow:</label>
          <input type='text' name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange}  />
          <button type="button" onClick={this.handleSubmit}>Add to Whitelist</button>
          <h2>Buy tokens</h2>
          <p>Send Wei to this address: {this.state.TokenSaleAddress},{MyToken.networks[this.networkId].address}</p>
          <p>You currently have: {this.state.userTokens}</p>
          <button type="button">Buy More Tokens</button>
        </form>
      </div>
    );
  }
}

export default App;
