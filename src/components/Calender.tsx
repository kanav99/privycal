import * as React from "react"
import { useEffect, useState } from "react";
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
} from "@chakra-ui/react"
import { FaGoogle } from "react-icons/fa";

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

export const Calender = () => {

  const [calender, setCalender] = useState<Array<Array<number>>>(calenderArr);
  const timeslots = ["9am-10am", "10am-11am", "11am-12am", "12am-1pm", "1pm-2pm", "2pm-3pm", "3pm-4pm", "4pm-5pm"];

  return <VStack paddingX={65} paddingY={0} justify="space-around" alignItems="left">
    {/* Page 2 */}
    <VStack minH="100vh" justify="space-evenly">
      <Heading fontSize={"5xl"}>Step 2: Select your slots</Heading>
      <Button borderRadius={20} bg="whitesmoke" color="black" leftIcon={<FaGoogle />}>Fetch from Google Calender</Button>
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
    </VStack>
  </VStack>;
}