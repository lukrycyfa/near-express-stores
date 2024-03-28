// classes and method imports
import { Store, Product, allSuggestedProducts, SuggestedProduct, allStores, allPurchasedReference, PurchasedReference } from './model';

import { ContractPromiseBatch, context } from 'near-sdk-as';

// A function called to create a SuggestedProduct. with the max number of `SuggestedProduct == 6`
export function addSuggestedProduct(product: SuggestedProduct): void {
    // Assert the product payload, create an instance for `allSuggestedProducts` if none exists,
    // assert the max number of SuggestedProduct and the oldest `SuggestedProduct lifeSpan`
    // before adding a new suggested product and updating allSuggestedProducts.
    // Additionally, add a check to ensure that only authorized accounts or contracts can call this function.
    assertValidity(product.name.length > 0 && product.description.length > 0 && product.image.length > 0, "Invalid payload");
    assertValidity(isAuthorized(), "Only authorized accounts or contracts can add suggested products");

    if (allSuggestedProducts.get("all") === null) {
        allSuggestedProducts.set("all", new Array());
    }

    const allSuggestedProductsArray = allSuggestedProducts.getSome("all");
    if (allSuggestedProductsArray.length === 6) {
        const oldestProductLifeSpan = allSuggestedProductsArray[0].lifeSpan;
        const oldestProductDate = new Date(oldestProductLifeSpan / 1000000);
        assertValidity(!(oldestProductLifeSpan > context.blockTimestamp),
            `We are out of spots for suggested products. A spot will be available by ${oldestProductDate.toDateString()} ${oldestProductDate.toTimeString()} GMT`);
    }

    if (allSuggestedProductsArray.length === 6 && allSuggestedProductsArray[0].lifeSpan < context.blockTimestamp) {
        SuggestedProduct.deleteProduct(allSuggestedProductsArray, 0);
    }

    allSuggestedProductsArray.push(SuggestedProduct.suggestedProductFromPayload(product));
    allSuggestedProducts.set("all", allSuggestedProductsArray);
}

// A function called to create a Store.
export function addStore(store: Store): void {
    // Assert the `context.sender`, store payload, create a store and update allStores.
    // Additionally, add a check to ensure that the `context.sender` is a valid account ID.
    assertValidity(allStores.get(context.sender) === null, "A store with this User already exists");
    assertValidity(store.name.length > 0 && store.description.length > 0 && store.banner.length > 0 &&
        store.location.length > 0, "Invalid payload");
    assertValidity(isValidAccountId(context.sender), "Invalid account ID");

    store.id = context.sender;
    allStores.set(context.sender, Store.storeFromPayload(store));
}

// A function called to update a Store.
export function updateStore(store: Store): void {
    // Assert the `context.sender`, store payload, update the store and update allStores.
    assertValidity(allStores.get(context.sender) !== null, `A store with ${context.sender} does not exist`);
    const updateStore = allStores.getSome(context.sender);
    assertValidity(store.name.length > 0 && store.description.length > 0 && store.banner.length > 0 &&
        store.location.length > 0, "Invalid payload");

    updateStore.updateStoreFromPayload(store);
    allStores.set(updateStore.id, updateStore);
}

// A function called to delete a Store.
export function deleteStore(): void {
    assertValidity(allStores.get(context.sender) !== null, `A store with ${context.sender} does not exist`);
    // Assert the `context.sender`, delete a Store.
    allStores.delete(context.sender);
}

// A function called to add a Store Product.
export function addStoreProduct(product: Product): void {
    // Assert the `context.sender`, product payload, add a product to a store and update allStores.
    assertValidity(allStores.get(context.sender) !== null, `A store with ${context.sender} does not exist`);
    const updateStore = allStores.getSome(context.sender);
    assertValidity(product.name.length > 0 && product.description.length > 0 && product.image.length > 0 && !product.price.isZero(), "Invalid payload");

    updateStore.addStoreProduct(product);
    allStores.set(updateStore.id, updateStore);
}

// A function called to update a Store Product.
export function updateStoreProduct(productId: string, product: Product): void {
    // Assert the `context.sender`, product payload, productId, update a product in the store and update allStores.
    assertValidity(allStores.get(context.sender) !== null, `A store with ${context.sender} does not exist`);
    const updateStore = allStores.getSome(context.sender);
    assertValidity(product.name.length > 0 && product.description.length > 0 && product.image.length > 0 && !product.price.isZero(), "Invalid payload");

    const productIdx = findEntryProduct(updateStore.storeProducts, productId);
    assertValidity(!(productIdx < 0), `A product with ${productId} does not exist on this store`);

    updateStore.updateStoreProduct(updateStore.storeProducts[productIdx], product);
    allStores.set(updateStore.id, updateStore);
}

// A function called to avail Products in a store.
export function availStoreProduct(productId: string, amount: u32): void {
    // Assert the `context.sender`, product amount, productId, avail the products to the store and update allStores.
    assertValidity(allStores.get(context.sender) !== null, `A store with ${context.sender} does not exist`);
    const updateStore = allStores.getSome(context.sender);
    assertValidity(amount > 0, "Invalid payload");

    const productIdx = findEntryProduct(updateStore.storeProducts, productId);
    assertValidity(!(productIdx < 0), `A product with ${productId} does not exist on this store`);

    updateStore.storeProducts[productIdx].incrementAvailable(amount);
    allStores.set(updateStore.id, updateStore);
}

