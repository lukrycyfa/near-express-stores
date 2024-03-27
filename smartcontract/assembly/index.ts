// classes and method imports
import { Store, Product, allSuggestedProducts, SuggestedProduct, allStores, allPurchasedReference, PurchasedReference } from './model';

import { ContractPromiseBatch, context } from 'near-sdk-as';

// A function called to create a SuggestedProduct. with the max number of `SuggestedProduct == 6`
export function addSuggestedProduct(product: SuggestedProduct): void {
    assertValidity(product.name.length > 0 && product.description.length > 0 && product.image.length > 0, "Invalid payload");
    
    // Check if suggested product already exists
    const suggestedProducts = allSuggestedProducts.get('all');
    if (suggestedProducts) {
        for (let i = 0; i < suggestedProducts.length; i++) {
            if (suggestedProducts[i].name === product.name) {
                throw new Error("Suggested product already exists");
            }
        }
    }
    
    // Check maximum number of suggested products
    if (suggestedProducts && suggestedProducts.length >= 6) {
        throw new Error("Maximum number of suggested products reached");
    }

    // Add the suggested product
    const suggestedProduct = SuggestedProduct.suggestedProductFromPayload(product);
    allSuggestedProducts.push(suggestedProduct);
}


// A function called to create a Store.
export function addStore(store: Store): void {
    assertValidity(store.name.length > 0 && store.description.length > 0 && store.banner.length > 0 &&
        store.location.length > 0, "Invalid payload");
    
    // Check if store already exists
    if (allStores.contains(context.sender)) {
        throw new Error("A store with this User already exists");
    }

    // Create and add the store
    store.id = context.sender;
    allStores.set(context.sender, Store.storeFromPayload(store));
}


// A function called to update a Store.
export function updateStore(store: Store): void {
    assertValidity(store.name.length > 0 && store.description.length > 0 && store.banner.length > 0 &&
        store.location.length > 0, "Invalid payload");

    // Check if store exists
    const existingStore = allStores.get(context.sender);
    if (!existingStore) {
        throw new Error(`A store with ${context.sender} does not exist`);
    }

    // Check access control
    if (existingStore.owner !== context.sender) {
        throw new Error("Unauthorized to update this store");
    }

    // Update the store
    existingStore.updateStoreFromPayload(store);
    allStores.set(existingStore.id, existingStore);
}


// A function called to delete a Store.
export function deleteStore(): void {
    // Check if store exists
    const existingStore = allStores.get(context.sender);
    if (!existingStore) {
        throw new Error(`A store with ${context.sender} does not exist`);
    }

    // Check access control
    if (existingStore.owner !== context.sender) {
        throw new Error("Unauthorized to delete this store");
    }

    // Delete the store
    allStores.delete(context.sender);
}


// A function called to add a Store Product.
export function addStoreProduct(product: Product): void {
    // assert the `context.sender`, product payload, add a product to a store and update allStores
    assertValidity(allStores.get(context.sender) !== null, `a store with ${context.sender} does not exists`)
    const _updateStore = allStores.getSome(context.sender);
    assertValidity(product.name.length > 0 && product.description.length > 0 && product.image.length > 0 && !product.price.isZero(), "Invalid Payload")
    _updateStore.addStoreProduct(product);
    allStores.set(_updateStore.id, _updateStore);
}

// A function called to update a Store Product.
export function updateStoreProduct(productId: string, product: Product): void {
    assertValidity(product.name.length > 0 && product.description.length > 0 && product.image.length > 0 && !product.price.isZero(), "Invalid payload");
    
    // Check if store exists
    const existingStore = allStores.get(context.sender);
    if (!existingStore) {
        throw new Error(`A store with ${context.sender} does not exist`);
    }

    // Check if product exists in store
    const productIndex = findEntryProduct(existingStore.storeProducts, productId);
    if (productIndex < 0) {
        throw new Error(`Product with ID ${productId} does not exist in this store`);
    }

    // Check access control
    if (existingStore.storeProducts[productIndex].owner !== context.sender) {
        throw new Error("Unauthorized to update this product");
    }

    // Update the product
    existingStore.updateStoreProduct(existingStore.storeProducts[productIndex], product);
    allStores.set(existingStore.id, existingStore);
}


// A function called to avail Products in a store.
export function availStoreProduct(productId: string, amount: u32): void {
    // Check if store exists
    const existingStore = allStores.get(context.sender);
    if (!existingStore) {
        throw new Error(`A store with ${context.sender} does not exist`);
    }

    // Check if product exists in store
    const productIndex = findEntryProduct(existingStore.storeProducts, productId);
    if (productIndex < 0) {
        throw new Error(`Product with ID ${productId} does not exist in this store`);
    }

    // Check access control
    if (existingStore.storeProducts[productIndex].owner !== context.sender) {
        throw new Error("Unauthorized to update availability of this product");
    }

    // Update product availability
    existingStore.storeProducts[productIndex].incrementAvailable(amount);
    allStores.set(existingStore.id, existingStore);
}


