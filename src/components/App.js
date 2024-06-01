import React, { Component } from 'react';
import logo2010 from '../token2010.png';
import logoFite from '../tokenfite.png';
import logalEth from '../ethereum-original.svg';
import './App.css';
import Web3 from 'web3';
import ERC20CappedBurnableToken from '../abis/ERC20CappedBurnableToken.json'
import Faucet from '../abis/Faucet.json'

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const ethBalance = await web3.eth.getBalance(this.state.account)

    const token2010Address = "0x8726EC83Aad2eAd44624FA0Be7721080A2642E23"
    const token2010 = new web3.eth.Contract(ERC20CappedBurnableToken.abi, token2010Address)
    const token2010FaucetAddress = "0x5A7Cf94819C9D5f2ec105052557Cf8490fD28962"
    const token2010Faucet = new web3.eth.Contract(Faucet.abi, token2010FaucetAddress)
    this.setState({ token2010Faucet: token2010Faucet })
    this.setState({ token2010: token2010 })
    const token2010Balance = await token2010.methods.balanceOf(this.state.account).call()

    const tokenFiteAddress = "0x53f245b834973FECFA6948eA197EBFD287893d6f"
    const tokenFite = new web3.eth.Contract(ERC20CappedBurnableToken.abi, tokenFiteAddress)
    const tokenFiteFaucetAddress = "0x9C566B38f25c9BE0b9203Ff52865776289195cD4"
    const tokenFiteFaucet = new web3.eth.Contract(Faucet.abi, tokenFiteFaucetAddress)
    this.setState({ tokenFiteFaucet: tokenFiteFaucet })
    this.setState({ tokenFite: tokenFite })
    const tokenFiteBalance = await tokenFite.methods.balanceOf(this.state.account).call()
    this.setState({balance: { eth: web3.utils.fromWei(ethBalance.toString(), 'Ether'), 
                              token2010: web3.utils.fromWei(token2010Balance.toString(), 'Ether'), 
                              tokenFite: web3.utils.fromWei(tokenFiteBalance.toString(), 'Ether') }})
    const transactions = await token2010.getPastEvents('Transfer', { fromBlock: 0, toBlock: 'latest', filter: { from: this.state.account } })
    this.setState({ transactions: transactions })
    console.log((await this.state.token2010Faucet.methods.getBalance().call()).toString())
  }

  transfer(recipient, amount, token) {
    console.log(token)
    if (token === "ETH") {
      window.web3.eth.sendTransaction({ from: this.state.account, to: recipient, value: amount })
    }else if (token === "FITE") {
      this.state.tokenFite.methods.transfer(recipient, amount).send({ from: this.state.account })
    }
    else if (token === "2010") {
      this.state.token2010.methods.transfer(recipient, amount).send({ from: this.state.account })
    }
  }

  async getFite() {
    console.log(this.state.tokenFiteFaucet)
    await this.state.tokenFiteFaucet.methods.requestTokens().send({ from: this.state.account })
  }

  async get2010() {
    await this.state.token2010Faucet.methods.requestTokens().send({ from: this.state.account })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      token2010: null,
      token2010Faucet: null,
      tokenFite: null,
      tokenFiteFaucet: null,
      balance: {
        eth: 0,
        token2010: 0,
        tokenFite: 0
      },
      transactions: []
    }

    this.transfer = this.transfer.bind(this)
    this.getFite = this.getFite.bind(this)
    this.get2010 = this.get2010.bind(this)
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            Welcome to ERC20 Wallet!
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto" style={{ width: "500px" }}>
                <h1>Your Portforlio:</h1>
                {/* a new line */}
                <div>
                <h3>
                  <a
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={logalEth} width="50" />
                  </a>
                  ETH: {this.state.balance.eth}
                </h3>
                <h3>
                  <a
                    href="https://sepolia.etherscan.io/token/0x53f245b834973FECFA6948eA197EBFD287893d6f"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={logoFite} width="50" />
                  </a>
                  FITE: {this.state.balance.tokenFite}&nbsp;   
                  <button className="btn btn-primary" onClick={()=>this.getFite()}>Get 10 FITE</button>
                </h3>
                <h3>
                  <a
                    href="https://sepolia.etherscan.io/token/0x8726EC83Aad2eAd44624FA0Be7721080A2642E23"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={logo2010} width="50" />
                  </a>
                  2010: {this.state.balance.token2010}&nbsp;
                  <button className="btn btn-primary" onClick={()=>this.get2010()}>Get 10 2010</button>
                </h3>
                </div>
                <br></br>

                <h1>Transfer Tokens:</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const token = this.token.value
                  const recipient = this.recipient.value
                  const amount = window.web3.utils.toWei(this.amount.value, 'Ether')
                  this.transfer(recipient, amount, token)
                }}>
                  <div className="form-group mr-sm-2">     
                    <select
                        id="token"
                        type="select"
                        ref={(input) => { this.token = input }}
                        className="form-control"
                        >
                        <option value="ETH">ETH</option>
                        <option value="FITE">FITE</option>
                        <option value="2010">2010</option>
                    </select>
                  </div>
                  <div className="form-group mr-sm-2">
                    <input
                      id="recipient"
                      type="text"
                      ref={(input) => { this.recipient = input }}
                      className="form-control"
                      placeholder="Recipient Address"
                      required />
                  </div>
                  <div className="form-group mr-sm-2">
                    <input
                      id="amount"
                      type="text"
                      ref={(input) => { this.amount = input }}
                      className="form-control"
                      placeholder="Amount"
                      required />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Send</button>
                </form>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Recipient</th>
                      <th scope="col">value</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.state.transactions.map((tx, key) => {
                      return (
                        <tr key={key} >
                          <td>{tx.returnValues.to}</td>
                          <td>{window.web3.utils.fromWei(tx.returnValues.value.toString(), 'Ether')}</td>
                        </tr>
                      )
                    }) }
                  </tbody>
                </table>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
