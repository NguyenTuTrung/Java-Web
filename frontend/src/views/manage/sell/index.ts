export type OrderDetailOverview = {
    image: string,
    name: string,
    quantity: number,
    price: number
}
type DefaultAddress = {
    id: number;
    name: string;
    phone: string;
    provinceId: number;
    province: string;
    districtId: number;
    district: string;
    wardId: string;
    ward: string;
    detail: string;
    isDefault: boolean;
    createdDate: string; // ISO 8601 date format
};

export type SellCustomerOverview = {
    id: number
    name: string,
    phone: string,
    email: string,
    gender: string
    defaultAddress: DefaultAddress
}
export enum EPaymentMethod {
    TRANSFER = 'TRANSFER',
    CASH = 'CASH'
}
