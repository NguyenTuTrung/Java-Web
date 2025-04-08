
export interface IProvince {
    ProvinceID: string,
    ProvinceName: string,
    value: string,
    label: string,
}

export interface IDistrict {
    DistrictID: string,
    DistrictName: string,
}

export interface IWard {
    WardCode: string,
    WardName: string,
}

export interface IAddress {
    iprovince?: IProvince,
    idistrict?: IDistrict,
    iward?: IWard,
    address?: string
}
export type AddressResponse = {
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
    createdDate: string; // Use `string` if the date is in ISO format, or `Date` if parsed
};
