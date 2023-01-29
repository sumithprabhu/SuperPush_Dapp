
import React, { useState} from "react";
import "./App.css";
import { DeleteStream, CreateStream, UpdateStream,Navbar,Home} from "./Components/index";
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
      
      <Navbar connectWallet={connectWallet} currentAccount={currentAccount}/>
      <Home />
      <CreateStream checkIfWalletIsConnected={checkIfWalletIsConnected} currentAccount={currentAccount}/>
      <UpdateStream checkIfWalletIsConnected={checkIfWalletIsConnected} currentAccount={currentAccount}/>
      <DeleteStream checkIfWalletIsConnected={checkIfWalletIsConnected} currentAccount={currentAccount}/>
    </div>
  );
}

export default App;
