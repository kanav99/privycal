import * as React from "react"
import { useState } from "react";
import {
  ChakraProvider,
  theme,
  Button,
} from "@chakra-ui/react";

import { Calender } from "./components/Calender";
import { HomePage } from "./components/HomePage";
import { ConnectWallet } from "./components/ConnectWallet";
import { SampleApp } from "./components/SampleApp";

const appName = "PrivyCal";

export const App = () => {
  const numPages = 3;
  const [page, setPage] = useState<number>(0);

  return <ChakraProvider theme={theme}>
    {page === 0 && <HomePage appName={appName}/> }
    {page === 1 && <ConnectWallet />}
    {page === 2 && <Calender />}

    <Button size="lg" position={"fixed"} left={10} bottom={"50%"} borderRadius={30} isDisabled={page===0} onClick={
      () => setPage(p => p === 0 ? p : (p - 1))
    }>
      {"⟨"}
    </Button>
    
    <Button size="lg" position={"fixed"} right={10} bottom={"50%"} borderRadius={30}isDisabled={page===(numPages-1)} onClick={
      () => setPage(p => (p === (numPages-1)) ? p : (p + 1))
    }>
      {"⟩"}
    </Button>
  </ChakraProvider>
}