import ApiService from './ApiService'


export async function apiGetSalesDashboardData<
    T extends Record<string, unknown>
>() {
    return ApiService.fetchData<T>({
        url: '/customers/get-all',
        method: 'post'
    })
}


export async function apiDeleteSalesCutomers<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/customer/delete',
        method: 'delete',
        data
    })
}

export async function apiGetSaleCutomer<T, U extends Record<string, unknown>>(
    params: U
) {
    return ApiService.fetchData<T>({
        url: '/customer/get-all',
        method: 'get',
        params
    })
}

export async function apiGetSalesCutomers<T, U extends Record<number, unknown>>(
    params: U
) {
    return ApiService.fetchData<T>({
        url: '/customer/get-all',
        method: 'get',
        params
    })
}

export async function apiDeleteSalesOrders<
    T,
    U extends Record<number, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/sales/orders/delete',
        method: 'delete',
        data
    })
}

export async function apiGetSalesOrderDetails<
    T,
    U extends Record<string, unknown>
>(params: U) {
    return ApiService.fetchData<T>({
        url: '/sales/orders-details',
        method: 'get',
        params
    })
}
