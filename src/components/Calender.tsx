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
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
} from "@chakra-ui/react"

import { UserContext } from "../App";
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
  const [loading, setLoading] = useState(false);

  const { nillion, nillionClient, setCal0store,
    setCal1store, programId, partyBit, host,
    setSignalingChannel, setResult
   } = React.useContext(UserContext);

  const submitCalendar = async () => {
    setLoading(true);
    await storeSecretsInteger(
      nillion,
      nillionClient,
      calender.flat().map((v, i) => { return {name: "calender_p" + partyBit + "_h" + i, value: (v+1).toString()} }),
      programId,
      "Party" + partyBit,
      [], [], [],
      (partyBit === 0) ? [] : [host],
    ).then(async (store_id: string) => {
      console.log("Secret stored at store_id:", store_id);
      if (partyBit === 0)
        setCal0store(store_id);
      if (partyBit === 1) {
        setCal1store(store_id);
        const SignalingChannel = require("../signalling/signaling");
        const peerId = programId + "-other";
        const signalingServerUrl = "http://kanav.eastus.cloudapp.azure.com:3030/";
        const token = "SIGNALING123";
        const channel = new SignalingChannel(peerId, signalingServerUrl, token);
        channel.connect();
        channel.sendTo(programId, {store_id, party_id: nillionClient.party_id});
        channel.onMessage = (message: any) => {
          console.log(message);
          if (message.from === programId) {
            if (message.message)
              setResult(message.message.result)
          }
        };
        setSignalingChannel(channel);
      }
      setLoading(false);
      nextPage();
    });
  }

  return <VStack paddingY={0} justify="space-around" alignItems="left">
    {/* Page 2 */}
    <VStack minH="100vh" minW="100vw" justify="space-evenly">
      <Heading fontSize={"5xl"}>Step 2: Select your slots</Heading>
      <HStack justify="flex-start" spacing={50}>
        <InputGroup size='md'>
          <InputLeftAddon>Event Code</InputLeftAddon>
          <Input value={(programId || "")} pr='4.5rem' readOnly></Input>
          <InputRightElement width='4.5rem'>
            <Button size='sm' h='1.75rem' onClick={() => navigator.clipboard.writeText(programId || "")}>Copy</Button>
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
      <Button onClick={submitCalendar} isLoading={loading}>Continue</Button>
    </VStack>
  </VStack>;
}