import Xdc3 from "xdc3";
import detectEthereumProvider from "@metamask/detect-provider";
import _ from "lodash";

import { GetRevertReason, IsJsonRpcError } from "../helpers/crypto";
import {
  CHAIN_DATA,
  HTTP_PROVIDER,
  LOADERS,
  XDC_PAY,
  WALLET_CONNECT,
} from "../helpers/constant";

import * as actions from "../actions";
import store from "../redux/store";
import { toast } from "react-toastify";
import { WithTimeout } from "../helpers/miscellaneous";
import { RemoveExpo } from "../helpers/math";

let addresses, xdc3, addressChangeIntervalRef;

export function IsXdc3Supported() {
  return Boolean(window.ethereum);
}

export async function GetProvider() {
  const provider = await detectEthereumProvider();
  return provider;
}

export const MainnetProvider = () => {
  return new Xdc3.providers.HttpProvider(HTTP_PROVIDER[50]);
};

export const ApothemProvider = () => {
  return new Xdc3.providers.HttpProvider(HTTP_PROVIDER[50]);
};

export async function GetChainId() {
  let xdc3 = new Xdc3(await GetProvider());
  return await xdc3.eth.net.getId();
}

export async function initXdc3() {
  try {
    if (!window.ethereum) {
      toast(
        <div>
          XDCPay not available in the browser. Please refer{" "}
          <a href="https://chrome.google.com/webstore/detail/xdcpay/bocpokimicclpaiekenaeelehdjllofo?hl=en">
            here
          </a>
        </div>,
        {
          autoClose: false,
        }
      );

      return store.dispatch(actions.WalletDisconnected());
    }

    const currentProvider = await GetCurrentProvider();

    if (currentProvider === "metamask") {
      toast(
        <div>
          Metamask detected. Please disable Metamask & install{" "}
          <a href="https://chrome.google.com/webstore/detail/xdcpay/bocpokimicclpaiekenaeelehdjllofo?hl=en">
            XDCPay
          </a>
          .
        </div>,
        {
          autoClose: false,
        }
      );
      return store.dispatch(actions.WalletDisconnected());
    }

      if (currentProvider !== "xinpay") {
        toast(
          <div>
            XDCPay not available in the browser. Please refer{" "}
            <a href="https://chrome.google.com/webstore/detail/xdcpay/bocpokimicclpaiekenaeelehdjllofo?hl=en">
              here
            </a>
          </div>,
          {
            autoClose: false,
          }
        );
        return store.dispatch(actions.WalletDisconnected());
      }

    const isLocked = await WithTimeout(IsLocked, { timeout: 2000 });
    if (isLocked === true) {
      toast("Please unlock XDCPay wallet to continue", { autoClose: 2000 });
      return store.dispatch(actions.WalletDisconnected());
    }

    if ((await GetCurrentProvider()) !== "xinpay") {
      toast(
        <div>
          XDCPay not available in the browser. Please refer{" "}
          <a href="https://chrome.google.com/webstore/detail/xdcpay/bocpokimicclpaiekenaeelehdjllofo?hl=en">
            here
          </a>
        </div>,
        {
          autoClose: false,
        }
      );
      return store.dispatch(actions.WalletDisconnected());
    }
    const isConnected = await window.ethereum.isConnected();

    await window.ethereum.enable();
    _initListerner();
    const provider = await GetProvider();
    xdc3 = new Xdc3(provider);
    const accounts = await xdc3.eth.getAccounts();
    addresses = accounts;
    const chain_id = await xdc3.eth.getChainId();

    localStorage.removeItem(WALLET_CONNECT);
    localStorage.setItem(
      XDC_PAY,
      JSON.stringify({
        connected: true,
        chain_id: chain_id,
        address: accounts[0],
        loader: LOADERS.Xinpay,
        explorer: CHAIN_DATA[chain_id],
      })
    );

    return store.dispatch(
      actions.WalletConnected({
        address: accounts[0],
        chain_id,
        loader: LOADERS.Xinpay,
        explorer: CHAIN_DATA[chain_id],
      })
    );
  } catch (e) {
    if (e === "timeout") {
      toast(
        <div>
          Error while connecting to XDCPay: Timeout. Please check your XDCPay or
          try after refresh.
        </div>,
        {
          autoClose: false,
        }
      );
      return store.dispatch(actions.WalletDisconnected());
    }
    toast(<div>Error while connecting to XDCPay provider</div>, {
      autoClose: false,
    });
    return store.dispatch(actions.WalletDisconnected());
  }
}

