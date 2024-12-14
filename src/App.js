// This is your react imports needed for this file.  I'm not sure if you've learned how to use useEffect and useState yet.  Let me know if you don't know these, and I'll sit down with you to teach you how to use them.
import { useEffect, useState } from "react";
// This is for your ethers library.  This is used in relation to the smart contract I wrote.  We can `delve` into this later.  <-- `delve` is an inside joke btw... "Tech Pop Culture" so to speak.
import { ethers } from "ethers";

// This is importing your Navigation.js file from your components folder.
import Navigation from "./components/Navigation";

// Your contract ABIs are necessary to interact with the smart contract... It's kind of a bridge between your javascript code and my solidity code.  Understanding your ABIs is crucial for understanding how to interact with the smart contract in JS.
import MorphPass from "./abis/morphPass.json";

// Config is just the address for the Morph Network and the contract address we got when we deployed the smart contract a couple of days ago.
import config from "./config.json";

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [morphPass, setMorphPass] = useState(null);

  // Function to load blockchain data
  const loadBlockchainData = async () => {
    try {
      // First, we wanna check to see if Metamask is available.  I'm going to have to double check later is this is the ideal configuration for Morph and I might change it later.  At this point, I'm just trying to unblock you from having to wait on me to develop the frontend further.
      if (typeof window.ethereum !== 'undefined') {
        // If Metamask is available, this creates a new ethers provider using the browser's ethereum object.
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);

        // This gets the current network... aka MorphL2.
        const network = await provider.getNetwork();
        const chainId = network.chainId;

        // This checks to see if the config file has data for the current network.
        if (config[chainId] && config[chainId].morphPass && config[chainId].morphPass.address) {
          // If there's data, this will create a new instance of the MorphPass contract.
          const morphPassContract = new ethers.Contract(config[chainId].morphPass.address, MorphPass, provider);
          setMorphPass(morphPassContract);
          console.log("MorphPass contract:", morphPassContract);
        } else {
          console.error("MorphPass contract address not found for this network");
        }

        // This will setup an event listener for account changes.
        window.ethereum.on('accountsChanged', async () => {
          const accounts = await provider.send("eth_requestAccounts", []);
          const account = ethers.getAddress(accounts[0]);
          setAccount(account);
        });

        // Similar to the last one, this is just an event listener for network changes.
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });

        // This requests account access from the user. This is important and has to be done for you to be able to request transactions and such later.
        const accounts = await provider.send("eth_requestAccounts", []);
        const account = ethers.getAddress(accounts[0]);
        setAccount(account);

        console.log("Account connected:", account);
      } else {
        console.log("Please install MetaMask");
      }
    } catch (error) {
      // Now, we start our error handling, first with the original 4001 error you were running into.
      if (error.code === 4001) {
        console.log("User rejected the request to connect the wallet");
      } else {
        // All other errors will print this in the console.
        console.error("An error occurred while loading blockchain data:", error);
      }
    }
  };

  // Use effect hook to call loadBlockchainData when the component mounts.  Again, let me know if you haven't used useEffects or useState's yet.
  useEffect(() => {
    loadBlockchainData();
  }, []);

  // Finally, we'll render the page with its components.
  return (
    <div>
     {/* I think I was explaining this before where we would pass states into components from the App.js rather than within the component.  This is a good example of how to do that. */}
      <Navigation account={account} setAccount={setAccount} />
      <h1>Welcome to MorphPass</h1>
      {/* Conditional Rendering! This is cool.  It works a lot like if statements.  If the user isn't connected, it will show the "Please connect your wallet", if it's connected, it will show the account address. */}
      {account ? (
        <p>Connected Account: {account}</p>
      ) : (
        <p>Please connect your wallet</p>
      )}
      {/* This shows the MorphL2 contract address */}
      {morphPass && (
        <p>MorphPass Contract Address: {morphPass.address}</p>
      )}
    </div>
  );
}

export default App;