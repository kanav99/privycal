import * as React from "react";
import { useState } from "react";
import {
  VStack,
  Button,
  Heading,
  Text,
  Link,
} from "@chakra-ui/react";
import { getUserKeyFromSnap } from "../nillion/getUserKeyFromSnap";

function addressTruncate(addr: string) {
    return addr.substring(0, 4).toLowerCase() + "..." + addr.substring(addr.length - 4).toLowerCase();
  }

interface ConnectWalletProps {
  nextPage: () => void;
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
  
export const ConnectWallet: React.FC<ConnectWalletProps> = ({nextPage}) => {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userKey, setUserKey] = useState<string | null>(null);

  async function handleConnectToSnap() {
    setLoading(true);
    const snapResponse = await getUserKeyFromSnap();
    setUserKey(snapResponse?.user_key || null);
    setConnected(snapResponse?.connectedToSnap || false);
    setLoading(false);
    await sleep(300);
    nextPage();
  }

  async function handleDisconnectSnap() {
    setUserKey(null);
    setConnected(false);
  }

  return <VStack paddingY={0} justify="space-around" alignItems="left">
    {/* Page 2 */}
    <VStack minH="100vh" justify="space-evenly" spacing={"-40vh"} minW="100vw">
      <Heading fontSize={"5xl"}>Step 1: Connect your Nillion account</Heading>
      <Text>
        Connect to your Nillion account. You need to install the Nillion snap on MetaMask Flask. Find the instructions <Link target="_blank" href="https://nillion-snap-site.vercel.app/" textDecoration={"underline"}>here</Link>.
      </Text>
      {connected && <Button onClick={handleDisconnectSnap} loadingText="Connecting..." isLoading={loading} bg="#66AA6A" _hover={{bg: "#66BB6A"}}>
        {"Connected " + addressTruncate(userKey || "")}
      </Button>}
      {!connected && <Button onClick={handleConnectToSnap} loadingText="Connecting..." isLoading={loading} >
        Connect Wallet
      </Button>}
    </VStack>
  </VStack>;
}