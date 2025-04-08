import { TableQueries } from "@/@types/common";
import { apiDeleteSalesCutomers, apiGetSalesCutomers } from "@/services/CustomerService";
import { createAsyncThunk, createSlice, current, PayloadAction } from "@reduxjs/toolkit";


type Customer = {
    id : number;
    name : string;
    phone : string;
    email: string;
}

type Customers = Customer[]

type GetSalesCustomerResponse = {
    data: Customers
    total : number
}

export type SalesCustomerListState = {
    loading: boolean
    customerList : Customers
    tableData: TableQueries
    deleteMode: 'single' | 'batch' | ''
    selectedRows: number[]
    selectedRow : number
}

export const SLICE_NAME = 'salesCustomerList'

export const getCustomers = createAsyncThunk(
    SLICE_NAME + '/getCustomers',
    async (data: TableQueries) => {
        const response = await apiGetSalesCutomers<
            GetSalesCustomerResponse,
            TableQueries
        >(data)
        console.log(data)
        return response.data
    }
)



export const deleteOrders = async (data: { id: number | number[] }) => {
    const response = await apiDeleteSalesCutomers<
        boolean,
        { id: number | number[] }
    >(data)
    return response.data
}

const initialState: SalesCustomerListState = {
    loading: false,
    customerList: [],
    tableData: {
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: {
            order: '',
            key: '',
        },
    },
    selectedRows: [],
    selectedRow: 0,
    deleteMode: '',
}


const customerListSlice = createSlice({
    name : `${SLICE_NAME}/state`,
    initialState,
    reducers : {
        setCustomerList: (state, action) => {
            state.customerList = action.payload
        },
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setSelectedRows: (state, action) => {
            state.selectedRows = action.payload
        },
        setSelectedRow: (state, action) => {
            state.selectedRow = action.payload
        },
        addRowItem: (state, { payload }) => {
            const currentState = current(state)
            if (!currentState.selectedRows.includes(payload)) {
                state.selectedRows = [...currentState.selectedRows, ...payload]
            }
        },
        removeRowItem: (state, { payload }: PayloadAction<number>) => {
            const currentState = current(state)
            if (currentState.selectedRows.includes(payload)) {
                state.selectedRows = currentState.selectedRows.filter(
                    (id) => id !== payload
                )
            }
        },
        setDeleteMode: (state, action) => {
            state.deleteMode = action.payload
        },
    },
    extraReducers(builder) {
        // builder.addCase(getCustomers.fulfilled, (state, action) => {
        //     state.customerList = action.payload.data
        //     state.tableData.total = action.payload.total
        //     state.loading = false
        // })
        builder.addCase(getCustomers.fulfilled, (state, action) => {
            console.log("Fetched customer data:", action.payload);
            state.customerList = action.payload.data;
            state.tableData.total = action.payload.total;
            state.loading = false;
        })
        .addCase(getCustomers.pending, (state) => {
            state.loading = true
        })
    },
})

export const {
    setCustomerList,
    setTableData,
    setSelectedRows,
    setSelectedRow,
    addRowItem,
    removeRowItem,
    setDeleteMode,
} = customerListSlice.actions

export default customerListSlice.reducer


