import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetSalesProductDetail,
    apiPutSalesProductDetail
} from '@/services/ProductSalesService'

export type Option = {
    code: string;
    createdDate: string;
    modifiedDate: string;
    deleted: boolean;
    id: number;
    name: string;
};

 type Product = {
    id: number;
    code: string;
    name: string;
    description: string;
    deleted: boolean;
    createdDate: string;
    modifiedDate: string;
}; 


export type Image = {
    id: number;
    code: string; 
    url: string;
    deleted: boolean;
    createdDate: string;
    modifiedDate: string;
};


type ProductDetail = {
    id: number;
    code: string;
    product?: Product | null;
    size: Option | undefined;
    color: Option | undefined;
    brand?: Option | null;
    collar?: Option | null;
    elasticity?: Option | null;
    material?: Option | null;
    origin?: Option | null;
    sleeve?: Option | null;
    style?: Option | null;
    texture?: Option | null;
    thickness?: Option | null;
    images?: Image[] | [];
    price: number;
    mass: number;
    quantity: number;
    deleted?: boolean;
    createdDate: string;
    modifiedDate: string;
}

export type SalesProductDetailState = {
    loading: boolean
    UpdateConfirmation: boolean
    productDetail: ProductDetail|null
}

type GetSalesProductResponse = ProductDetail

export const UPDATE_PRODUCT_DETAIL = 'productDetailUpdate';

export const getProductDetailId = createAsyncThunk(
    UPDATE_PRODUCT_DETAIL + '/getProductDetail',
    async (data: { id: number }) => {
        const response = await apiGetSalesProductDetail<
            GetSalesProductResponse,
            { id: number }
        >(data)
        return response.data
    }
)

export const updateProductDetailId = async <T, U extends Record<string, unknown>>(
    data: U,
    param:number
) => {
    const response = await apiPutSalesProductDetail<T, U>(data, param)
    return response.data
}







 


const initialState: SalesProductDetailState = {
    loading: false,
    UpdateConfirmation: false,
    productDetail: null,
};

const productDetailSlice = createSlice({
    name: UPDATE_PRODUCT_DETAIL,
    initialState,
    reducers: {
      
        toggleUpdateConfirmation(state, action) {
            state.UpdateConfirmation = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProductDetailId.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProductDetailId.fulfilled, (state, action) => {
                state.loading = false;
                state.productDetail = action.payload;
                console.log(state.productDetail) 
            })
            .addCase(getProductDetailId.rejected, (state) => {
                state.loading = false;
                state.productDetail = null; 
            });
    },
});

export const { toggleUpdateConfirmation } = productDetailSlice.actions;

export default productDetailSlice.reducer;