import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetSalesProducts,
    apiDeleteSalesProducts,
    apiGetSalesProductList
} from '@/services/ProductSalesService'
import type { TableQueries } from '@/@types/common'
import * as XLSX from 'xlsx';
type Product = {
    id: string
    name: string
    code: string
    deleted: boolean
    createdDate: string;
    quantity: number;
}

type Products = Product[]

type GetSalesProductsResponse = {
    content: Products
    totalElements: number
}

type FilterQueries = {
    name: string
    category: string[]
    status: number[]
    productStatus: number
}

export type SalesProductListState = {
    loading: boolean
    deleteConfirmation: boolean
    selectedProduct: string
    tableData: TableQueries
    filterData: FilterQueries
    productList: Product[]
    product: Product[]
}

type GetSalesProductsRequest = TableQueries & { filterData?: FilterQueries  ,fetchAll?: boolean; }

export const SLICE_NAME = 'salesProductList' 
export const getProducts = createAsyncThunk(
    SLICE_NAME + '/getProducts',
    async (data: GetSalesProductsRequest) => {
        if (data.fetchAll) {
            // Gọi API để lấy tất cả sản phẩm (có thể bỏ qua phân trang và bộ lọc)
            const response = await apiGetSalesProducts<GetSalesProductsResponse, GetSalesProductsRequest>({
                ...data,
                pageIndex: 1, // Hoặc bỏ qua các thông số phân trang nếu API hỗ trợ
                pageSize: 100, // Hoặc giá trị lớn để đảm bảo lấy tất cả sản phẩm
            });
            return response.data;
        } else {
            // Gọi API để lấy sản phẩm theo phân trang và bộ lọc hiện tại
            const response = await apiGetSalesProducts<GetSalesProductsResponse, GetSalesProductsRequest>(data);
            return response.data;
        }
    }
);


export const deleteProduct = async (params: { id: string | string[] }) => {
    try {
        const response = await apiDeleteSalesProducts<boolean>(params.id);
        if (response.status === 204) {
            return true; 
        } else {
            return false; 
        }
    } catch (error) {
        throw error; 
    }
};



export const exportToExcel = (productDetailList: Product[]) => {
    // Chuyển dữ liệu sản phẩm thành một mảng các đối tượng để xuất, bao gồm STT
    const data = productDetailList.map((product, index) => ({
        'STT': index + 1,  // Thêm cột số thứ tự
        'Mẫ': product.code,
        'Tên': product.name,
        'Số lượng': product.quantity,
        'Ngày Tạo': product.createdDate,
        'Trạng thái': getStatus(product.quantity),
    }));

    // Tạo workbook và worksheet từ dữ liệu
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Product Details');

    // Xuất file Excel
    XLSX.writeFile(workbook, 'DANH_SACH_SAN_PHAM.xlsx');
};


const getStatus = (quantity?: number): string => {
    if (quantity === undefined || quantity === 0) {
        return 'Hết hàng';
    } else if (quantity > 0 && quantity <= 10) {
        return 'Sắp hết';
    } else {
        return 'Còn hàng';
    }
};



export const initialTableData: TableQueries = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
}

const initialState: SalesProductListState = {
    loading: false,
    deleteConfirmation: false,
    selectedProduct: '',
    productList: [],
    tableData: initialTableData,
    filterData: {
        name: '',
        category: ['bags', 'cloths', 'devices', 'shoes', 'watches'],
        status: [0, 1, 2],
        productStatus: 0,
    },
    product:[]
}

const productListSlice = createSlice({ 
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateProductList: (state, action) => {
            state.productList = action.payload
        },
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setFilterData: (state, action) => {
            state.filterData = action.payload
        },
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;
                if (action.meta.arg.fetchAll) {
                    state.product = action.payload.content;
                } else {
                    state.productList = action.payload.content;
                    state.tableData.total = action.payload.totalElements
                    state.loading = false
                }
            })
            .addCase(getProducts.rejected, (state) => {
                state.loading = false;
            });
    },


    },
)

export const {
    updateProductList, 
    setTableData,
    setFilterData,
    toggleDeleteConfirmation,
    setSelectedProduct,
} = productListSlice.actions

export default productListSlice.reducer
