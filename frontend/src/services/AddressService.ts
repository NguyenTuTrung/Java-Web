import { IDistrict, IProvince, IWard } from "@/@types/address";
import instanceGHN from "@/axios/GHNAxios";

export const fetchFindAllProvinces = async (): Promise<IProvince[]> => {
    try {
        const response = await instanceGHN.get("shiip/public-api/master-data/province");
        if (response.status === 200 && response?.data?.data) {
            const modifiedProvinces = response.data.data.map((province: IProvince) => ({
                ProvinceID: province.ProvinceID,
                ProvinceName: province.ProvinceName,
                value: province.ProvinceID,  // Thêm thuộc tính `value`
                label: province.ProvinceName // Thêm thuộc tính `label`
            }));
            return modifiedProvinces;  // Trả về dữ liệu
        }
        return [];
    } catch (error) {
        console.error("Error fetching provinces:", error);
        return [];
    }
}

export const fetchFindAllDistricts = async (idProvince: string): Promise<IDistrict[]> => {
    try {
        const response = await instanceGHN.get(`shiip/public-api/master-data/district?province_id=${idProvince}`);
        if (response.status === 200 && response?.data?.data) {
            const modifiedDistricts = response.data.data.map((district: IDistrict) => ({
                DistrictID: district.DistrictID,
                DistrictName: district.DistrictName,
                value: district.DistrictID,  // Thêm thuộc tính `value`
                label: district.DistrictName // Thêm thuộc tính `label`
            }));
            return modifiedDistricts;  // Trả về dữ liệu
        }
        return [];
    } catch (error) {
        console.error("Error fetching districts:", error);
        return [];
    }
}

export const fetchFindAllWards = async (idDistrict: string): Promise<IWard[]> => {
    try {
        const response = await instanceGHN.get(`shiip/public-api/master-data/ward?district_id=${idDistrict}`);
        if (response.status === 200 && response?.data?.data) {
            const modifiedWards = response.data.data.map((ward: IWard) => ({
                WardCode: ward.WardCode,
                WardName: ward.WardName,
                value: ward.WardCode,  // Thêm thuộc tính `value`
                label: ward.WardName // Thêm thuộc tính `label`
            }));
            return modifiedWards;  // Trả về dữ liệu
        }
        return [];
    } catch (error) {
        console.error("Error fetching wards:", error);
        return [];
    }
}
