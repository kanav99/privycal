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

const appName = "PrivyCal";

export const UserContext = React.createContext(null);

export const App = () => {
  const numPages = 4;
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

  return <ChakraProvider theme={theme}>
    <HStack alignItems="start" overflowX="hidden" style={{transition: "all 0.2s linear"}} position={"fixed"} left={-page*window.innerWidth}>
      <HomePage appName={appName} nextPage={nextPage}/>
      <ConnectWallet nextPage={nextPage}/>
      <AddParticipants />
      <Calender />
    </HStack>

    <Button size="lg" position={"fixed"} left={10} bottom={"50%"} borderRadius={30} isDisabled={page===0} onClick={
      () => setPage(p => p === 0 ? p : (p - 1))
    }>
      {"⟨"}
    </Button>
    
    <Button size="lg" position={"fixed"} right={10} bottom={"50%"} borderRadius={30}isDisabled={page===(numPages-1)} onClick={nextPage}>
      {"⟩"}
    </Button>
  </ChakraProvider>
}