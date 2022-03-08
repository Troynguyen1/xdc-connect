import Xdc3 from "xdc3";
import detectEthereumProvider from "@metamask/detect-provider";
import _ from "lodash";

import { GetRevertReason, IsJsonRpcError } from "../helpers/crypto";
import {
	CHAIN_DATA,
	HTTP_PROVIDER,
	LOADERS,
	WALLET_CONNECT,
	XDC_PAY,
} from "../helpers/constant";

import * as actions from "../actions";
import store from "../redux/store";
import { toast } from "react-toastify";
import { WithTimeout } from "../helpers/miscellaneous";
import { RemoveExpo } from "../helpers/math";
import NodeWalletConnect from "@walletconnect/node";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";

let addresses, connector, addressChangeIntervalRef;

export function IsWalletConnectSupported() {
  return Boolean(window.ethereum);
}

export async function GetProvider() {
  const provider = await detectEthereumProvider();
  return provider;
}

export async function GetChainId() {
  if(connector.connected) {
    return connector.networkId();
  }
}

export async function initWalletConnect() {
  try {

    connector = new NodeWalletConnect(
        {
          bridge: "https://bridge.walletconnect.org", // Required
        },
        {
          clientMeta: {
            description: "WalletConnect NodeJS Client",
            url: "https://nodejs.org/en/",
            icons: ["https://nodejs.org/static/images/logo.svg"],
            name: "WalletConnect",
          },
        },
      );
      if(connector.session.connected) {
        await connector.killSession();
      }
      connector.createSession().then(() => {
        // get uri for QR Code modal
        const uri = connector.uri;
        // display QR Code modal
        WalletConnectQRCodeModal.open(uri, () => {
        console.log("QR Code Modal closed");
        });
    });
    _initListerner();
  } catch (e) {
    console.log(e);
    if (e === "timeout") {
      toast(
        <div>
          Error while connecting to WalletConnect: Timeout. Please check your WalletConnect or
          try after refresh.
        </div>,
        {
          autoClose: false,
        }
      );
      return store.dispatch(actions.WalletDisconnected());
    }
    toast(<div>Error while connecting to WalletConnect provider</div>, {
      autoClose: false,
    });
    return store.dispatch(actions.WalletDisconnected());
  }
}

export function _initListerner() {
  window.ethereum.removeAllListeners();

  if (addressChangeIntervalRef) clearInterval(addressChangeIntervalRef);

  // addressChangeIntervalRef = setInterval(async () => {
  //   const accounts = await connector.accounts();
  //   if (_.isEqual(accounts, addresses)) return;
  //   console.log("accounts", accounts);
  //   addresses = accounts;
  //   store.dispatch(actions.AccountChanged(accounts[0]));
  // }, 1000);

  connector.on("connect", (error, payload) => {
    if (error) {
      throw error;
    }
  
    // Close QR Code Modal
    WalletConnectQRCodeModal.close();
  
    // Get provided accounts and chainId
    const { accounts, chainId } = payload.params[0];
    addresses = accounts;
    localStorage.removeItem(XDC_PAY);
    return store.dispatch(
        actions.WalletConnected({
          address: accounts[0],
          chain_id: chainId,
          loader: LOADERS.WalletConnect,
          explorer: CHAIN_DATA[chainId],
        })
      );
  });

  connector.on("session_update", (error, payload) => {
    if (error) {
      throw error;
    }
  
    // Get updated accounts and chainId
    const { accounts, chainId } = payload.params[0];
    addresses = accounts;
    store.dispatch(actions.AccountChanged(accounts[0]));
    store.dispatch(actions.NetworkChanged(chainId));
  });

  connector.on("disconnect", (error, payload) => {
    if (error) {
      throw error;
    }
    return store.dispatch(actions.WalletDisconnected());
    // Delete connector
  });

  window.ethereum.on("message", (data) => {
    console.log("message", data);
  });
}

export async function SendTransaction(tx) {
  
  let to = tx["to"];
  to = "0x".concat(to.substring(3, to.length))
  tx["to"] = to;
  console.log(tx, "transaction");
  return new Promise((resolve, reject) => {
    connector
        .sendTransaction(tx)
        .then(async (result) => {
          let interval;
          try {
            interval = setInterval(async () => {
              const provider = await GetProvider();
              const xdc3 = new Xdc3(provider); 
              const receipt = await xdc3.eth.getTransactionReceipt(result);
              if(receipt && receipt.status) {
                resolve(receipt);
                clearInterval(interval);
              }
            }, 2000);
          }
          catch (error) {
            clearInterval(interval);
            reject(error);
            reject({ message: "Transaction Failed" });
            console.error(error);
          };
        })
  });
}

export async function Disconnect() {
  if (connector) await connector.killSession();
}

export function checkConnection() {
  console.log("Connector: ", connector);
};