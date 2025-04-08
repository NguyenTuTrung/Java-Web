import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    apiGetSalesBrands,
    apiGetSalesOrigins,
    apiGetSalesStyles,
    apiGetSalesCollars,
    apiGetSalesSleeves,
    apiGetSalesThickness,
    apiGetSalesTextures,
    apiGetSalesElasticitys,
    apiGetSalesColors,
    apiGetSalesSizes,
    apiGetSalesMaterials,
    apiGetSalesProductList
} from '@/services/ProductSalesService';

export type Option = {
    id: number;
    code: string;
    name: string;
    deleted: boolean; 
    // createdDate: string;
    // modifiedDate: string;
};



export type ProductFromData = {
    id: number;
    code: string;
    name: string;
    description: string;
    deleted: boolean;
    createdDate: string;
    modifiedDate: string;
}; 

export type OptionFormData = {
    data: Option[]; 
};

export type ProductFromDatas = {
    data: ProductFromData[]; 
};




type OptionDataResponse = OptionFormData;

export type OptionState = {
    loading: boolean;
    brandData: Option[];
    originData: Option[];
    styleData: Option[];
    collarData: Option[];
    sleeveData: Option[];
    thicknessData: Option[];
    textureData: Option[];
    elasticityData: Option[];
    colorData: Option[];
    sizeData: Option[];
    materialData: Option[];
    productData: ProductFromData[];
};



export const SLICE_NAME = 'optionList';

export const getBrandData = createAsyncThunk(
    SLICE_NAME + '/getBrandData',
    async () => {
        const response = await apiGetSalesBrands<OptionDataResponse>();
        return response.data;
    }
);

export const getOriginData = createAsyncThunk(
    SLICE_NAME + '/getOriginData',
    async () => {
        const response = await apiGetSalesOrigins<OptionDataResponse>();
        return response.data;
    }
);

export const getStyleData = createAsyncThunk(
    SLICE_NAME + '/getStyleData',
    async () => {
        const response = await apiGetSalesStyles<OptionDataResponse>();
        return response.data;
    }
);

export const getCollarData = createAsyncThunk(
    SLICE_NAME + '/getCollarData',
    async () => {
        const response = await apiGetSalesCollars<OptionDataResponse>();
        return response.data;
    }
);

export const getSleeveData = createAsyncThunk(
    SLICE_NAME + '/getSleeveData',
    async () => {
        const response = await apiGetSalesSleeves<OptionDataResponse>();
        return response.data;
    }
);

export const getThicknessData = createAsyncThunk(
    SLICE_NAME + '/getThicknessData',
    async () => {
        const response = await apiGetSalesThickness<OptionDataResponse>();
        return response.data;
    }
);

export const getTextureData = createAsyncThunk(
    SLICE_NAME + '/getTextureData',
    async () => {
        const response = await apiGetSalesTextures<OptionDataResponse>();
        return response.data;
    }
);

export const getElasticityData = createAsyncThunk(
    SLICE_NAME + '/getElasticityData',
    async () => {
        const response = await apiGetSalesElasticitys<OptionDataResponse>();
        return response.data;
    }
);

export const getColorData = createAsyncThunk(
    SLICE_NAME + '/getColorData',
    async () => {
        const response = await apiGetSalesColors<OptionDataResponse>();
        return response.data;
    }
);

export const getSizeData = createAsyncThunk(
    SLICE_NAME + '/getSizeData',
    async () => {
        const response = await apiGetSalesSizes<OptionDataResponse>();
        return response.data;
    }
);

export const getMaterialData = createAsyncThunk(
    SLICE_NAME + '/getMaterialData',
    async () => {
        const response = await apiGetSalesMaterials<OptionDataResponse>();
        return response.data;
    }
);
export const getProductData = createAsyncThunk(
    SLICE_NAME + '/getProductData',
    async () => {
        const response = await apiGetSalesProductList<ProductFromDatas>();
        return response.data;
    }
);

const initialState: OptionState = {
    loading: true,
    brandData: [],
    originData: [],
    styleData: [],
    collarData: [],
    sleeveData: [],
    thicknessData: [],
    textureData: [],
    elasticityData: [],
    colorData: [],
    sizeData: [],
    materialData: [],
    productData:[]
};


const OptionSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getBrandData.fulfilled, (state, action) => {
                state.brandData = action.payload.data;
                state.loading = false;
            })
            .addCase(getBrandData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBrandData.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getOriginData.fulfilled, (state, action) => {
                state.originData = action.payload.data;
                state.loading = false;
            })
            .addCase(getOriginData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getOriginData.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getStyleData.fulfilled, (state, action) => {
                state.styleData = action.payload.data;
                state.loading = false;
            })
            .addCase(getStyleData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getStyleData.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getCollarData.fulfilled, (state, action) => {
                state.collarData = action.payload.data;
                state.loading = false;
            })
            .addCase(getCollarData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCollarData.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getSleeveData.fulfilled, (state, action) => {
                state.sleeveData = action.payload.data;
                state.loading = false;
            })
            .addCase(getSleeveData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSleeveData.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getThicknessData.fulfilled, (state, action) => {
                state.thicknessData = action.payload.data;
                state.loading = false;
            })
            .addCase(getThicknessData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getThicknessData.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getTextureData.fulfilled, (state, action) => {
                state.textureData = action.payload.data;
                state.loading = false;
            })
            .addCase(getTextureData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTextureData.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getElasticityData.fulfilled, (state, action) => {
                state.elasticityData = action.payload.data;
                state.loading = false;
            })
            .addCase(getElasticityData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getElasticityData.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getColorData.fulfilled, (state, action) => {
                state.colorData = action.payload.data;
                state.loading = false;
            })
            .addCase(getColorData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getColorData.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getSizeData.fulfilled, (state, action) => {
                state.sizeData = action.payload.data;
                state.loading = false;
            })
            .addCase(getSizeData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSizeData.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getMaterialData.fulfilled, (state, action) => {
                state.materialData = action.payload.data;
                state.loading = false;
            })
            .addCase(getMaterialData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMaterialData.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getProductData.fulfilled, (state, action) => {
                state.productData = action.payload.data;
                state.loading = false;
            })
            .addCase(getProductData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProductData.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default OptionSlice.reducer;  