// A function called to rate a store.
export function rateStore(storeId: string, rating: u32): void {
    // Check if store exists
    const existingStore = allStores.get(storeId);
    if (!existingStore) {
        throw new Error(`A store with ID ${storeId} does not exist`);
    }

    // Check access control
    if (existingStore.owner === context.sender) {
        throw new Error("Store owner is unauthorized to rate own store");
    }

    // Check rating range
    if (rating < 0 || rating > 5) {
        throw new Error("Rating should be between 0 and 5");
    }

    // Update store rating
    existingStore.rateStore(rating);
    allStores.set(existingStore.id, existingStore);
}


// A function called to delete Store Products.

export function deleteStoreProduct(productId: string): void {
    // Check if store exists
    const existingStore = allStores.get(context.sender);
    if (!existingStore) {
        throw new Error(`A store with ${context.sender} does not exist`);
    }

    // Check if product exists in store
    const productIndex = findEntryProduct(existingStore.storeProducts, productId);
    if (productIndex < 0) {
        throw new Error(`Product with ID ${productId} does not exist in this store`);
    }

    // Check access control
    if (existingStore.storeProducts[productIndex].owner !== context.sender) {
        throw new Error("Unauthorized to delete this product");
    }

    // Delete the product
    existingStore.deleteProduct(productIndex);
    allStores.set(existingStore.id, existingStore);
}

// get all stores
export function getStores(): Store[] {
    return allStores.values();
}

// get a single store
export function getStore(storeId: string): Store | null {
    return allStores.get(storeId);
}

// get a store products
export function getStoreProducts(storeId: string): Product[] | null {
    if (!allStores.contains(storeId)) return null;
    return allStores.getSome(storeId).storeProducts;
}

// get Purchsed Refrences related to an accountId
export function getPurchasedReference(accountId: string): PurchasedReference[] | null {
    return allPurchasedReference.get(accountId);
}

// get suggested products
export function getSuggestedProducts(): SuggestedProduct[] | null {
    return allSuggestedProducts.get('all')
}

// A function called to Purchase a Product.
export function buyProduct(storeId: string, productId: string): void {
    // assert the storeId, productId, product availability, and price against amount to deposit
    // transfer deposite to product owner, update product and create a PurchasedRefrence for buyer
    // and update allPurchasedRefrence
    assertValidity(allStores.get(storeId) !== null , `a store with ${storeId} does not exists`);
    const _updateStore = allStores.getSome(storeId); 
    const _productIdx = findEntryProduct(_updateStore.storeProducts, productId)
    assertValidity(!(_productIdx < 0), `a product with ${productId} does not exists on this store`); 
    assertValidity(_updateStore.storeProducts[_productIdx].available > 0, `products unavailable`);
    assertValidity(_updateStore.storeProducts[_productIdx].price.toString() == context.attachedDeposit.toString(), `${_productIdx} attached deposit should equal to the product's price`);
    ContractPromiseBatch.create(_updateStore.storeProducts[_productIdx].owner).transfer(context.attachedDeposit);
    _updateStore.storeProducts[_productIdx].incrementSold();
    allStores.set(storeId, _updateStore);
    const purchase = PurchasedReference.PurchasedProductFromPayload(_updateStore.storeProducts[_productIdx]);
    purchase.location = _updateStore.location;
    const _purchases = allPurchasedReference.get(context.sender);
    if(_purchases === null){ 
        allPurchasedReference.set(context.sender, new Array());
    };
    var update = allPurchasedReference.getSome(context.sender)
    update.push(purchase)
    allPurchasedReference.set(context.sender, update);
}

// A function called to delete a Purchase Refrence.
export function deletePurchasedReference(idx: i32): void {
    // assert the context.sender, Refrence index, delete the Purchase Refrence, and update allPurchasedRefrence
    assertValidity(allPurchasedReference.get(context.sender) !== null , `a refrenced purchase for ${context.sender} does not exists`)
    const _purchases = allPurchasedReference.getSome(context.sender); 
    assertValidity( !(idx >= _purchases.length) , `${_purchases.length} refrenced index out of range`)
    PurchasedReference.deleteReference(_purchases, idx)
    allPurchasedReference.set(context.sender, _purchases);
}

// a helper function to assert conditions
function assertValidity(condition: bool, message: string): void {
    if(!condition) throw new Error(`${message}`);
}

// a helper function to return a Product index from an array 
function findEntryProduct(elements: Product[], idx: string): i32 {
    for(let i = 0; i < elements.length; i++){
        if(elements[i].id == idx) return i;
        if(i+1 == elements.length) break;
    }
    return -1;
};
