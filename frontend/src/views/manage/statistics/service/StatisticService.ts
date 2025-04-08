import ApiService from '@/services/ApiService'

type TimeRequestsPayload = {
    from: string,
    to: string,
}

function apiFetchOverviewStatistic<T extends Record<string, unknown>>(data: TimeRequestsPayload) {
    return ApiService.fetchData<T>({
        url: '/statistics/overview',
        method: 'post',
        data: data
    })
}

function apiFetchChartOverview<T extends Record<string, unknown>>(data: TimeRequestsPayload) {
    return ApiService.fetchData<T>({
        url: '/statistics/v2/overview',
        method: 'post',
        data: data
    })
}

function apiFetchSaleByCategories<T extends Record<string, unknown>>() {
    return ApiService.fetchData<T>({
        url: '/orders/count-any-status',
        method: 'get',
    })
}

function apiFetchTopSeller<T, U extends Record<string, unknown>>(
    param: U
) {
    return ApiService.fetchData<T>({
        url: '/statistics/top-seller',
        method: 'get',
        param: param
    })
}

function apiFetchLastOrders<T, U extends Record<string, unknown>>(
        params: U
    ) {
        return ApiService.fetchData<T>({
            url: '/orders/overview',
            method: 'post',
            data: {
                "total": 51,
                "pageIndex": 1,
                "pageSize": 10,
                "query": "",
                "sort": {
                    "order": "desc",
                    "key": "createdDate"
                }
            },
            params: params
        })
    }
export {
    apiFetchChartOverview,
    apiFetchOverviewStatistic,
    apiFetchSaleByCategories,
    apiFetchTopSeller,
    apiFetchLastOrders,
}