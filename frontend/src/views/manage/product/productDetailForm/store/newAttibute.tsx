import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export type Attribute = {
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
    dataAttribute: Attribute | null;
    labelAttribute: string;
    options: Attribute[]; 
};


type GetDataAttribute = {
    AttributeData: Attribute;
    apiFunc: (data: Attribute) => Promise<{ data: Attribute }>;
};



export const NEW_ATTRIBUTE = 'newAttribute';


export const newAttribute = createAsyncThunk<Attribute, GetDataAttribute>(
    `${NEW_ATTRIBUTE}/newAttribute`,
    async ({ AttributeData, apiFunc }) => {
        const response = await apiFunc(AttributeData);
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
    labelAttribute: '',
    options: [], 
};


const attributeNew = createSlice({
    name: NEW_ATTRIBUTE,
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(newAttribute.fulfilled, (state, action) => {
                state.loading = false;
                state.dataAttribute = action.payload;
                state.addAttribute = false;
                state.options.push(action.payload);
            })
            .addCase(newAttribute.pending, (state) => {
                state.loading = true;
            })
            .addCase(newAttribute.rejected, (state) => {
                state.loading = false;
            });
    }
});

export const { setAttributeData, toggleAddAttributeConfirmation, setLabelAttribute } = attributeNew.actions;

export default attributeNew.reducer