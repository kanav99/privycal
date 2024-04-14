import * as React from "react";
import { useState } from "react";
import {
  VStack,
  Button,
  Heading,
  Text,
  Link,
  Alert,
} from "@chakra-ui/react";
import { getUserKeyFromSnap } from "../nillion/getUserKeyFromSnap";

import { UserContext } from "../App";

export function addressTruncate(addr: string) {
    return addr.substring(0, 4).toLowerCase() + "..." + addr.substring(addr.length - 4).toLowerCase();
  }

interface ConnectWalletProps {
  nextPage: () => void;
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
  
export const ConnectWallet: React.FC<ConnectWalletProps> = ({nextPage}) => {
  const {c2, setC2} = React.useContext(UserContext);
  const [loading, setLoading] = useState(false);
  // const [userKey, setUserKey] = useState<string | null>(null);

  async function handleConnectToSnap() {
    setLoading(true);
    try {
      const snapResponse = await getUserKeyFromSnap();
      if (snapResponse == undefined) {
        throw new Error("Snap response is undefined");
      }
      console.log(snapResponse?.user_key);
      setC2(snapResponse?.user_key || null);
      // setC2(snapResponse?.connectedToSnap || false);
      setLoading(false);
      await sleep(300);
      nextPage();
    }
    catch {
      setLoading(false);
      alert("hoo hoo");
    }
  }

  async function handleDisconnectSnap() {
    // setUserKey(null);
    setC2(null);
  }

  return <VStack paddingY={0} justify="space-around" alignItems="left">
    {/* Page 2 */}
    <VStack minH="100vh" justify="space-evenly" spacing={"-40vh"} minW="100vw">
      <Heading fontSize={"5xl"}>Step 1: Connect your Nillion account</Heading>
      <Text>
        Connect to your Nillion account. You need to install the Nillion snap on MetaMask Flask. Find the instructions <Link target="_blank" href="https://nillion-snap-site.vercel.app/" textDecoration={"underline"}>here</Link>.
      </Text>
      {(c2 !== null) && <Button onClick={handleDisconnectSnap} loadingText="Connecting..." isLoading={loading} bg="#66AA6A" _hover={{bg: "#66BB6A"}}>
        {"Connected"}
      </Button>}
      {(c2 == null) && <Button onClick={handleConnectToSnap} loadingText="Connecting..." isLoading={loading} >
        Connect Wallet
      </Button>}
    </VStack>
  </VStack>;
}