import * as React from "react"
import { useEffect, useState } from "react";
import {
  ChakraProvider,
  Box,
  Text,
  VStack,
  Grid,
  theme,
  Button,
  HStack,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { ReactTyped } from "react-typed";
import * as ethers from "ethers";

import { compute } from "./nillion/compute";
import { getUserKeyFromSnap } from "./nillion/getUserKeyFromSnap";
import { retrieveSecretInteger } from "./nillion/retrieveSecretInteger";
import { storeProgram } from "./nillion/storeProgram";
import { storeSecretsInteger } from "./nillion/storeSecretsInteger";
import SecretInput from "./SecretInput";
import { FaGoogle } from "react-icons/fa";

interface StringObject {
  [key: string]: string | null;
}

const appName = "PrivyCal";

export const SampleApp = () => {

  const [parties] = useState<string[]>(["Party1"]);
  const [outputs] = useState<string[]>(["my_output"]);
  const [computeResult, setComputeResult] = useState<string | null>(null);

  const [connectedToSnap, setConnectedToSnap] = useState<boolean>(false);
  const [userKey, setUserKey] = useState<string | null>(null);
  const [nillion, setNillion] = useState<any>(null);
  const [nillionClient, setNillionClient] = useState<any>(null);
  const [programName] = useState<string>("tiny_secret_addition");
  const [programId, setProgramId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);


  const [storedSecretsNameToStoreId, setStoredSecretsNameToStoreId] = useState<StringObject>({
    my_int1: null,
    my_int2: null,
  });

  async function handleConnectToSnap() {
    const snapResponse = await getUserKeyFromSnap();
    setUserKey(snapResponse?.user_key || null);
    setConnectedToSnap(snapResponse?.connectedToSnap || false);
    // console.log(userKey);
  }

  async function handleStoreProgram() {
    await storeProgram(nillionClient, programName).then(setProgramId);
  }

  useEffect(() => {
    if (userKey) {
      console.log(userKey);
      const getNillionClientLibrary = async () => {
        const nillionClientUtil = await import("./nillion/nillionClient");
        const libraries = await nillionClientUtil.getNillionClient(userKey);
        setNillion(libraries.nillion);
        setNillionClient(libraries.nillionClient);
        return libraries.nillionClient;
      };
      getNillionClientLibrary().then(nillionClient => {
        const user_id = nillionClient.user_id;
        setUserId(user_id);
      });
    }
  }, [userKey]);

  async function handleRetrieveInt(secret_name: string, store_id: string | null) {
    if (store_id) {
      const value = await retrieveSecretInteger(nillionClient, store_id, secret_name);
      alert(`${secret_name} is ${value}`);
    }
  }

  async function handleSecretFormSubmit(
    secretName: string,
    secretValue: string,
    permissionedUserIdForRetrieveSecret: string | null,
    permissionedUserIdForUpdateSecret: string | null,
    permissionedUserIdForDeleteSecret: string | null,
    permissionedUserIdForComputeSecret: string | null,
  ) {
    if (programId) {
      const partyName = parties[0];
      await storeSecretsInteger(
        nillion,
        nillionClient,
        [{ name: secretName, value: secretValue }],
        programId,
        partyName,
        permissionedUserIdForRetrieveSecret ? [permissionedUserIdForRetrieveSecret] : [],
        permissionedUserIdForUpdateSecret ? [permissionedUserIdForUpdateSecret] : [],
        permissionedUserIdForDeleteSecret ? [permissionedUserIdForDeleteSecret] : [],
        permissionedUserIdForComputeSecret ? [permissionedUserIdForComputeSecret] : [],
      ).then(async (store_id: string) => {
        console.log("Secret stored at store_id:", store_id);
        setStoredSecretsNameToStoreId(prevSecrets => ({
          ...prevSecrets,
          [secretName]: store_id,
        }));
      });
    }
  }

  // compute on secrets
  async function handleCompute() {
    if (programId) {
      await compute(nillion, nillionClient, Object.values(storedSecretsNameToStoreId), programId, outputs[0]).then(
        result => setComputeResult(result),
      );
    }
  }
  
  return <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <VStack spacing={8}>
          <Button onClick={handleConnectToSnap} disabled={!connectedToSnap}>
            Connect
          </Button>
          <Text>
            {userKey}
          </Text>
          <Button onClick={handleStoreProgram}>
            Store Program
          </Button>
          <Text>{programId}</Text>
          <SecretInput onSubmit={handleSecretFormSubmit} otherPartyId={null} secretName="my_int1" secretType="number"/>
          <SecretInput onSubmit={handleSecretFormSubmit} otherPartyId={null} secretName="my_int2" secretType="number"/>
          {!computeResult && (
            <Button
              onClick={handleCompute}
              disabled={Object.values(storedSecretsNameToStoreId).every(v => !v)}
            >
              Compute on {programName}
            </Button>
          )}
          {computeResult && <Text>✅ Compute result: {computeResult}</Text>}
        </VStack>
      </Grid>
    </Box>;
}

const HomePage = () => {
  function handleScroll() {
    window.scrollBy({
      top: window.innerHeight,
      left: 0, 
      behavior: 'smooth',
    });
  }

  return <>
    <VStack paddingX={65} paddingY={0} justify="space-around" alignItems="left">
      {/* Page 1 */}
      <VStack minH="100vh" justify="space-evenly">
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
          <Button borderRadius={20}>Try&nbsp;<Text textColor="aqua">{appName}</Text>&nbsp;now!</Button>
        </HStack>
      </VStack>
      {/* Page 2 */}
      <VStack minH="100vh" justify="space-evenly">
        <Heading fontSize={"5xl"}>How {appName} works?</Heading>
      </VStack>
      {/* Page 3 */}
      <VStack minH="100vh" justify="space-evenly">
        <Heading fontSize={"5xl"}>How {appName} works?</Heading>
      </VStack>
      {/* Footer */}
      <VStack alignItems={"end"} paddingBottom={10}>
        <Heading fontSize={40} textColor="aqua">{appName}</Heading>
        <Text fontWeight={"thin"}>© 2024 Kanav Gupta</Text>
      </VStack>
    </VStack>
    <Button size="lg" position={"fixed"} right={10} bottom={10} onClick={handleScroll} borderRadius={30}>
      {"⟩"}
    </Button>
  </>;
}

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

const Calender = () => {

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

function addressTruncate(addr: string) {
  return addr.substring(0, 6).toLowerCase() + "..." + addr.substring(addr.length - 4).toLowerCase();
}

const ConnectWallet = () => {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to connect/disconnect the wallet
  async function connectWallet() {
    if (!connected) {
      setLoading(true);
      // Connect the wallet using ethers.js
      // @ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const _walletAddress = await signer.getAddress();
      setConnected(true);
      setWalletAddress(_walletAddress);
      setLoading(false);
    } else {
      // Disconnect the wallet
      // @ts-ignore
      // window.ethereum.selectedAddress = null;
      setConnected(false);
      setWalletAddress("");
    }
  }

  return <VStack paddingX={65} paddingY={0} justify="space-around" alignItems="left">
    {/* Page 2 */}
    <VStack minH="100vh" justify="space-evenly" spacing={"-40vh"}>
      <Heading fontSize={"5xl"}>Step 1: Connect your ethereum wallet</Heading>
      {connected && <Button onClick={connectWallet} loadingText="Connecting..." isLoading={loading} bg="#66AA6A" _hover={{bg: "#66BB6A"}}>
        {"Connected " + addressTruncate(walletAddress)}
      </Button>}
      {!connected && <Button onClick={connectWallet} loadingText="Connecting..." isLoading={loading} >
        Connect Wallet
      </Button>}
    </VStack>
  </VStack>;
}

export const App = () => {
  const numPages = 3;
  const [page, setPage] = useState<number>(0);

  return <ChakraProvider theme={theme}>
    {page === 0 && <HomePage /> }
    {page === 1 && <ConnectWallet />}
    {page === 2 && <Calender />}

    <Button size="lg" position={"fixed"} left={10} bottom={"50%"} borderRadius={30} isDisabled={page===0} onClick={
      () => setPage(p => p === 0 ? p : (p - 1))
    }>
      {"⟨"}
    </Button>
    
    <Button size="lg" position={"fixed"} right={10} bottom={"50%"} borderRadius={30}isDisabled={page===(numPages-1)} onClick={
      () => setPage(p => (p === (numPages-1)) ? p : (p + 1))
    }>
      {"⟩"}
    </Button>
  </ChakraProvider>
}