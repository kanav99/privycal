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
  const {c3, setC3, nillionClient, setCal1store, setOtherPartyId} = React.useContext(UserContext);
  const [participants, setParticipants] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [programId, setProgramId] = useState<string | null>(null);

  const [otherEvent, setOtherEvent] = useState<string>("");

  const createEvent = async () => {
    setLoading(true);
    const numParticipants = participants.length + 1;
    const pId = await storeProgram(nillionClient, "psi-" + numParticipants);
    setProgramId(pId);
    console.log(pId);
    setLoading(false);
    setC3({ programId: pId, participants: participants, party: 0 });

    const SignalingChannel = require("../signalling/signaling");
    const peerId = pId;
    // Where the signaling server is hosted, for a local server the port must match the one set in the .env files inside the config directory
    const signalingServerUrl = "http://kanav.eastus.cloudapp.azure.com:3030/";
    // Token must match the value defined in the .env filed inside the config directory
    const token = "SIGNALING123";

    const channel = new SignalingChannel(peerId, signalingServerUrl, token);
    
    channel.onMessage = (message: any) => {
      console.log(message);
      if (message.from === peerId + "-other") {
        setCal1store(message.message.store_id);
        setOtherPartyId(message.message.party_id);
        // alert(message.message);
        channel.disconnect();
      }
    };
    channel.connect();
    nextPage();
  }

  const joinEvent = async () => {
    setC3({ programId: otherEvent, participants: otherEvent.split("/")[0], party: 1 });
    nextPage();
  }

  return <VStack paddingY={0} justify="space-around" alignItems="left">
    <VStack minH="100vh" justify="space-evenly" spacing={"-40vh"} minW="100vw">
      <Heading fontSize={"5xl"}>Step 2: Invite or Join</Heading>
      <HStack spacing="5vw">
        <VStack alignItems="left" justifyItems="space-between" spacing="4vh">
          <Text>
            Invite participants to your event. Add their addresses below.
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
          {/* <Button onClick={() => setParticipants([...participants, ""])}>
            Add Participant
          </Button> */}
          <Button isDisabled={participants.map(p => (p === "")).reduce((prev, curr) => curr || prev)} onClick={createEvent} isLoading={loading}>
            Create Event
          </Button>
        </VStack>
        {/* Vertical line */}
        <VStack borderLeft="0.01px solid whitesmoke" height="80vh" />
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