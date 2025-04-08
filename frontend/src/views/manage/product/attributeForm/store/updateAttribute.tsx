import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define the type for DataAttribute
export type DataAttribute = {
    id: number;
    code: string;
    name: string;
    deleted: boolean;
    createdDate: string;
    modifiedDate: string;
};

// Define the initial state type
export type UpdateAttributeState = {
    loading: boolean;
    updateConfirmation: boolean;
    attributeData: DataAttribute | null;
};

// Define a unique action type string 
export const UPDATE_ATTRIBUTE = 'updateAttribute';
// Define the type for the API function
type ApiFunc<T, U extends Record<string, unknown>> = (params: U) => Promise<{ data: T }>;

// Modify the type of GetAttributesRequest to use ApiFunc
type GetAttributesRequest<T, U extends Record<string, unknown>> = {
    apiFunc: ApiFunc<T, U>;
    params: {id:number};
};

// Update the createAsyncThunk definition
export const getAttributeByID = createAsyncThunk<DataAttribute, GetAttributesRequest<DataAttribute, { id: number }>>(
    `${UPDATE_ATTRIBUTE}/getAttributes`,
    async ({ apiFunc, params }) => {
        const response = await apiFunc(params);
        if (!response || !response.data) {
            throw new Error("Invalid response from API");
        }
        return response.data;
    }
);

const initialState: UpdateAttributeState = {
    loading: false,
    updateConfirmation: false,
    attributeData: null,
};

const updateAttributeSlice = createSlice({
    name: 'updateAttribute',
    initialState,
    reducers: {
        resetState: (state) => {
            state.loading = false;
            state.updateConfirmation = false;
            state.attributeData = null;
        },
        toggleUpdateConfirmation: (state, action: PayloadAction<boolean>) => {
            state.updateConfirmation = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAttributeByID.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAttributeByID.fulfilled, (state, action: PayloadAction<DataAttribute>) => {
                state.loading = false;
                state.attributeData = action.payload;
            })
            .addCase(getAttributeByID.rejected, (state) => {
                state.loading = false;
            });
    },
});

// Export the actions for use in components
export const { resetState, toggleUpdateConfirmation } = updateAttributeSlice.actions;

// Export the reducer to be added to the store
export default updateAttributeSlice.reducer;