export function _initListerner() {
  if (!window.ethereum) return;
  window.ethereum.removeAllListeners();

  if (addressChangeIntervalRef) clearInterval(addressChangeIntervalRef);

  GetProvider().then((provider) => {
    xdc3 = new Xdc3(provider);
    addressChangeIntervalRef = setInterval(async () => {
      const accounts = await xdc3.eth.getAccounts();
      if (_.isEqual(accounts, addresses)) return;
      console.log("accounts", accounts);
      addresses = accounts;
      store.dispatch(actions.AccountChanged(accounts[0]));
    }, 1000);
  });

  window.ethereum.on("accountsChanged", async (data) => {
    const accounts = await xdc3.eth.getAccounts();
    addresses = accounts;
    store.dispatch(actions.AccountChanged(accounts[0]));
  });

  window.ethereum.on("chainChanged", async (data) => {
    const chain_id = await xdc3.eth.getChainId();
    store.dispatch(actions.NetworkChanged(chain_id));
  });

  window.ethereum.on("connect", async (data) => {
    xdc3 = new Xdc3(await GetProvider());
    const accounts = await xdc3.eth.getAccounts();
    const chain_id = await xdc3.eth.getChainId();
    addresses = accounts;
    return store.dispatch(
      actions.WalletConnected({
        address: accounts[0],
        chain_id,
        loader: LOADERS.Xinpay,
        explorer: CHAIN_DATA[chain_id],
      })
    );
  });

  window.ethereum.on("disconnect", (data) => {
    console.log("disconnect", data);
    localStorage.removeItem(XDC_PAY);
    return store.dispatch(actions.WalletDisconnected());
  });

  window.ethereum.on("message", (data) => {
    console.log("message", data);
  });
}

export function removeEthereumListener() {
  if (window.ethereum) {
    return window.ethereum.removeAllListeners();
  } else {
    toast(
      <div>
        XDCPay not available in the browser. Please refer{" "}
        <a href="https://chrome.google.com/webstore/detail/xdcpay/bocpokimicclpaiekenaeelehdjllofo?hl=en">
          here
        </a>
      </div>,
      {
        autoClose: false,
      }
    );
    return;
  }
}

export async function GetCurrentProvider() {
  if (IsXdc3Supported() !== true) return null;

  if (window.web3.currentProvider.isMetaMask) {
    const chainId = await GetChainId();
    if ([1, 4, 421611, 137, 80001, 50, 51, 551].includes(chainId))
			return "xinpay";
    return "metamask";
  }

  if (window.web3.currentProvider.isTrust) return "trust";

  if (window.web3.currentProvider.isStatus) return "status";

  if (typeof window.SOFA !== "undefined") return "coinbase";

  if (typeof window.__CIPHER__ !== "undefined") return "cipher";

  if (window.web3.currentProvider.constructor.name === "EthereumProvider")
    return "mist";

  if (window.web3.currentProvider.constructor.name === "Xdc3FrameProvider")
    return "parity";

  if (
    window.web3.currentProvider.host &&
    window.web3.currentProvider.host.indexOf("infura") !== -1
  )
    return "infura";

  if (
    window.web3.currentProvider.host &&
    window.web3.currentProvider.host.indexOf("localhost") !== -1
  )
    return "localhost";

  return "unknown";
}

export const GetNativeBalance = (address) => {
  const xdc3 = new Xdc3(window.web3.currentProvider);
  return xdc3.eth.getBalance(address);
};

