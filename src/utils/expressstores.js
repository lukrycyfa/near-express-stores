import { v4 as uuid4 } from "uuid";
import { parseNearAmount } from "near-api-js/lib/utils/format";


const GAS = 100000000000000;

// get all Stores
export async function getStores() {
    // call the contract function
    return window.contract.getStores();
}

// get a single Store 
export async function getStore(storeId) {
    // call the contract function
    return window.contract.getStore({storeId});
}

// get a single Store Product
export async function getStoreProducts(storeId) {
    // call the contract function
    return window.contract.getStoreProducts({storeId});
}

// get Purchased references related to accountId
export async function getPurchasedReferences(accountId) {
    // call the contract function
    return window.contract.getPurchasedReference({accountId});
}

// get suggested products
export async function getSuggestedProducts() {
    // call the contract function
    return window.contract.getSuggestedProducts();
}

// add  a suggested product
export async function addSuggestedProduct(product) {
    product.id = uuid4();
    // call the contract function
    return window.contract.addSuggestedProduct({product}, GAS);
}

// add a store
export async function addStore(store) {
    store.id = uuid4();
    // call the contract function
    return window.contract.addStore({store}, GAS); 
}

// update a store
export async function updateStore(store) {
    // call the contract function
    return window.contract.updateStore({store}, GAS);
}

// delete a store 
export async function deleteStore() {
    // call the contract function
    return window.contract.deleteStore(GAS);
}

// add a product to a store
export async function addStoreProduct(product) {
    product.id = uuid4();
    product.price = parseNearAmount(product.price + "");
    // call the contract function
    return window.contract.addStoreProduct({product}, GAS);
}

// update a product in a store
export async function updateStoreProduct(productId, product) {
    product.price = parseNearAmount(product.price + "");
    // call the contract function
    return window.contract.updateStoreProduct({productId, product}, GAS);
}

// avail products in a store
export async function availStoreProduct(productId, amount) {
    // call the contract function
    return window.contract.availStoreProduct({productId, amount}, GAS);
}

// rate a store
export async function rateStore(storeId, rating) {
    // call the contract function
    return window.contract.rateStore({storeId, rating}, GAS);
}

// delete a product in a store
export async function deleteStoreProduct(productId) {
    // call the contract function
    return window.contract.deleteStoreProduct({productId}, GAS);
}

// buy a product from a store
export async function buyProduct(storeId, productId, price) {
    // call the contract function
    return window.contract.buyProduct({storeId, productId}, GAS, price);
}

// delete a purchased refrences
export async function deletePurchasedReference(idx) {
    // call the contract function
    return window.contract.deletePurchasedReference({idx}, GAS);
}  