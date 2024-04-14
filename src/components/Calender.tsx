import * as React from "react"
import { useState } from "react";
import {
  VStack,
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  ButtonGroup,
  HStack,
  Text,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  InputRightElement,
} from "@chakra-ui/react"
import { FaArrowCircleLeft, FaGoogle, FaGrinTears, FaRecycle } from "react-icons/fa";

import { UserContext } from "../App";
import { addressTruncate } from "./ConnectWallet";
import { storeSecretsInteger } from "../nillion/storeSecretsInteger";

const days = 7;
const hours = 8;
const maxLevel = 5;

const calenderArr = Array(days).fill([]).map(() => Array(hours).fill(0));

interface CalenderButtonProps {
  hr: number;
  day: number;
  levelArr: any;
  setLevelArr: (x :any) => any;
}

const CalenderButton: React.FC<CalenderButtonProps> = (
  { hr, day, levelArr, setLevelArr }
) => {

  const level = levelArr[day][hr];

  const increaseLevel = () => {
    setLevelArr((lvlArr: any) => {
      let newLvlArr = Array(days).fill([]).map(() => Array(hours).fill(0));
      for (let i = 0; i < days; i++) {
        for (let j = 0; j < hours; j++) {
          newLvlArr[i][j] = lvlArr[i][j];
        }
      }
      newLvlArr[day][hr] = (newLvlArr[day][hr] + 1) % maxLevel;
      return newLvlArr;
    });
  }

  if (level === 0)
    return <Button width="95%" borderRadius={0} onClick={increaseLevel}>
      ×
    </Button>;
  else {
    return <Button width="95%" bg={"#66AA6A"} _hover={{bg: "#66DD6A"}} borderRadius={0} onClick={increaseLevel}>
      {level}
    </Button>;
  }
}

interface CalenderProps {
  nextPage: () => void;
}

export const Calender: React.FC<CalenderProps> = ({nextPage}) => {

  const [calender, setCalender] = useState<Array<Array<number>>>(calenderArr);
  const timeslots = ["9am-10am", "10am-11am", "11am-12am", "12am-1pm", "1pm-2pm", "2pm-3pm", "3pm-4pm", "4pm-5pm"];

  const { c3, nillion, nillionClient, setCal0store } = React.useContext(UserContext);

  const submitCalendar = async () => {
    if (c3) {
      await storeSecretsInteger(
        nillion,
        nillionClient,
        calender.flat().map((v, i) => { return {name: "calender_p" + c3.party + "_h" + i, value: (v+1).toString()} }),
        c3.programId,
        "Party" + c3.party,
        [], [], [],
        // [],
        (c3.party === 0) ? [] : [c3.participants[0]],
      ).then(async (store_id: string) => {
        console.log("Secret stored at store_id:", store_id);
        setCal0store(store_id);
        if (c3.party == 1) {
          const SignalingChannel = require("../signalling/signaling");
          const peerId = c3.programId + "-other";
          const signalingServerUrl = "http://kanav.eastus.cloudapp.azure.com:3030/";
          const token = "SIGNALING123";
          const channel = new SignalingChannel(peerId, signalingServerUrl, token);
          channel.connect();
          channel.sendTo(c3.programId, {store_id, party_id: nillionClient.party_id});
        }
        nextPage();
      });
    }
  }

  return <VStack paddingY={0} justify="space-around" alignItems="left">
    {/* Page 2 */}
    <VStack minH="100vh" minW="100vw" justify="space-evenly">
      <Heading fontSize={"5xl"}>Step 2: Select your slots</Heading>
      <HStack justify="flex-start" spacing={50}>
        <InputGroup size='md'>
          <InputLeftAddon>Event Code</InputLeftAddon>
          <Input value={(c3?.programId || "")} pr='4.5rem' readOnly></Input>
          <InputRightElement width='4.5rem'>
            <Button size='sm' h='1.75rem' onClick={() => navigator.clipboard.writeText(c3?.programId || "")}>Copy</Button>
          </InputRightElement>
        </InputGroup>
        <Button onClick={() => setCalender(calenderArr)}>Reset</Button>
      </HStack>
      {/* <Button borderRadius={20} bg="whitesmoke" color="black" leftIcon={<FaGoogle />}>Fetch from Google Calender</Button> */}
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th></Th>
              <Th>Sun</Th>
              <Th>Mon</Th>
              <Th>Tue</Th>
              <Th>Wed</Th>
              <Th>Thu</Th>
              <Th>Fri</Th>
              <Th>Sat</Th>
            </Tr>
          </Thead>
          <Tbody>
            {timeslots.map((timeslot, h) => (<Tr key={h}>
              <Td isNumeric>{timeslot}</Td>
              {calenderArr.map((_, d) => <Td key={d + "_" + h} padding={0}><CalenderButton hr={h} day={d} levelArr={calender} setLevelArr={setCalender}/></Td>)}
            </Tr>))}
          </Tbody>
        </Table>
      </TableContainer>
      <Button onClick={submitCalendar}>Continue</Button>
    </VStack>
  </VStack>;
}