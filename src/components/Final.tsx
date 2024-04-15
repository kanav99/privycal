import React from "react";
import {
    VStack,
    Button,
    Heading,
    Link,
  } from "@chakra-ui/react";
  import { ReactTyped } from "react-typed";

import {
  chakra,
  keyframes,
  ImageProps,
  forwardRef,
  usePrefersReducedMotion,
} from "@chakra-ui/react"
import logo from "./loading.png"

  
import { UserContext } from "../App";
import { FaGoogle } from "react-icons/fa";


const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

export const Logo = forwardRef<ImageProps, "img">((props, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()

  const animation = prefersReducedMotion
    ? undefined
    : `${spin} infinite 20s linear`

  return <chakra.img animation={animation} src={logo} ref={ref} {...props} />
})

interface HomePageProps {
}

const timeslots = ["9am-10am", "10am-11am", "11am-12am", "12am-1pm", "1pm-2pm", "2pm-3pm", "3pm-4pm", "4pm-5pm"];

export const Finalize: React.FC<HomePageProps> = () => {
    const {result} = React.useContext(UserContext);
    const resultInt = parseInt(result);
    const startTime = (9+resultInt).toString().padStart(2, "0");
    const endTime = (10+resultInt).toString().padStart(2, "0");
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = `${tomorrow.getFullYear()}${(tomorrow.getMonth()+1).toString().padStart(2, "0")}${tomorrow.getDate().toString().padStart(2, "0")}`
    const link = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Meeting+with+NAME&dates=${dateString}T${startTime}0000/${dateString}T${endTime}0000`

    return <>
        <VStack paddingY={0} justify="space-around" alignItems="left">
        {/* Page 1 */}
        <VStack minH="100vh" minW="100vw" justify="space-evenly">
            {(result === "") && <>
                <Heading>Computing <ReactTyped strings={[".", "..", "..."]} typeSpeed={80} showCursor={false} loop/></Heading>
                <Logo boxSize="100px" />
            </>}
            {(result !== "") && <>
                <Heading>You should meet at {timeslots[resultInt]}!</Heading>
                <VStack spacing={10}>

                <Button borderRadius={20} bg="whitesmoke" color="black" leftIcon={<FaGoogle />} as={Link} href={link}>Create Google Calender event</Button>
                {/* refresh page */}
                <Button borderRadius={20} bg="whitesmoke" color="black" onClick={() => { 
                    window.location.reload();
                }}>Start Over</Button>
                </VStack>
            </>}
        </VStack>
        </VStack>
    </>;
}