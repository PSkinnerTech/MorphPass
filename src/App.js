import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "./components/Navigation";
import Sort from "./components/Sort";
import Card from "./components/Card";
import SeatChart from "./components/SeatChart";

// ABIs
import MorphPass from "./abis/morphPass.json";

// Config
import config from "./config.json";

function App() {
  const loadBlockchainData = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(accounts);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);
  return (
    <div>
      <h1>Hello, world!</h1>
    </div>
  );
}

export default App;