// A function called to rate a store.
export function rateStore(storeId: string, rating: u32): void {
    // Assert the `storeId`, context.sender, rating, rate the store and update allStores.
    assertValidity(allStores.get(storeId) !== null, `A store with ${storeId} does not exist`);
    const updateStore = allStores.getSome(storeId);
    assertValidity(updateStore.owner != context.sender, `Store owner is unauthorized to rate their own store`);
    assertValidity(rating >= 0 && rating <= 5, `The provided rating is out of range`);

    updateStore.rateStore(rating);
    allStores.set(updateStore.id, updateStore);
}

// A function called to delete Store Products.
export function deleteStoreProduct(productId: string): void {
    // Assert the context.sender, productId, delete the store product and update allStores.
    assertValidity(allStores.get(context.sender) !== null, `A store with ${context.sender} does not exist`);
    const updateStore = allStores.getSome(context.sender);

    const productIdx = findEntryProduct(updateStore.storeProducts, productId);
    assertValidity(!(productIdx < 0), `A product with ${productId} does not exist on this store`);

    updateStore.deleteProduct(productIdx);
    allStores.set(updateStore.id, updateStore);
}

// Get all stores
export function getStores(): Store[] {
    return allStores.values();
}

// Get a single store
export function getStore(storeId: string): Store | null {
    return allStores.get(storeId);
}

// Get a store's products
export function getStoreProducts(storeId: string): Product[] | null {
    if (!allStores.contains(storeId)) return null;
    return allStores.getSome(storeId).storeProducts;
}

// Get Purchased References related to an accountId
export function getPurchasedReference(accountId: string): PurchasedReference[] | null {
    return allPurchasedReference.get(accountId);
}

// Get suggested products
export function getSuggestedProducts(): SuggestedProduct[] | null {
    return allSuggestedProducts.get('all');
}

// A function called to Purchase a Product.
export function buyProduct(storeId: string, productId: string): void {
    // Assert the storeId, productId, product availability, and price against amount to deposit.
    // Transfer the deposit to the product owner, update the product, and create a PurchasedReference for the buyer.
    // Update allPurchasedReference.
    assertValidity(allStores.get(storeId) !== null, `A store with ${storeId} does not exist`);
    const updateStore = allStores.getSome(storeId);
    const productIdx = findEntryProduct(updateStore.storeProducts, productId);
    assertValidity(!(productIdx < 0), `A product with ${productId} does not exist on this store`);
    assertValidity(updateStore.storeProducts[productIdx].available > 0, `Products unavailable`);
    assertValidity(updateStore.storeProducts[productIdx].price.toString() === context.attachedDeposit.toString(), `Attached deposit should equal the product's price`);

    ContractPromiseBatch.create(updateStore.storeProducts[productIdx].owner).transfer(context.attachedDeposit);
    updateStore.storeProducts[productIdx].incrementSold();
    allStores.set(storeId, updateStore);

    const purchase = PurchasedReference.PurchasedProductFromPayload(updateStore.storeProducts[productIdx]);
    purchase.location = updateStore.location;

    const purchases = allPurchasedReference.get(context.sender);
    if (purchases === null) {
        allPurchasedReference.set(context.sender, new Array());
    }

    const updatedPurchases = allPurchasedReference.getSome(context.sender);
    updatedPurchases.push(purchase);
    allPurchasedReference.set(context.sender, updatedPurchases);
}

// A function called to delete a Purchase Reference.
export function deletePurchasedReference(idx: i32): void {
    // Assert the context.sender, Reference index, delete the Purchase Reference, and update allPurchasedReference.
    assertValidity(allPurchasedReference.get(context.sender) !== null, `A referenced purchase for ${context.sender} does not exist`);
    const purchases = allPurchasedReference.getSome(context.sender);
    assertValidity(idx >= 0 && idx < purchases.length, `Referenced index out of range`);

    PurchasedReference.deleteReference(purchases, idx);
    allPurchasedReference.set(context.sender, purchases);
}

// A helper function to assert conditions
function assertValidity(condition: boolean, message: string, functionName?: string, lineNumber?: number): void {
    if (!condition) {
        const errorMessage = `${functionName ? `Function: ${functionName}, ` : ''}Line: ${lineNumber ? lineNumber : 'Unknown'}, ${message}`;
        throw new Error(errorMessage);
    }
}

// A helper function to return a Product index from an array
function findEntryProduct(elements: Product[], idx: string): i32 {
    // Optimize this function to use a more efficient data structure, such as a Map or an Object, for faster lookup.
    const productMap: Map<string, i32> = new Map();

    for (let i = 0; i < elements.length; i++) {
        productMap.set(elements[i].id, i);
    }

    return productMap.get(idx) || -1;
}

// A helper function to check if the `context.sender` is authorized to add suggested products
function isAuthorized(): boolean {
    // Add logic to check if the `context.sender` is an authorized account or contract
    // For example, you could maintain a list of authorized accounts or contracts
    const authorizedAccounts = ['authorized_account_1', 'authorized_account_2'];
    return authorizedAccounts.includes(context.sender);
}

// A helper function to check if an account ID is valid
function isValidAccountId(accountId: string): boolean {
    // Add logic to validate the account ID format
    // For example, you could use a regular expression or a specific validation function
    const accountIdRegex = /^[a-z0-9._-]{5,64}$/;
    return accountIdRegex.test(accountId);
}
