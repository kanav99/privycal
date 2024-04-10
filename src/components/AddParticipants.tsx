import * as React from "react";
import { useState } from "react";
import {
  VStack,
  Button,
  Heading,
  Text,
  Input,
  HStack,
} from "@chakra-ui/react";
  
export const AddParticipants = () => {
  const [participants, setParticipants] = useState<string[]>([""]);

  return <VStack paddingY={0} justify="space-around" alignItems="left">
    <VStack minH="100vh" justify="space-evenly" spacing={"-40vh"} minW="100vw">
      <Heading fontSize={"5xl"}>Step 2: Invite or Join</Heading>
      <HStack spacing="5vw">
        <VStack alignItems="left" justifyItems="space-between" spacing="4vh">
          <Text>
            Invite participants to your event. Add their email addresses below.
          </Text>
        {participants.map((participant, i) => {
          return <HStack key={i} justify="stretch">
            <Text flex={"full"}>{i+1}.</Text>
            <Input value={participant} onChange={(e) => {
              let newParticipants = [...participants];
              newParticipants[i] = e.target.value;
              setParticipants(newParticipants);
            }} placeholder="Address"/>
            {(i === participants.length - 1 && i > 0) && <Button onClick={() => setParticipants(p => p.slice(0, p.length-1))}>
              - </Button>}
          </HStack>;
        })}
          <Button onClick={() => setParticipants([...participants, ""])}>
            Add Participant
          </Button>
        </VStack>
        {/* Vertical line */}
        <VStack borderLeft="0.01px solid whitesmoke" height="80vh" />
        <VStack alignItems="left" justifyItems="space-between" spacing="4vh">
          <Text>
            Join some other event. Add the event code below.
          </Text>
          <Input placeholder="Event Code"/>
          <Button>
            Join Event
          </Button>
        </VStack>
      </HStack>
    </VStack>
  </VStack>;
}