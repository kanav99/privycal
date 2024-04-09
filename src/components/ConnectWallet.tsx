import * as React from "react";
import { useState } from "react";
import {
  VStack,
  Button,
  Heading,
} from "@chakra-ui/react";
import * as ethers from "ethers";

function addressTruncate(addr: string) {
    return addr.substring(0, 6).toLowerCase() + "..." + addr.substring(addr.length - 4).toLowerCase();
  }
  
export const ConnectWallet = () => {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to connect/disconnect the wallet
  async function connectWallet() {
    if (!connected) {
      setLoading(true);
      // Connect the wallet using ethers.js
      // @ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const _walletAddress = await signer.getAddress();
      setConnected(true);
      setWalletAddress(_walletAddress);
      setLoading(false);
    } else {
      // Disconnect the wallet
      // @ts-ignore
      // window.ethereum.selectedAddress = null;
      setConnected(false);
      setWalletAddress("");
    }
  }

  return <VStack paddingX={65} paddingY={0} justify="space-around" alignItems="left">
    {/* Page 2 */}
    <VStack minH="100vh" justify="space-evenly" spacing={"-40vh"}>
      <Heading fontSize={"5xl"}>Step 1: Connect your ethereum wallet</Heading>
      {connected && <Button onClick={connectWallet} loadingText="Connecting..." isLoading={loading} bg="#66AA6A" _hover={{bg: "#66BB6A"}}>
        {"Connected " + addressTruncate(walletAddress)}
      </Button>}
      {!connected && <Button onClick={connectWallet} loadingText="Connecting..." isLoading={loading} >
        Connect Wallet
      </Button>}
    </VStack>
  </VStack>;
}