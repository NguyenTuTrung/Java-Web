interface Event {
    id: number;
    name: string;
}


export type ProductSaleCardDTO = {
    productId: number;
    productCode: string;
    productName: string;
    countColor: number;
    countSize: number;
    price: number;
    discountPrice: number;
    discountPercent: number;
    discountAmount: number;
    image: string[];
    mass: number;
    listEvent: Event[]
};