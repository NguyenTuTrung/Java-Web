import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiDeleteSalesProductDetail,
    apiGetSalesProductDetails,
} from '@/services/ProductSalesService'
import type { TableQueries } from '@/@types/common'
import * as XLSX from 'xlsx';
import QRCode from 'qrcode';
import { saveAs } from 'file-saver';
type ChildObject = {
    code: string;
    createdDate: string; 
    deleted: boolean;
    id: number;
    name: string;
};
type Image = {
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
    name: string;
    createdDate: string;
    size: ChildObject;
    color: ChildObject;
    brand?: ChildObject;
    collar?: ChildObject;
    elasticity?: ChildObject;
    material?: ChildObject;
    origin?: ChildObject;
    sleeve?: ChildObject;
    style?: ChildObject;
    texture?: ChildObject;
    thickness?: ChildObject;
    price?: number;
    quantity?: number;
    mass?:number
    images?: Image[]
    deleted: boolean;
    product: ChildObject;
}

type ProductDetails = ProductDetail[]

type GetSalesProductDetailsResponse = {
    content: ProductDetails
    totalElements: number
}

export type FilterQueries = {
    productId: number,
    size: string,
    color: string,
    style: string,
    texture: string,
    origin: string,
    brand: string,
    collar: string,
    sleeve: string,
    material: string,
    thickness: string,
    elasticity: string,
}

export type SalesProductDetailListState = {
    loading: boolean
    deleteConfirmation: boolean
    selectedProductDetail: string
    tableData: TableQueries
    productDetailList: ProductDetail[]
    filterData: FilterQueries,
    productId: number
}

type GetSalesProductDetailsRequest = TableQueries & { filterData?: FilterQueries }

type QueryParam  = {
    productId: number, 
}

export const SLICE_NAME = 'salesProductDetailList'
export const getProductDetails = createAsyncThunk(
    SLICE_NAME + '/getProductDetails',
    async (data: GetSalesProductDetailsRequest, { getState }) => {
        const state = getState() as { salesProductDetailList: SalesProductDetailListState };

        const params: FilterQueries = {
            productId: state.salesProductDetailList.data.productId,
            size: state.salesProductDetailList.data.filterData.size,
            color: state.salesProductDetailList.data.filterData.color,
            style: state.salesProductDetailList.data.filterData.style,
            texture: state.salesProductDetailList.data.filterData.texture,
            origin: state.salesProductDetailList.data.filterData.origin,
            brand: state.salesProductDetailList.data.filterData.brand,
            collar: state.salesProductDetailList.data.filterData.collar,
            sleeve: state.salesProductDetailList.data.filterData.sleeve,
            material: state.salesProductDetailList.data.filterData.material,
            thickness: state.salesProductDetailList.data.filterData.thickness,
            elasticity: state.salesProductDetailList.data.filterData.elasticity,
        };

        const response = await apiGetSalesProductDetails<GetSalesProductDetailsResponse, GetSalesProductDetailsRequest>(
            data,
            params
        );

        return response.data;
    }
);








export const deleteProductDetail = async (param: { id: string }) => {
    const response = await apiDeleteSalesProductDetail<
        boolean,
        { id: string  }
        >(param)
    return response.data
}

export const exportToExcel = (productDetailList: ProductDetail[]) => {
    const data = productDetailList.map((product, index) => ({
        'STT': index + 1,  
        'Code': product.code,
        'Tên': product.product ? `${product.product.name} màu ${product.color.name} (Size ${product.size.name})` : '',
        'Size': product.size.name,
        'Màu': product.color.name,
        'Thương hiệu': product.brand ? product.brand.name : '',
        'Xuất xứ': product.origin ? product.origin.name : '',
        'Kiểu dáng': product.style ? product.style.name : '',
        'Chất liệu': product.material ? product.material.name : '',
        'Kiểu cổ áo': product.collar ? product.collar.name : '',
        'Kiểu tay áo': product.sleeve ? product.sleeve.name : '',
        'Kết cấu': product.texture ? product.texture.name : '',
        'Dộ dày': product.thickness ? product.thickness.name : '',
        'Dộ co giãn': product.elasticity ? product.elasticity.name : '',
        'Khối lượng': product.mass,
        'Giá': product.price,
        'Số lượng': product.quantity,
        'Ngày Tạo': product.createdDate,
        'Trạng thái': getStatus(product.quantity),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data, { header: Object.keys(data[0]) });

    const statusCol = Object.keys(data[0]).indexOf('Trạng thái');
    if (statusCol >= 0) {
        for (let row = 2; row <= data.length + 1; row++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row - 1, c: statusCol });
            const cell = worksheet[cellAddress];
            if (cell) {
                if (cell.v === 'Hết hàng') {
                    cell.s = { fill: { fgColor: { rgb: 'FF0000' } } };  
                } else if (cell.v === 'Sắp hết') {
                    cell.s = { fill: { fgColor: { rgb: 'FFFF00' } } }; 
                } else if (cell.v === 'Còn hàng') {
                    cell.s = { fill: { fgColor: { rgb: '00FF00' } } };  
                }
            }
        }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Product Details');

    XLSX.writeFile(workbook, 'ProductDetails.xlsx');
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




export const generateQRCode = async (productDetailList: ProductDetail[]) => {
    try {
        for (const productDetail of productDetailList) {
            const data = productDetail.code;
            const filename = 'QR_san_pham_' + productDetail?.product.name + '_màu_' + productDetail?.color.name + '(Size_' + productDetail?.size.name+')' + '.png';
            const qrBase64 = await QRCode.toDataURL(data);
            console.log('Tạo thành công QR cho code:', data);
            const byteString = atob(qrBase64.split(',')[1]);

            const mimeString = qrBase64.split(',')[0].split(':')[1].split(';')[0];
            const byteArray = new Uint8Array(byteString.length);
            for (let i = 0; i < byteString.length; i++) {
                byteArray[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([byteArray], { type: mimeString });

            saveAs(blob, filename);
            console.log('QR code saved as file:', filename);
        }
    } catch (error) {
        console.error('Tạo và lưu QR thất bại: ', error);
    }
};






export const initialTableData: TableQueries = {
    total: 0,
    pageIndex: 1,
    pageSize: 5,
    query: '',
    sort: {
        order: '',
        key: '',
    },
}

export const initialQuery: FilterQueries={
    productId: 55,
    size: '',
    color: '',
    style: '',
    texture: '',
    origin: '',
    brand: '',
    collar: '',
    sleeve: '',
    material: '',
    thickness: '',
    elasticity: ''
}

const initialState: SalesProductDetailListState = {
    loading: false,
    deleteConfirmation: false,
    selectedProductDetail: '',
    productDetailList: [],
    tableData: initialTableData,
    filterData: initialQuery,
    productId: 0
}


const productDetailListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateProductDetailList: (state, action) => {
            state.productDetailList = action.payload
        },
        setTableData: (state, action) => {
            state.tableData = action.payload
           
        },
        setProductId: (state, action) => {
            state.productId = action.payload
        },
        setFilterData: (state, action) => {
            state.filterData = action.payload; // Cập nhật filterData
        },
      
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedProductDetail: (state, action) => {
            state.selectedProductDetail = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProductDetails.fulfilled, (state, action) => {
                state.productDetailList = action.payload.content
                state.tableData.total = action.payload.totalElements
                state.loading = false
            })
            .addCase(getProductDetails.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    updateProductDetailList,
    setTableData,
    setProductId,
    toggleDeleteConfirmation,
    setSelectedProductDetail,
    setFilterData,
} = productDetailListSlice.actions

export default productDetailListSlice.reducer

