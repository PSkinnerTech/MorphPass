import { ethers } from "ethers";

const Navigation = ({ account, setAccount }) => {
  const connectHandler = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const account = ethers.getAddress(accounts[0]);
        setAccount(account);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      console.log("Please install MetaMask");
    }
  };

  return (
    <nav>
      <div>
        <h1>MorphPass</h1>
      </div>

      {account ? (
        <button type="button">
          {/* Have you learned used .slice?  It's a way to basically shorten strings and display a shortened version of that string.  In this case, I've sliced it so you see the first 6 digits and the last 4 digits of an address. Kind of a cool way to validate to the user that they're connected. */}
          {account.slice(0, 6) + '...' + account.slice(38, 42)}
        </button>
      ) : (
        <button type="button"  onClick={connectHandler}>
          Connect
        </button>
      )}
    </nav>
  );
};

export default Navigation;