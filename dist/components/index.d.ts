import React from "react"
import { Transaction as Transaction_, TransactionReceipt } from "xdc3-core"

export interface Account {
  address: string;
  privateKey: string;
}

export interface Wallet {
  connected: Boolean;
  address: string;
  chain_id: number;
  valid_network: Boolean;
  explorer: string;
  rpc_provider: string;
  ws_provider: string;
  loader: string;
  account: null;
}

export type themes = "light" | "dark"

export type validChainId = 50 | 51 | 551

export type ValidProvider = "xinpay" | "keystore" | "privatekey" | "dcent-inapp"


export interface WalletConnectProps {
  onDisconnect?: (wallet: Wallet) => any
  onConnect?: (wallet: Wallet) => any
  onAddressChange?: (wallet: Wallet) => any
  btnClass?: string
  btnName?: string
  theme?: themes
  disabled?: boolean
  deafaultChainId?: validChainId
  enabledProviders?: ValidProvider[]
}

export class XdcConnect extends React.Component<WalletConnectProps, any> { }


export type Transaction = Transaction_



/**
 * 
 * Returns current instance of the wallet
 * @return wallet
 * 
 */
export function GetWallet(): Wallet;
/**
 * 
 * Send a PAYABLE / NONPAYBLE transaction
 * @param tx - standard xdc3 / web3 transaction object
 * @returns transaction receipt
 * 
 */
export function SendTransaction(tx: Transaction): Promise<TransactionReceipt>;

/**
 * @param tx - standard xdc3 / web3 transaction object
 * @returns HEX encoded response
 */
export function CallTransaction(tx: Transaction): Promise<string>;

/**
 * 
 * Disconnects wallet with the current provider
 * 
 */
export function Disconnect(): void;

/**
 * 
 * Will return native chain balance
 * 
 */
export function GetNativeBalance(): Promise<number | string>;