import Xdc3 from "xdc3";
import { toast } from "react-toastify";

import * as xinpay from "./xinpay";
import * as account from "./account";
import * as dcentInApp from "./dcentInAppBrowser";
import * as walletConnect from "./walletConnect";

import store from "../redux/store";
import { LOADERS, DEFAULT_PROVIDER, XDC_PAY } from "../helpers/constant";
import { BUILD_TX_LINK, IsJsonRpcError } from "../helpers/crypto";

function GetFuncFromLoader(loader) {
  switch (loader) {
    case LOADERS.Xinpay:
      return xinpay;
    case LOADERS.Keystore:
      return account;
    case LOADERS.Privatekey:
      return account;
    case LOADERS.DcentInApp:
      return dcentInApp;
    case LOADERS.WalletConnect:
      return walletConnect;
    default:
      return xinpay;
  }
}

/**
 *
 *
 * @note directly get from default provider
 *
 */
export function GetNativeBalance(address) {
  return new Promise((resolve, reject) => {
    const data = store.getState();
    const { rpc_provider } = data.wallet;

    let provider = DEFAULT_PROVIDER;

    if (rpc_provider) {
      provider = rpc_provider;
    }

    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(provider));
    if (!address) {
      const wallet = store.getState();
      address = wallet.wallet.address;
    }

    xdc3.eth.getBalance(address).then(resolve).catch(reject);
  });
}

export const SendTransaction = (tx) => {
  return new Promise((resolve, reject) => {
    const wallet = store.getState().wallet;
    let toastId = toast("Processing TX ...", {
      position: "bottom-right",
      type: "processing-tx",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      closeButton: false,
    });
    return GetFuncFromLoader(wallet.loader)
      .SendTransaction(tx)
      .then((resp) => {
        if (resp.transactionHash) {
          const { transactionHash } = resp;
          toast(
            <div>
              Success&nbsp;
              <a
                href={BUILD_TX_LINK(wallet.explorer, transactionHash)}
                rel="noreferrer"
                target="_blank"
              >
                HASH
              </a>
            </div>,
            {
              position: "bottom-right",
              type: "success-tx",
              autoClose: false,
              hideProgressBar: false,
              closeButton: true,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          );
        }

        resolve(resp);
      })
      .catch((e) => {
        console.log("resp", IsJsonRpcError(e));
        console.log("resp", e, e.message);
        const message = e.message || <>Failing Transaction</>;
        toast(
          <div>
            <b>Error</b>:{message}
          </div>,
          {
            position: "bottom-right",
            type: "error",
            autoClose: false,
            hideProgressBar: false,
            closeButton: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        reject(e);
      })
      .finally(() => {
        if (toastId) toast.dismiss(toastId);
      });
  });
};

export const CallTransaction = (tx) => {
  const loader = store.getState().wallet.loader;
  return GetFuncFromLoader(loader).CallTransaction(tx);
};

export const Disconnect = () => {
  localStorage.removeItem(XDC_PAY);
  xinpay.Disconnect();
  const loader = store.getState().wallet.loader;
  return GetFuncFromLoader(loader).Disconnect();
}
