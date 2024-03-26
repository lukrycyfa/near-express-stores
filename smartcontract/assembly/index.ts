// classes and method imports
import { Store, Product, allSuggestedProducts, SuggestedProduct, allStores, allPurchasedReference, PurchasedReference } from './model';

import { ContractPromiseBatch, context } from 'near-sdk-as';

// A function called to create a SuggestedProduct. with the max number of `SuggestedProduct == 6`
export function addSuggestedProduct(product: SuggestedProduct): void {
    // assert the product payload, create a instance for `allSuggestedProducts` if  non exits,
    // assert the max number of SuggestedProduct and the oldest `SuggestedProduct lifeSpan`
    // before adding a new suggested product and updating allSuggestedProducts.
    assertValidity(product.name.length > 0 && product.description.length > 0 && product.image.length > 0, "invalid payload")
    if(allSuggestedProducts.get("all") === null){
        allSuggestedProducts.set("all", new Array());
    }
    let _all = allSuggestedProducts.getSome("all");
    if (_all.length == 6){
        let _date = new Date(_all[0].lifeSpan/1000000)
        assertValidity(!(_all[0].lifeSpan > context.blockTimestamp),
        `we are out of spots for suggested products, a spot will be available by ${_date.toDateString()} ${_date.toTimeString()} GMT`)
    }
    if (_all.length == 6 && _all[0].lifeSpan < context.blockTimestamp){
        SuggestedProduct.deleteProduct(_all, 0);
    }
    _all.push(SuggestedProduct.suggestedProductFromPayload(product));
    allSuggestedProducts.set("all", _all);
}

// A function called to create a Store.
export function addStore(store: Store): void {
    // assert the `context.sender`, store payload, create a store and update allStores
    assertValidity(allStores.get(context.sender) === null, "A store with this User already exists")
    assertValidity(store.name.length > 0 && store.description.length > 0 && store.banner.length > 0 &&
    store.location.length > 0, "invalid payload")
    store.id = context.sender;
    allStores.set(context.sender, Store.storeFromPayload(store));
}

// A function called to update a Store.
export function updateStore(store: Store): void {
    // assert the `context.sender`, store payload, update the store and update allStores
    assertValidity(allStores.get(context.sender) !== null, `a store with ${context.sender} does not exists`)
    const _updateStore = allStores.getSome(context.sender);
    assertValidity(store.name.length > 0 && store.description.length > 0 && store.banner.length > 0 &&
    store.location.length > 0, "Invalid Payload")
    _updateStore.updateStoreFromPayload(store);
    allStores.set(_updateStore.id, _updateStore);
}

// A function called to delete a Store.
export function deleteStore(): void {
    assertValidity(allStores.get(context.sender) !== null, `a store with ${context.sender} does not exists`)
    // assert the `context.sender`, delete a Store.
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
    // assert the `context.sender`, product payload, productId, update a product in store and update allStores
    assertValidity(allStores.get(context.sender) !== null, `a store with ${context.sender} does not exists`)
    const _updateStore = allStores.getSome(context.sender); 
    assertValidity(product.name.length > 0 && product.description.length > 0 && product.image.length > 0 && !product.price.isZero(), "Invalid Payload")
    const _productIdx = findEntryProduct(_updateStore.storeProducts, productId);
    assertValidity(!(_productIdx < 0), `a product with ${productId} does not exists on this store`);
    _updateStore.updateStoreProduct(_updateStore.storeProducts[_productIdx], product);
    allStores.set(_updateStore.id, _updateStore);
}

// A function called to avail Products in a store.
export function availStoreProduct(productId: string, amount: u32): void {
    // assert the `context.sender`, product amount, productId, avail the products to store and update allStores
    assertValidity(allStores.get(context.sender) !== null, `a store with ${context.sender} does not exists`)
    const _updateStore = allStores.getSome(context.sender); 
    assertValidity(amount > 0, "Invalid Payload")
    const _productIdx = findEntryProduct(_updateStore.storeProducts, productId)
    assertValidity(!(_productIdx < 0), `a product with ${productId} does not exists on this store`)
    _updateStore.storeProducts[_productIdx].incrementAvailable(amount);
    allStores.set(_updateStore.id, _updateStore);
}

// A function called to rate a store.
export function rateStore(storeId: string, rating: u32): void {
    // assert the `storeId`, context.sender, rating, rate the store and update allStores
    assertValidity(allStores.get(storeId) !== null, `a store with ${storeId} does not exists`); 
    const _updateStore = allStores.getSome(storeId);
    assertValidity(_updateStore.owner != context.sender, `store owner is unauthorized to rate own store`);
    assertValidity(rating >= 0 && rating <= 5, `the provided rating is out of range`);
    _updateStore.rateStore(rating);
    allStores.set(_updateStore.id, _updateStore);
}

// A function called to delete Store Products.
export function deleteStoreProduct(productId: string): void {
    // assert the context.sender, productId, delete the store product and update allStores
    assertValidity(allStores.get(context.sender) !== null, `a store with ${context.sender} does not exists`);
    const _updateStore = allStores.getSome(context.sender);  
    const _productIdx = findEntryProduct(_updateStore.storeProducts, productId);
    assertValidity(!(_productIdx < 0) , `a product with ${productId} does not exists on this store`);
    _updateStore.deleteProduct(_productIdx);
    allStores.set(_updateStore.id, _updateStore);
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
