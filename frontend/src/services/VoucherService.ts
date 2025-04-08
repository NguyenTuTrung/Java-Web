import ApiService from './ApiService'

// export async function apiGetSalesDashboardData<
//     T extends Record<string, unknown>
// >() {
//     return ApiService.fetchData<T>({
//         url: '/sales/dashboard',
//         method: 'post',
//     })
// }

export async function apiGetSalesVouchers<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/voucher/add',
        method: 'post',
        data,
    })
}

export async function apiDeleteSalesVouchers<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/voucher/delete',
        method: 'delete',
        data,
    })
}

export async function apiGetSalesVoucher<T, U extends Record<string, unknown>>(
    params: U
) {
    return ApiService.fetchData<T>({
        url: '/voucher',
        method: 'get',
        params,
    })
}

export async function apiPutSalesVoucher<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/voucher/update',
        method: 'put',
        data,
    })
}

export async function apiCreateSalesVoucher<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/voucher/create',
        method: 'post',
        data,
    })
}