// utils.ts
export function findEntryString(elements: string[], idx: string): i32 {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i] === idx) return i;
    if (i + 1 === elements.length) break;
  }
  return -1;
}

// product.ts
import { u128, context } from 'near-sdk-as';

export abstract class ProductBase {
  id: string;
  name: string;
  description: string;
  image: string;

  constructor(id: string, name: string, description: string, image: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
  }
}

@nearBindgen
export class Product extends ProductBase {
  price: u128;
  owner: string;
  sold: u32 = 0;
  available: u32;

  constructor(id: string, name: string, description: string, image: string, price: u128, available: u32) {
    super(id, name, description, image);
    this.price = price;
    this.owner = context.sender;
    this.available = available;
  }

  incrementSold(): void {
    this.sold += 1;
    this.available -= 1;
  }

  incrementAvailable(amount: u32): void {
    this.available += amount;
  }
}

@nearBindgen
export class SuggestedProduct extends ProductBase {
  lifeSpan: u64;

  constructor(id: string, name: string, description: string, image: string) {
    super(id, name, description, image);
    this.lifeSpan = context.blockTimestamp + 960000000000; // 16 minutes
  }

  static suggestedProductFromPayload(payload: SuggestedProduct): SuggestedProduct {
    return new SuggestedProduct(payload.id, payload.name, payload.description, payload.image);
  }

  static deleteProduct(elements: SuggestedProduct[], idx: i32): void {
    for (let i = idx; i < elements.length; i++) {
      if (i + 1 === elements.length) break;
      elements[i] = elements[i + 1];
    }
    elements.pop();
  }
}

@nearBindgen
export class PurchasedReference extends ProductBase {
  location: string;
  price: u128;

  constructor(id: string, name: string, description: string, image: string, location: string, price: u128) {
    super(id, name, description, image);
    this.location = location;
    this.price = price;
  }

  static purchasedProductFromPayload(product: Product): PurchasedReference {
    return new PurchasedReference(product.id, product.name, product.description, product.image, '', product.price);
  }

  static deleteReference(elements: PurchasedReference[], idx: i32): void {
    for (let i = idx; i < elements.length; i++) {
      if (i + 1 === elements.length) break;
      elements[i] = elements[i + 1];
    }
    elements.pop();
  }
}

// store.ts
import { PersistentUnorderedMap, context } from 'near-sdk-as';
import { Product, SuggestedProduct, PurchasedReference, findEntryString } from './product';

@nearBindgen
export class Store {
  id: string;
  name: string;
  description: string;
  banner: string;
  location: string;
  owner: string;
  rating: u32 = 0;
  reviewers: string[] = [];
  rates: i32[] = [];
  storeProducts: Product[] = [];

  constructor(id: string, name: string, description: string, banner: string, location: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.banner = banner;
    this.location = location;
    this.owner = context.sender;
  }

  static storeFromPayload(payload: Store): Store {
    return new Store(payload.id, payload.name, payload.description, payload.banner, payload.location);
  }

  updateStoreFromPayload(payload: Store): void {
    this.name = payload.name;
    this.description = payload.description;
    this.banner = payload.banner;
    this.location = payload.location;
  }

  addStoreProduct(payload: Product): void {
    const product = new Product(payload.id, payload.name, payload.description, payload.image, payload.price, payload.available);
    this.storeProducts.push(product);
  }

  updateStoreProduct(product: Product, payload: Product): void {
    product.name = payload.name;
    product.description = payload.description;
    product.image = payload.image;
    product.price = payload.price;
  }

  rateStore(rating: i32): void {
    const senderIndex = findEntryString(this.reviewers, context.sender);
    if (senderIndex < 0) {
      this.reviewers.push(context.sender);
      this.rates.push(rating);
    } else {
      this.rates[senderIndex] = rating;
    }

    let totalRating = 0;
    for (const rate of this.rates) {
      totalRating += rate;
    }
    this.rating = totalRating / this.reviewers.length;
  }

  deleteProduct(idx: i32): void {
    for (let i = idx; i < this.storeProducts.length; i++) {
      if (i + 1 === this.storeProducts.length) break;
      this.storeProducts[i] = this.storeProducts[i + 1];
    }
    this.storeProducts.pop();
  }
}

export const allSuggestedProducts = new PersistentUnorderedMap<string, SuggestedProduct[]>('sp');
export const allPurchasedReference = new PersistentUnorderedMap<string, PurchasedReference[]>('pr');
export const allStores = new PersistentUnorderedMap<string, Store>('as');