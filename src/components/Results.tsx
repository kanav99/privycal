import * as React from "react";
import {
    Text,
    VStack,
    Button,
    HStack,
    Heading,
  } from "@chakra-ui/react";
  import { ReactTyped } from "react-typed";
  
  import { UserContext } from "../App";
import { compute } from "../nillion/compute";
  
  interface ResultsProps {
    nextPage: () => void;
  }
  
  export const Results: React.FC<ResultsProps> = ({nextPage}) => {

    const {cal1store, cal0store, nillion, nillionClient, c3, otherPartyId} = React.useContext(UserContext);

    const [result, setResult] = React.useState<string>("");
    
    const computeIntersection = async () => {
      await compute(nillion, nillionClient, otherPartyId, [cal0store, cal1store], c3.programId, "max_date").then(
        result => setResult(result),
      );
    }

    return <>
      <VStack paddingY={0} justify="space-around" alignItems="left">

        <VStack minH="100vh" minW="100vw" justify="space-evenly">
          {(cal1store === null || cal0store === null) && <Heading fontSize={"5xl"}>Loading...</Heading>}
          {(cal1store !== null && cal0store !== null) && <Heading fontSize={"5xl"}>Results</Heading>}
          {(cal1store !== null && cal0store !== null) &&  <VStack>
                <Heading fontSize={"3xl"}>Your slots</Heading>
                <Text>Store ID: {cal0store}</Text>
                <Heading fontSize={"3xl"}>Other's slots</Heading>
                <Text>Store ID: {cal1store}</Text>
                <Button onClick={computeIntersection}>Compute</Button>
                <Text>Intersection: {result}</Text>
              </VStack>
          }
        </VStack>
      </VStack>
    </>;
  }