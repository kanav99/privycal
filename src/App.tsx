import * as React from "react"
import { useState } from "react";
import {
  ChakraProvider,
  theme,
  Button,
  HStack,
} from "@chakra-ui/react";

import { Calender } from "./components/Calender";
import { HomePage } from "./components/HomePage";
import { ConnectWallet } from "./components/ConnectWallet";
import { AddParticipants } from "./components/AddParticipants";
import { Results } from "./components/Results";

const appName = "PrivyCal";

export const UserContext = React.createContext<any>(null);

export const App = () => {
  const numPages = 5;
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

  const [c1, setC1] = useState(true);
  const [c2, setC2] = useState<string | null>(null); // user key
  const [c3, setC3] = useState<string | null>(null); // program id
  const [c4, setC4] = useState(false);
  const [cal0store, setCal0store] = useState<any>(null);
  const [cal1store, setCal1store] = useState<any>(null);
  const [otherPartyId, setOtherPartyId] = useState<string | null>(null);

  const [nillion, setNillion] = useState<any>(null);
  const [nillionClient, setNillionClient] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const d = {
    c1, c2, c3, c4,
    setC1, setC2, setC3, setC4,
    nillion, nillionClient,
    cal0store, cal1store,
    setCal0store, setCal1store,
    otherPartyId, setOtherPartyId,
  }

  React.useEffect(() => {
    if (c2) {
      const getNillionClientLibrary = async () => {
        const nillionClientUtil = await import("./nillion/nillionClient");
        const libraries = await nillionClientUtil.getNillionClient(c2);
        setNillion(libraries.nillion);
        setNillionClient(libraries.nillionClient);
        return libraries.nillionClient;
      };
      getNillionClientLibrary().then(nillionClient => {
        const user_id = nillionClient.user_id;
        setUserId(user_id);
      });
    }
  }, [c2]);

  const iterateC = (page: number) =>
  {
    switch(page)
    {
      case 0: return c1;
      case 1: return !(c2 === null);
      case 2: return !(c3 === null);
      case 3: return c4;
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
      </HStack>

      <Button size="lg" position={"fixed"} left={10} bottom={"50%"} borderRadius={30} isDisabled={page===0} onClick={
        () => setPage(p => p === 0 ? p : (p - 1))
      }>
        {"⟨"}
      </Button>
      
      <Button size="lg" position={"fixed"} right={10} bottom={"50%"} borderRadius={30} isDisabled={((page===(numPages-1))) || !iterateC(page)} onClick={nextPage}>
        {"⟩"}
      </Button>
    </UserContext.Provider>
  </ChakraProvider>
}