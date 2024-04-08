export const nillionConfig = {
  websockets: [process.env.REACT_APP_NILLION_WEBSOCKETS],
  cluster_id: process.env.REACT_APP_NILLION_CLUSTER_ID,
  payments_config: {
    rpc_endpoint: process.env.REACT_APP_NILLION_BLOCKCHAIN_RPC_ENDPOINT,
    smart_contract_addresses: {
      blinding_factors_manager: process.env.REACT_APP_NILLION_BLINDING_FACTORS_MANAGER_SC_ADDRESS,
      payments: process.env.REACT_APP_NILLION_PAYMENTS_SC_ADDRESS,
    },
    signer: {
      wallet: {
        // @ts-ignore
        chain_id: parseInt(process.env.REACT_APP_NILLION_CHAIN_ID || 0),
        private_key: process.env.REACT_APP_NILLION_WALLET_PRIVATE_KEY,
      },
    },
  },
};

// console.log;
