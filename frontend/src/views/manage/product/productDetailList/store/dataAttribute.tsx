import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    apiGetDataProductDetailQuery
} from '@/services/ProductSalesService';

export type FormAttribute = {
    id: number;
    code: string;
    name: string;
    deleted: boolean;
};

type ProductDetail = {
    id: number;
    code: string;
    name: string;
    createdDate: string;
    size: FormAttribute;
    color: FormAttribute;
    brand?: FormAttribute;
    collar?: FormAttribute;
    elasticity?: FormAttribute;
    material?: FormAttribute;
    origin?: FormAttribute;
    sleeve?: FormAttribute;
    style?: FormAttribute;
    texture?: FormAttribute;
    thickness?: FormAttribute;
}

export type AttributeState = {
    loading: boolean;
    attributeFormData: ProductDetail[];
    error: string | null; 
};

type DataProductDetailQuery = ProductDetail[];

export const DATA_NAME = 'datas';

export const getDataProductDetailQuery = createAsyncThunk(
    DATA_NAME + '/getDataProductDetailQuery',
    async (data: { productId: string }) => {
        const response = await apiGetDataProductDetailQuery<DataProductDetailQuery, { productId: string }>(data);
        return response.data;
    }
);

const initialState: AttributeState = {
    loading: false, // initially set to false (not loading)
    attributeFormData: [],
    error: null, // error initially null
};

// Create the slice
const attributeSlice = createSlice({
    name: DATA_NAME,
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDataProductDetailQuery.pending, (state) => {
                state.loading = true;  // Đang tải dữ liệu
            })
            .addCase(getDataProductDetailQuery.fulfilled, (state, action) => {
                state.loading = false;  // Dữ liệu đã tải thành công
                state.attributeFormData = action.payload; // Lưu dữ liệu vào state
                console.log(state.attributeFormData)
            })
            .addCase(getDataProductDetailQuery.rejected, (state) => {
                state.loading = false;  // Đã kết thúc yêu cầu (thành công hoặc thất bại)
                state.error = 'Có lỗi xảy ra khi tải dữ liệu';
            });
    }

});

export default attributeSlice.reducer;
