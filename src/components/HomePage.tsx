import {
  Text,
  VStack,
  Button,
  HStack,
  Heading,
} from "@chakra-ui/react";
import { ReactTyped } from "react-typed";

import { UserContext } from "../App";

interface HomePageProps {
  appName: string;
  nextPage: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({appName, nextPage}) => {
  // function handleScroll() {
  //   window.scrollBy({
  //     top: window.innerHeight,
  //     left: 0, 
  //     behavior: 'smooth',
  //   });
  // }
  
  return <>
    <VStack paddingY={0} justify="space-around" alignItems="left">
      {/* Page 1 */}
      <VStack minH="100vh" minW="100vw" justify="space-evenly">
        <VStack alignItems="left">
          <HStack>
            <Heading fontSize={80}>Schedule</Heading>
            <Heading fontSize={80} textColor="aqua">
              <ReactTyped strings={["meetings", "trips", "calls"]} typeSpeed={80} loop />
            </Heading>
          </HStack>
          <Heading fontSize={80}> without sharing calenders</Heading>
        </VStack>
        <HStack justify="space-around">
          <Button onClick={nextPage} borderRadius={20}>Try&nbsp;<Text textColor="aqua">{appName}</Text>&nbsp;now!</Button>
        </HStack>
      </VStack>
      {/* Page 2 */}
      {/* <VStack minH="100vh" justify="space-evenly">
        <Heading fontSize={"5xl"}>How {appName} works?</Heading>
      </VStack> */}
      {/* Page 3 */}
      {/* <VStack minH="100vh" justify="space-evenly">
        <Heading fontSize={"5xl"}>How {appName} works?</Heading>
      </VStack> */}
      {/* Footer */}
      {/* <VStack alignItems={"end"} paddingBottom={10} paddingRight={65}>
        <Heading fontSize={40} textColor="aqua">{appName}</Heading>
        <Text fontWeight={"thin"}>© 2024 Kanav Gupta</Text>
      </VStack> */}
    </VStack>
    {/* <Button size="lg" position={"fixed"} right={10} bottom={10} onClick={handleScroll} borderRadius={30}>
      {"⟩"}
    </Button> */}
  </>;
}