import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export type Option = {
    id: number;
    code: string;
    name: string;
    deleted: boolean;
    createdDate: string;
    modifiedDate: string;
};

export type AddAttributeState = {
    loading: boolean;
    addAttribute: boolean;
    dataAttribute: Option | null;
};


type GetDataAttribute = {
    AttributeData: Option;
    apiAdd: (data: Option) => Promise<{ data: Option }>;
};



export const SLICE_NAME_ADD_ATTRIBUTE = 'attributeNew';

export const addAttribute = createAsyncThunk<Option, GetDataAttribute>(
    `${SLICE_NAME_ADD_ATTRIBUTE}/addAttribute`,
    async ({ AttributeData, apiAdd }) => {
        const response = await apiAdd(AttributeData);
        if (!response || !response.data) {
            throw new Error("Invalid response from API");
        }
        return response.data; 
    }
);


const initialStateAttribute: AddAttributeState = {
    loading: false,
    addAttribute: false,
    dataAttribute: null,
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
       
    },
    extraReducers: (builder) => {
        builder
            .addCase(addAttribute.fulfilled, (state, action) => {
                state.loading = false;
                state.dataAttribute = action.payload;
                state.addAttribute = false;
            })
            .addCase(addAttribute.pending, (state) => {
                state.loading = true;
            })
            .addCase(addAttribute.rejected, (state) => {
                state.loading = false;
            });
    }
});

export const { setAttributeData, toggleAddAttributeConfirmation } = attributeAdd.actions;


export default attributeAdd.reducer