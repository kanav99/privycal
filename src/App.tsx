import * as React from "react"
import { useEffect, useState } from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Button,
  Input,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { Logo } from "./Logo"

import { compute } from "./nillion/compute";
import { getUserKeyFromSnap } from "./nillion/getUserKeyFromSnap";
import { retrieveSecretCommand } from "./nillion/retrieveSecretCommand";
import { retrieveSecretInteger } from "./nillion/retrieveSecretInteger";
import { storeProgram } from "./nillion/storeProgram";
import { storeSecretsInteger } from "./nillion/storeSecretsInteger";
import SecretInput from "./SecretInput";

interface StringObject {
  [key: string]: string | null;
}



export const App = () => {

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
  
  return <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
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
              className="btn btn-sm btn-primary mt-4"
              onClick={handleCompute}
              disabled={Object.values(storedSecretsNameToStoreId).every(v => !v)}
            >
              Compute on {programName}
            </Button>
          )}
          {computeResult && <Text>✅ Compute result: {computeResult}</Text>}
        </VStack>
      </Grid>
    </Box>
  </ChakraProvider>;
}
