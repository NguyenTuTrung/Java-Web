import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export type Attribute = {
    id: number;
    code: string;
    name: string;
    deleted: boolean;
    // createdDate: string;
    // modifiedDate: string;
}; 

export type Product = {
    id: number;
    code: string;
    name: string;
    description:string;
    deleted: boolean;
    createdDate: string;
    modifiedDate: string;
}; 

 
export type AddAttributeState = {
    loading: boolean;
    addAttribute: boolean;
    dataAttribute: Attribute | null;
    labelAttribute: string;
    nameAttribute:string
    options: Attribute[]; // Danh sách tùy chọn 
};

export type AddProductState = {
    loading: boolean;
    addProduct: boolean;
    dataProduct: Product | null;
    nameProduct:string
    options: Product[]; // Danh sách tùy chọn cho sản phẩm
};

type GetDataAttribute = {
    AttributeData: Attribute;
    apiFunc: (data: Attribute) => Promise<{ data: Attribute }>;
};

type GetDataProduct = {
    ProductData: Product;
    apiFunc: (data: Product) => Promise<{ data: Product }>;
};

export const SLICE_NAME_ADD_ATTRIBUTE = 'addAttribute';
export const SLICE_NAME_ADD_PRODUCT = 'addProduct';

// Thunk cho thêm thuộc tính
export const addAttribute = createAsyncThunk<Attribute, GetDataAttribute>(
    `${SLICE_NAME_ADD_ATTRIBUTE}/addAttribute`,
    async ({ AttributeData, apiFunc }) => {
        const response = await apiFunc(AttributeData);
        if (!response || !response.data) {
            throw new Error("Invalid response from API");
        }
        return response.data; // Trả về dữ liệu thuộc tính mới
    }
);

// Thunk cho thêm sản phẩm
export const addProduct = createAsyncThunk<Product, GetDataProduct>(
    `${SLICE_NAME_ADD_PRODUCT}/addProduct`,
    async ({ ProductData, apiFunc }) => {
        const response = await apiFunc(ProductData);
        if (!response || !response.data) {
            throw new Error("Invalid response from API");
        }
        return response.data; // Trả về dữ liệu sản phẩm mới
    }
);

const initialStateAttribute: AddAttributeState = {
    loading: false,
    addAttribute: false,
    dataAttribute: null,
    labelAttribute: '',
    nameAttribute:'',
    options: [], // Khởi tạo options là một mảng rỗng
};

const initialStateProduct: AddProductState = {
    loading: false,
    addProduct: false,
    dataProduct: null,
    nameProduct:'',
    options: [], // Khởi tạo options cho sản phẩm
};

// Slice cho thuộc tính
const attributeAdd = createSlice({
    name: SLICE_NAME_ADD_ATTRIBUTE,
    initialState: initialStateAttribute,
    reducers: {
        setAttributeData: (state, action) => {
            state.dataAttribute = action.payload;
        },
        toggleAddAttributeConfirmation: (state, action) => {
            state.addAttribute = action.payload;
        },
        setLabelAttribute: (state, action) => {
            state.labelAttribute = action.payload;
        },
        setNameAttribute: (state, action) => {
            state.nameAttribute = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addAttribute.fulfilled, (state, action) => {
                state.loading = false;
                state.dataAttribute = action.payload;
                state.addAttribute = false;
                state.options.push(action.payload); // Cập nhật options với thuộc tính mới
            })
            .addCase(addAttribute.pending, (state) => {
                state.loading = true;
            })
            .addCase(addAttribute.rejected, (state) => {
                state.loading = false;
            });
    }
});

// Slice cho sản phẩm
const productAdd = createSlice({
    name: SLICE_NAME_ADD_PRODUCT,
    initialState: initialStateProduct,
    reducers: {
        setNameProduct: (state, action) => {
            state.nameProduct = action.payload;
        },
        setProductData: (state, action) => {
            state.dataProduct = action.payload;
        },
        toggleAddProductConfirmation: (state, action) => {
            state.addProduct = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.dataProduct = action.payload;
                state.addProduct = false;
                state.options.push(action.payload); // Cập nhật options với sản phẩm mới
            })
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(addProduct.rejected, (state) => {
                state.loading = false;
            });
    }
});

// Xuất actions và reducer
export const { setAttributeData, toggleAddAttributeConfirmation, setLabelAttribute, setNameAttribute } = attributeAdd.actions;
export const { setProductData, toggleAddProductConfirmation, setNameProduct } = productAdd.actions;

export default {
    attributeReducer: attributeAdd.reducer,
    productReducer: productAdd.reducer,
};
