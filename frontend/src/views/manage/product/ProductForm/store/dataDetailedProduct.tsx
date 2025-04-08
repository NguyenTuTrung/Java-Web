import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Option = {
    id: number;
    code: string;
    name: string;
    deleted: boolean;
    // createdDate: string;
    // modifiedDate: string;
};

export type Image = {
    id: number;
    code: string;
    url: string;
    deleted: boolean;
    createdDate: string;
    modifiedDate: string;
};

export interface DetailedProduct {
    id: number;
    code: string;
    product?: Option | null;
    size: Option;
    color: Option;
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
    [key: string]: any;
}

export type AddDetailedProductState = {
    data: DetailedProduct[];
};

export const SLICE_NAME_DETAILED_PRODUCT = 'dataDetailedProduct';

const initialStateDetailedProduct: AddDetailedProductState = {
    data: [],
};

export const detailedProductData = createSlice({
    name: SLICE_NAME_DETAILED_PRODUCT,
    initialState: initialStateDetailedProduct,
    reducers: {
        setCombinations: (state, action: PayloadAction<DetailedProduct[]>) => {
            state.data = action.payload;
        },
        removeCombination: (state, action: PayloadAction<string>) => {
            state.data = state.data.filter(product => product.code !== action.payload);
        },
        updateCombination: (state, action: PayloadAction<DetailedProduct>) => {
            const index = state.data.findIndex(product => product.code === action.payload.code);
            if (index !== -1) {
                const updatedProduct = { ...state.data[index], ...action.payload };
                state.data[index] = updatedProduct;
            }
        },
        updateProductImagesByColor: (
            state,
            action: PayloadAction<{ colorName: string; images: Image[] }>
        ) => {
            const { colorName, images } = action.payload;
            // Chỉ tìm sản phẩm theo màu sắc và cập nhật ảnh
            state.data = state.data.map(product => {
                if (product.color?.name === colorName) {
                    return { ...product, images };
                }
                return product;
            });
        }
    }
});

export const { setCombinations, removeCombination, updateCombination, updateProductImagesByColor } = detailedProductData.actions;
export default detailedProductData.reducer;
