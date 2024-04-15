import * as React from "react"
import { useState } from "react";
import {
  ChakraProvider,
  extendTheme,
  Button,
  HStack,
} from "@chakra-ui/react";

import { Calender } from "./components/Calender";
import { HomePage } from "./components/HomePage";
import { ConnectWallet } from "./components/ConnectWallet";
import { AddParticipants } from "./components/AddParticipants";
import { Results } from "./components/Results";
import { Finalize } from "./components/Final";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({ 
  config,
});

const appName = "PrivyCal";

export const UserContext = React.createContext<any>(null);

export const App = () => {
  const numPages = 6;
  const [page, setPage] = useState<number>(0);

  function handleScroll() {
    window.scrollBy({
      top: 0,
      left: window.innerWidth, 
      behavior: 'smooth',
    });
  }

  const nextPage = () => {
    setPage(p => (p === (numPages-1)) ? p : (p + 1));
    handleScroll();
  }

  const [myUserKey, setMyUserKey] = useState<string | null>(null); // user key
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [programId, setProgramId] = useState<string | null>(null); // program id
  const [partyBit, setPartyBit] = useState<number | null>(null); // party bit
  const [host, setHost] = useState<string | null>(null);
  const [cal0store, setCal0store] = useState<any>(null);
  const [cal1store, setCal1store] = useState<any>(null);
  const [otherPartyId, setOtherPartyId] = useState<string | null>(null);

  const [nillion, setNillion] = useState<any>(null);
  const [nillionClient, setNillionClient] = useState<any>(null);
  const [signalingChannel, setSignalingChannel] = useState<any>(null);
  const [result, setResult] = React.useState<string>("");

  const d = {
    myUserKey, setMyUserKey,
    programId, setProgramId,
    partyBit, setPartyBit,
    nillion, nillionClient,
    cal0store, cal1store,
    setCal0store, setCal1store,
    otherPartyId, setOtherPartyId,
    host, setHost,
    myUserId, setMyUserId,
    signalingChannel, setSignalingChannel,
    result, setResult,
  }

  React.useEffect(() => {
    if (myUserKey) {
      const getNillionClientLibrary = async () => {
        const nillionClientUtil = await import("./nillion/nillionClient");
        const libraries = await nillionClientUtil.getNillionClient(myUserKey);
        setNillion(libraries.nillion);
        setNillionClient(libraries.nillionClient);
        return libraries.nillionClient;
      };
      getNillionClientLibrary().then(nillionClient => {
        setMyUserId(nillionClient.user_id);
      });
    }
  }, [myUserKey]);

  const iterateC = (page: number) =>
  {
    switch(page)
    {
      case 0: return true;
      case 1: return !(myUserKey === null);
      case 2: return !(programId === null);
      case 3: return true;
      default: return true;
    }
  }

  return <ChakraProvider theme={theme}>
    <UserContext.Provider value={d}>
      <HStack alignItems="start" overflowX="hidden" style={{transition: "all 0.2s linear"}} position={"fixed"} left={-page*window.innerWidth}>
        <HomePage appName={appName} nextPage={nextPage} />
        <ConnectWallet nextPage={nextPage} />
        <AddParticipants nextPage={nextPage} />
        <Calender nextPage={nextPage}/>
        <Results nextPage={nextPage}/>
        <Finalize />
      </HStack>

      <Button size="lg" position={"fixed"} left={10} bottom={"50%"} borderRadius={30} isDisabled={page===0} onClick={() => setPage(p => p === 0 ? p : (p - 1))}>
        {"⟨"}
      </Button>
      
      <Button size="lg" position={"fixed"} right={10} bottom={"50%"} borderRadius={30} isDisabled={((page===(numPages-1))) || !iterateC(page)} onClick={nextPage}>
        {"⟩"}
      </Button>
    </UserContext.Provider>
  </ChakraProvider>
}