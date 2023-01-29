import logo from "./logo.svg";
import React, { useState, useEffect } from "react";
import "./App.css";
import { DeleteStream, CreateStream, UpdateStream } from "./Components/index";
function App() {
  let account;
  const [currentAccount, setCurrentAccount] = useState("");
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      account = currentAccount;
      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      // setupEventListener()
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    console.log("runs");
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    const chain = await window.ethereum.request({ method: "eth_chainId" });
    let chainId = chain;
    console.log("chain ID:", chain);
    console.log("global Chain Id:", chainId);
    if (accounts.length !== 0) {
      account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      // setupEventListener()
    } else {
      console.log("No authorized account found");
    }
  };
  return (
    
    <div className="App">
      <header class="header">
        <h1 class="logo">
          <a href="#">Flexbox</a>
        </h1>
        <ul class="main-nav">
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Portfolio</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
        {currentAccount === "" ? (
        <button id="connectWallet" className="button" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <button className="button">
          {`${currentAccount.substring(0, 4)}...${currentAccount.substring(
            38
          )}`}
        </button>
      )}
      </header>
      <CreateStream checkIfWalletIsConnected={checkIfWalletIsConnected} currentAccount={currentAccount}/>
      <UpdateStream checkIfWalletIsConnected={checkIfWalletIsConnected} currentAccount={currentAccount}/>
      <DeleteStream checkIfWalletIsConnected={checkIfWalletIsConnected} currentAccount={currentAccount}/>
    </div>
  );
}

export default App;
