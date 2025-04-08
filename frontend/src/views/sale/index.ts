type BaseEntity = {
    id: number;
    createdDate: string;
    updatedDate: string;
    code: string;
    name: string;
    deleted: boolean;
    description: string;
};

type Event = {
    id: number;
    discountCode: string;
    name: string;
    discountPercent: number;
    startDate: string; // Có thể đổi thành Date nếu cần parse và xử lý ngày
    endDate: string;   // Tương tự, đổi thành Date nếu cần
    quantityDiscount: number;
    status: string;
};

export type Image = BaseEntity & {
    url: string;
};

export type Size = BaseEntity;
export type Color = BaseEntity;
export type Product = BaseEntity & {
    nowAverageDiscountPercentEvent: number,
    eventDTOList: Event[];
};
export type ProductDetailResponseDTO = {
    id: number;
    name: string;
    code: string;
    price: number;
    quantity: number;
    size: Size;
    color: Color;
    brand: BaseEntity;
    product: Product;
    material: BaseEntity;
    images: Image[];
};

export type CartDetailResponseDTO = {
    id: number;
    quantity: number;
    productDetailResponseDTO: ProductDetailResponseDTO
}
export interface CartResponseDTO {
    id: number;
    code: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    recipientName: string | null;
    provinceId: number | null;
    provinceName: string | null;
    districtId: number | null;
    districtName: string | null;
    wardId: number | null;
    wardName: string | null;
    deleted: boolean;
    status: string; // Hoặc định nghĩa Enum cho các trạng thái
    type: string; // Hoặc định nghĩa Enum cho các loại
    payment: string; // Hoặc định nghĩa Enum cho các phương thức thanh toán
    total: number;
    deliveryFee: number;
    discount: number;
    subTotal: number;
    customerResponseDTO: CustomerResponseDTO | null;
    voucherResponseDTO: VoucherResponseDTO | null;
    cartDetailResponseDTOS: CartDetailResponseDTO[];
}

export interface CustomerResponseDTO {
    id: number;
    name: string;
    email: string;
    phone: string;
}

export interface VoucherResponseDTO {
    id: number;
    code: string;
    discountValue: number;
}

