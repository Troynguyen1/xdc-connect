"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XDC_PAY = exports.WALLET_CONNECT = exports.VALID_CHAINS = exports.NETWORK_NAME = exports.LOADERS = exports.HTTP_PROVIDER = exports.EXPLORER = exports.DEFAULT_PROVIDER = exports.DEFAULT_CHAIN_ID = exports.CHAIN_DATA = void 0;
var LOADERS = {
  Xinpay: "xinpay",
  Keystore: "keystore",
  Privatekey: "privatekey",
  MetaMask: "metamask",
  DcentInApp: "dcent-inapp",
  WalletConnect: "wallet-connect"
};
exports.LOADERS = LOADERS;
var VALID_CHAINS = [1, 4, 421611, 137, 80001, 50, 51, 551];
exports.VALID_CHAINS = VALID_CHAINS;
var NETWORK_NAME = {
  1: "",
  4: "",
  421611: "",
  137: "",
  80001: "",
  50: "XinFin",
  51: "Apothem",
  551: "XDC Devnet"
};
exports.NETWORK_NAME = NETWORK_NAME;
var CHAIN_DATA = {
  "0x32": "https://explorer.xinfin.network",
  "0x33": "https://explorer.apothem.network",
  "0x227": "https://devnetscan.apothem.network",
  50: "https://explorer.xinfin.network",
  51: "https://explorer.apothem.network",
  551: "https://devnetscan.apothem.network"
};
exports.CHAIN_DATA = CHAIN_DATA;
var HTTP_PROVIDER = {
  50: "https://rpc.xinfin.network",
  51: "https://rpc.apothem.network",
  551: "https://devnetrpc.apothem.network"
};
exports.HTTP_PROVIDER = HTTP_PROVIDER;
var DEFAULT_CHAIN_ID = 50;
exports.DEFAULT_CHAIN_ID = DEFAULT_CHAIN_ID;
var DEFAULT_PROVIDER = HTTP_PROVIDER[VALID_CHAINS[0]];
exports.DEFAULT_PROVIDER = DEFAULT_PROVIDER;
var EXPLORER = CHAIN_DATA[DEFAULT_CHAIN_ID];
exports.EXPLORER = EXPLORER;
var XDC_PAY = "xdc_pay";
exports.XDC_PAY = XDC_PAY;
var WALLET_CONNECT = "walletconnect";
exports.WALLET_CONNECT = WALLET_CONNECT;