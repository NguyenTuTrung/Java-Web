

// private
export type OrderAddressResponseDTOS = {
    id: number;
    phone: string;
    name: string;
    provinceId: string;
    province: string;
    districtId: string;
    district: string;
    wardId: string;
    ward: string;
    detail: string;
    defaultAddress: boolean;
}
// public
export type EOrderTypeEnums = "" | "ONLINE" | "INSTORE"

export enum EOrderStatusEnums {
    EMPTY = "",
    PENDING = "PENDING",
    TOSHIP = "TOSHIP",
    TORECEIVE = "TORECEIVE",
    DELIVERED = "DELIVERED",
    CANCELED = "CANCELED",
    REQUESTED = "REQUESTED"
}


export type OrderTypeBill = {
    label: string,
    value: EOrderTypeEnums
}

export type StatusBill = {
    label: string,
    value: EOrderStatusEnums,
    badge: string
}

export type EOrderStatus = "PENDING" | "TOSHIP" | "TORECEIVE" | "DELIVERED" | "CANCELED" | "REQUESTED"

export type EOrderType = 'INSTORE' | 'ONLINE'; // Add more types if needed

export type EOrderPayment = 'CASH' | 'TRANSFER'; // Add more types if needed

export type OrderCustomerResponseDTO = {
    id: number;
    code: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    deleted: boolean;
    birthDay: string; // Consider using Date type if applicable
    addressResponseDTOS: OrderAddressResponseDTOS[]; // Define this type if applicable
}

export type OrderStaffResponseDTO = {
    code: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    citizenId: string;
    address: string;
    province: string;
    district: string;
    ward: string;
    status: string; // Consider defining a more specific type if needed
    note: string;
    birthDay: string; // Consider using Date type if applicable
    deleted: boolean;
}

export type OrderVoucherResponseDTO = {
    code: string;
    name: string;
    quantity: number;
    minAmount: number;
    maxPercent: number;
    typeTicket: string; // Consider defining specific types if needed
    startDate: string; // Consider using Date type if applicable
    endDate: string; // Consider using Date type if applicable
    deleted: boolean;
}

export type OrderHistoryResponseDTO = {
    id?: number;
    status?: EOrderStatus;
    note?: string;
    createdBy?: string;
    createdDate?: string;
    account?: any;
}

export type OrderResponseDTO = {
    id: number;
    name: string;
    code: string;
    address: string;
    phone: string;
    recipientName: string;
    deleted: boolean;
    status: EOrderStatus;
    type: EOrderType;
    payment: EOrderPayment;
    isPayment: boolean;
    inStore: boolean;
    total: number;
    totalPaid: number;
    subTotal: number;
    provinceId: string;    // ID của tỉnh
    provinceName: string;  // Tên của tỉnh
    districtId: string;    // ID của quận/huyện
    districtName: string;  // Tên của quận/huyện
    wardId: string;        // ID của phường/xã
    wardName: string;      // Tên của phường/xã
    discountVoucherPercent: number;      // Tên của phường/xã
    customerResponseDTO: OrderCustomerResponseDTO;
    staffResponseDTO: OrderStaffResponseDTO;
    voucherResponseDTO: OrderVoucherResponseDTO;
    orderDetailResponseDTOS: OrderDetailResponseDTO[];
    historyResponseDTOS: OrderHistoryResponseDTO[];
    createdDate: string;
    refund: number;
    surcharge: number
}

export type Entity = {
    id: number;
    createdDate: string;
    updatedDate: string;
    code: string;
    name: string;
    deleted: boolean;
};

export type ProductD = {
    id: number;
    createdDate: string;
    updatedDate: string;
    code: string;
    name: string;
    deleted: boolean;
    eventDTOList: EventResponseDTO[]
    nowAverageDiscountPercentEvent: number,
};

export type OrderProductDetail = Entity & {
    price: number;
    quantity: number;
    size: Entity;
    color: Entity;
    product: ProductD;
    texture: Entity;
    origin: Entity;
    brand: Entity;
    collar: Entity;
    sleeve: Entity;
    style: Entity;
    material: Entity;
    thickness: Entity;
    elasticity: Entity;
    images: Image[];

};

export type OrderDetailResponseDTO = {
    id: number;
    name: string;
    code: string;
    quantity: number;
    unitPrice: number;
    productDetailResponseDTO: OrderProductDetail;
    averageDiscountEventPercent: number
};

export type ProductOrderDetail = {
    id: string
    name: string
    productCode: string
    img: string
    price: number
    quantity: number
    total: number
    details: Record<string, string[]>
}

export type OrderProductsProps = {
    data?: ProductOrderDetail[]
}

export type OrderDetailRequestForCreate = {
    quantity: number;
    orderId: number;
    productDetailId: number;
};

export type ProductDetailOverviewPhah04 = {
    id: number;
    code: string;
    name: string;
    deleted: boolean;
    quantity: number;
    price: number;
    sizeName: string;
    colorName: string;
    productName: string;
    textureName: string;
    originName: string;
    brandName: string;
    collarName: string;
    sleeveName: string;
    materialName: string;
    thicknessName: string;
    elasticityName: string;
    nowAverageDiscountPercentEvent: number,
    images: Image[],
    eventResponseDTOS: EventResponseDTO[]

};

type Image = {
    id: number;
    createdDate: string;
    updatedDate: string;
    code: string;
    url: string;
    deleted: boolean;
};

type EventResponseDTO = {
    discountPercent: number; // Tỷ lệ giảm giá
    startDate: string; // Ngày bắt đầu (ISO format)
    endDate: string; // Ngày kết thúc (ISO format)
    name: string; // Tên chương trình giảm giá
    description: string | null; // Mô tả (có thể null)
    status: boolean; // Trạng thái (true: hoạt động, false: không hoạt động)
};
