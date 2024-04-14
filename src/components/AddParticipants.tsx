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
import { storeProgram } from "../nillion/storeProgram";
import { UserContext } from "../App";

interface AddParticipantsProps {
  nextPage: () => void;
}

export const AddParticipants: React.FC<AddParticipantsProps> = ({nextPage}) => {
  const {nillionClient, setCal1store, setOtherPartyId, setProgramId, setPartyBit, setHost, setSignalingChannel} = React.useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const [otherEvent, setOtherEvent] = useState<string>("");

  const createEvent = async () => {
    setLoading(true);
    const numParticipants = 2;
    const pId = await storeProgram(nillionClient, "psi-" + numParticipants);
    setProgramId(pId);
    console.log(pId);
    setLoading(false);
    setProgramId(pId);
    setPartyBit(0);
    setHost(pId.split("/")[0]);

    const SignalingChannel = require("../signalling/signaling");
    const peerId = pId;
    const channel = new SignalingChannel(peerId, "http://kanav.eastus.cloudapp.azure.com:3030/", "SIGNALING123");
    
    channel.onMessage = (message: any) => {
      console.log(message);
      if (message.from === peerId + "-other") {
        if (message.message) {
          setCal1store(message.message.store_id);
          setOtherPartyId(message.message.party_id);
        }
      }
    };
    channel.connect();
    setSignalingChannel(channel);
    nextPage();
  }

  const joinEvent = async () => {
    setProgramId(otherEvent);
    setPartyBit(1);
    setHost(otherEvent.split("/")[0]);
    nextPage();
  }

  return <VStack paddingY={0} justify="space-around" alignItems="left">
    <VStack minH="100vh" justify="space-evenly" spacing={"-40vh"} minW="100vw">
      <Heading fontSize={"5xl"}>Step 2: Invite or Join</Heading>
      <HStack spacing="5vw" justify="space-between">
        <VStack alignItems="left" justifyItems="space-between" spacing="4vh">
          <Text>
            Create a new event. You will get an event code to share.
          </Text>
          <Button onClick={createEvent} isLoading={loading}>
            Create Event
          </Button>
        </VStack>
        {/* Vertical line */}
        <VStack borderLeft="0.01px solid whitesmoke" height="50vh" />
        <VStack alignItems="left" justifyItems="space-between" spacing="4vh">
          <Text>
            Join some other event. Add the event code below.
          </Text>
          <Input placeholder="Event Code" value={otherEvent} onChange={(e) => setOtherEvent(e.target.value) }/>
          <Button isDisabled={otherEvent===""} onClick={joinEvent}>
            Join Event
          </Button>
        </VStack>
      </HStack>
    </VStack>
  </VStack>;
}