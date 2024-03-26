// dependencies imports
import { PersistentUnorderedMap, u128, context } from "near-sdk-as";


// const suggestedProductTimeout = 345600000000000; //5days
// const suggestedProductTimeout = 240000000000 // 4mins
// const suggestedProductTimeout = 1200000000000  // 20mins
const suggestedProductTimeout = 960000000000 //16mins

// The SuggestedProduct Class
@nearBindgen
export class SuggestedProduct {
    id: string;
    name: string;
    description: string;
    image: string;
    lifeSpan: u64;

    // A class method that create's an instance of a SuggestedProduct
    public static suggestedProductFromPayload(payload: SuggestedProduct): SuggestedProduct {
        const suggestedproduct = new SuggestedProduct();
        suggestedproduct.id = payload.id;
        suggestedproduct.name = payload.name;
        suggestedproduct.description = payload.description;
        suggestedproduct.image = payload.image;
        suggestedproduct.lifeSpan = context.blockTimestamp + suggestedProductTimeout;
        return suggestedproduct;
    }

    // A class method that removes a SuggestedProduct from an array
    public static deleteProduct(elements: SuggestedProduct[], idx: i32): void {
        for(let i = idx; i < elements.length; i++){
            if(i+1 == elements.length) break;
            elements[i] = elements[i+1]
        }
        elements.pop()
    };
}

// The PurchasedRefrence Class
@nearBindgen
export class PurchasedReference {
    id: string;
    name: string;
    description: string;
    image: string;
    location: string;
    price: u128;

    // A class method that create's an instance of a PurchasedRefrence
    public static PurchasedProductFromPayload(_product: Product): PurchasedReference {
        const product = new PurchasedReference();
        product.id = _product.id;
        product.name = _product.name;
        product.description = _product.description;
        product.image = _product.image;
        product.price = _product.price;
        return product;
    }

    // A class method that removes a PurchasedRefrence from an array
    public static deleteReference(elements: PurchasedReference[], idx: i32): void {
        for(let i = idx; i < elements.length; i++){
            if(i+1 == elements.length) break;
            elements[i] = elements[i+1]
        }
        elements.pop()
    };
}

// The Product Class
@nearBindgen
export class Product {
    id: string;
    name: string;
    description: string;
    image: string;
    price: u128;
    owner: string;
    sold: u32;
    available: u32;

    // A class method that increments the  Product sold count
    public incrementSold(): void {
        this.sold += 1;
        this.available -= 1
    }

    // A class method that increments the  Product Available count
    public incrementAvailable(amount: u32): void {
        this.available += amount;
    }
}

// The Store Class
@nearBindgen
export class Store {
    id: string;
    name: string;
    description: string;
    banner: string;
    location: string;
    owner: string;
    rating: u32;
    reviewers: string[];
    rates: i32[];
    storeProducts: Product[];

    // A class method that create's an instance of a Store
    public static storeFromPayload(payload: Store): Store {
        const store = new Store();
        store.id = payload.id;
        store.name = payload.name;
        store.description = payload.description;
        store.banner = payload.banner;
        store.location = payload.location;
        store.owner = context.sender;
        store.reviewers = new Array();
        store.rates = new Array();
        store.storeProducts = new Array();
        return store;
    }

    // A class method that updates's an instance of a Store
    public updateStoreFromPayload(payload: Store): void {
        const store = this;
        store.name = payload.name;
        store.description = payload.description;
        store.banner = payload.banner;
        store.location = payload.location;
    }
    
    // A class method that add's a StoreProduct
    public addStoreProduct(payload: Product): void {
        const product = new Product();
        product.id = payload.id;
        product.name = payload.name;
        product.description = payload.description;
        product.image = payload.image;
        product.price = payload.price;
        product.owner = context.sender;
        this.storeProducts.push(product)
    }

    // A class method that update's a StoreProduct
    public updateStoreProduct(product: Product, payload: Product): void {
        product.name = payload.name;
        product.description = payload.description;
        product.image = payload.image;
        product.price = payload.price;
    }

    // A class method for rateing a Store
    public rateStore(rating: i32): void {
        if (findEntrySrting(this.reviewers, context.sender) < 0){
            this.reviewers.push(context.sender);
            this.rates.push(rating);
        }
        this.rates[findEntrySrting(this.reviewers, context.sender)] = rating;
        var _rate = 0;
        for(let i = 0; i < this.rates.length; i++){
            _rate += this.rates[i];
        }
        this.rating = _rate/this.reviewers.length;
    }

    // A class method that delet's a storeProduct from a store
    public deleteProduct(idx: i32): void {
        for(let i = idx; i < this.storeProducts.length; i++){
            if(i+1 == this.storeProducts.length) break;
            this.storeProducts[i] = this.storeProducts[i+1]
        }
        this.storeProducts.pop()
    };

}

// helper functions for finding strings in arrays
function findEntrySrting(elements: string[], idx: string): i32 {
    for(let i = 0; i < elements.length; i++){
        if(elements[i] == idx) return i;
        if(i+1 == elements.length) break;         
    }
    return -1;
};

// the allSuggestedProducts, allPurchasedRefrence and allStores storage instantiations
export const allSuggestedProducts = new PersistentUnorderedMap<string, SuggestedProduct[]>("sp");
export const allPurchasedReference = new PersistentUnorderedMap<string, PurchasedReference[]>("pr");
export const allStores = new PersistentUnorderedMap<string, Store>("as");