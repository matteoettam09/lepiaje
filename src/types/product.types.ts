export interface ProductType {
    uuid: string;
    productId: string;
    name: string;
    nameIt?: string;
    description: string;
    descriptionIt?: string;
    price: number;
    unit: string;
    unitIt?: string;
    inStock: boolean;
    seasonal: boolean;
    image?: string;
}

export interface CartItem {
    productId: string;
    quantity: number;
}

export interface PurchaseRequest {
    items: CartItem[];
    clientEmail: string;
    clientNumber?: string;
}
