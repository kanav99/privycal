import * as React from "react";
import {
    Text,
    VStack,
    Button,
    Heading,
    InputGroup,
    InputLeftAddon,
    InputRightElement,
    Input,
    HStack,
  } from "@chakra-ui/react";
  
  import { UserContext } from "../App";
import { compute } from "../nillion/compute";
  
  interface ResultsProps {
    nextPage: () => void;
  }
  
  export const Results: React.FC<ResultsProps> = ({nextPage}) => {

    const {cal1store, cal0store, nillion, nillionClient, programId, otherPartyId, partyBit, signalingChannel, result, setResult} = React.useContext(UserContext);

    const [loading, setLoading] = React.useState<boolean>(false);
    
    const computeIntersection = async () => {
      setLoading(true);
      const result = await compute(nillion, nillionClient, otherPartyId, [cal0store, cal1store], programId, "max_date");
      setResult(result);
      setLoading(false);
      signalingChannel.send({to: programId + "-other", message: {result: result}});
    }

    return <>
      <VStack paddingY={0} justify="space-around" alignItems="left">
        <VStack minH="100vh" minW="100vw" justify="space-evenly">
          <VStack spacing={"5vh"}>

          <Heading fontSize={"5xl"}>Results</Heading>
          <InputGroup size='md'>
            <InputLeftAddon>Event Code</InputLeftAddon>
            <Input value={(programId || "")} pr='4.5rem' readOnly></Input>
            <InputRightElement width='4.5rem'>
              <Button size='sm' h='1.75rem' onClick={() => navigator.clipboard.writeText(programId || "")}>Copy</Button>
            </InputRightElement>
          </InputGroup>
          <HStack>
            <InputGroup size='md'>
              <InputLeftAddon>Host</InputLeftAddon>
              <Input value={(cal0store === null ? "Pending" : "Ready")} pr='4.5rem' readOnly></Input>
            </InputGroup>
            <InputGroup size='md'>
              <InputLeftAddon>Client</InputLeftAddon>
              <Input value={(cal1store === null ? "Pending" : "Ready")} pr='4.5rem' readOnly></Input>
            </InputGroup>
          </HStack>
          <Button onClick={computeIntersection} isLoading={loading} isDisabled={(partyBit === 1) || !(cal1store !== null && cal0store !== null)}>Compute</Button>
          <Text>Intersection: {result}</Text>
          </VStack>
        </VStack>
      </VStack>
    </>;
  }