export async function SendTransaction(tx) {
  return new Promise((resolve, reject) => {
    GetProvider()
      .then(async (provider) => {
        const xdc3 = new Xdc3(provider);
        const data = store.getState();
        const { gasMultiplier = 1 } = data.wallet;

        let gasLimit, gasPrice;

        try {
          gasLimit = await WithTimeout(() => xdc3.eth.estimateGas(tx), {
            timeout: 4999,
            onTimeout: 5000000,
          });
        } catch (e) {
          const reason = await GetRevertReason(tx);
          reject({ message: reason });
          return;
        }

        try {
          gasPrice = await xdc3.eth.getGasPrice();
          gasPrice = RemoveExpo(
            parseFloat(gasMultiplier) * parseFloat(gasPrice)
          );
        } catch (e) {
          console.log(e);
        }

        if (
          gasPrice &&
          !isNaN(parseFloat(gasPrice)) &&
          parseFloat(gasPrice) > 0
        )
          tx["gasPrice"] = gasPrice;

        tx["gas"] = gasLimit;

        xdc3.eth.sendTransaction(tx, (err, hash) => {
          if (err) reject(err);
          let interval = setInterval(async () => {
            try {
              const receipt = await xdc3.eth.getTransactionReceipt(hash);
              if (receipt !== null) {
                if (receipt.status) {
                  clearInterval(interval);
                  resolve(receipt);
                } else {
                  clearInterval(interval);
                  // reject(receipt);
                  xdc3.eth
                    .getTransaction(receipt.transactionHash)
                    .then((tx) => {
                      tx = { ...tx };
                      xdc3.eth
                        .call(tx)
                        .then((x) => {
                          const other = x.replace("0x", "").slice(8);
                          const buf = Buffer.from(other, "hex");
                          reject({ message: buf.toString() });
                        })
                        .catch(() => reject({ message: "Transaction Failed" }));
                    });
                }
              }
            } catch (e) {
              clearInterval(interval);
              reject(e);
            }
          }, 2000);
        });
      })
      .catch((e) => {
        console.log(arguments, e);
        console.log("resp", IsJsonRpcError(e));
        console.log("resp", e);
        reject(e);
      });
  });
}

export async function CallTransaction(tx) {
  return new Promise((resolve, reject) => {
    GetProvider()
      .then(async (provider) => {
        const xdc3 = new Xdc3(provider);
        let gasLimit;

        try {
          gasLimit = await WithTimeout(() => xdc3.eth.estimateGas(tx), {
            timeout: 4999,
            onTimeout: 5000000,
          });
        } catch (e) {
          const reason = await GetRevertReason(tx);
          reject({ message: reason });
          return;
        }

        tx["gas"] = gasLimit;

        xdc3.eth
          .call(tx)
          .then((date) => {
            resolve(date);
          })
          .catch((e) => reject(e));
      })
      .catch((e) => {
        console.log(arguments, e);
        console.log("resp", IsJsonRpcError(e));
        console.log("resp", e);
        reject(e);
      });
  });
}

export async function IsLocked() {
  let xdc3 = new Xdc3(await GetProvider());
  const accounts = await xdc3.eth.getAccounts();
  return _.isEmpty(accounts);
}

export async function Disconnect() {
  const provider = await GetProvider();
  xdc3 = new Xdc3(provider);
  return xdc3.eth.currentProvider.disconnect;
}

export function CheckWalletConnection() {
  if (!window.ethereum) {
    toast(
      <div>
        XDCPay not available in the browser. Please refer{" "}
        <a href="https://chrome.google.com/webstore/detail/xdcpay/bocpokimicclpaiekenaeelehdjllofo?hl=en">
          here
        </a>
      </div>,
      {
        autoClose: false,
      }
    );
  }
  const connectWalletConnector = JSON.parse(
    localStorage.getItem(WALLET_CONNECT)
  );
  const xdcPayConnector = JSON.parse(localStorage.getItem(XDC_PAY));

  let CurrentWalletStatus = null;

  if (connectWalletConnector) {
    CurrentWalletStatus = connectWalletConnector;
    CurrentWalletStatus.loader = "wallet-connect";
  } else if (xdcPayConnector) {
    CurrentWalletStatus = xdcPayConnector;
  } else {
    return false;
  }

  if (CurrentWalletStatus === null) return false;
  console.log("CurrentWalletStatus: ", CurrentWalletStatus);

  return GetProvider()
    .then((provider) => {
      console.log("Provider", provider);
      xdc3 = new Xdc3(provider);
      xdc3.eth
        .getAccounts()
        .then((accounts) => {
          console.log("Accounts", accounts);
          if (connectWalletConnector) {
            xdc3.eth.getChainId().then((chain_id) => {
              store.dispatch(
                actions.WalletConnected({
                  address: CurrentWalletStatus.accounts[0],
                  chain_id: CurrentWalletStatus.chainId,
                  loader: CurrentWalletStatus.loader,
                  explorer: CHAIN_DATA[chain_id],
                })
              );
            });
            return true;
          } else if (CurrentWalletStatus.address === accounts[0]) {
            store.dispatch(
              actions.WalletConnected({
                address: CurrentWalletStatus.address,
                chain_id: CurrentWalletStatus.chain_id,
                loader: CurrentWalletStatus.loader,
                explorer: CurrentWalletStatus.explorer,
              })
            );
            return true;
          } else {
            store.dispatch(actions.WalletDisconnected());
            return false;
          }
        })
        .catch(() => {
          return false;
        });
    })
    .catch(() => {
      return false;
    });
}
