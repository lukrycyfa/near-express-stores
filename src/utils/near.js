import environment from "./config";

import { connect, Contract, keyStores, WalletConnection } from "near-api-js";

import { formatNearAmount } from "near-api-js/lib/utils/format";

const nearEnv = environment("testnet");


  export async function initializeContract() {
    const near = await connect(  
      Object.assign(  
        { keyStore: new keyStores.BrowserLocalStorageKeyStore() },  
        nearEnv  
      )  
    );
  
    window.walletConnection = new WalletConnection(near, "express_store");  
    window.accountId = window.walletConnection.getAccountId();
    window.contract = new Contract( window.walletConnection.account(),  
      nearEnv.contractName,
      {
        viewMethods: ["getStores", "getStore" ,"getStoreProducts", "getPurchasedReference", "getSuggestedProducts"],
        changeMethods: ["addSuggestedProduct", "addStore", "updateStore", "deleteStore", "addStoreProduct", 
        "updateStoreProduct", "availStoreProduct", "rateStore", "deleteStoreProduct", "buyProduct", "deletePurchasedReference"],
      }
    );
  }

  export async function accountBalance() {
    return formatNearAmount(  
      (await window.walletConnection.account().getAccountBalance()).total,  
      2  
    );  
  }
  
  export async function getAccountId() {  
    return window.walletConnection.getAccountId();
  }
    
  export function login() {  
    return window.walletConnection.requestSignIn({  
      contractId: nearEnv.contractName,
    });
  }
  
  export function logout() {
    window.walletConnection.signOut();
    window.location.reload();
  }