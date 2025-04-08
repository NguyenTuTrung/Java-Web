import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import {
    apiFetchChartOverview, apiFetchLastOrders,
    apiFetchOverviewStatistic,
    apiFetchSaleByCategories, apiFetchTopSeller
} from '@/views/manage/statistics/service/StatisticService'
import { RootState } from '@/store'


export enum TypeStatistic {
    REVENUE = 'REVENUE',
    QUANTITY = 'QUANTITY',
}

export enum TimeOption {
    DAILY = 'daily',
    MONTHLY = 'monthly',
    YEARLY = 'yearly',
}

export type TopProductDTO = {
    id: string
    name: string
    img: string
    sold: number
}

type TopProductParam = {
    page: number,
    size: number
}

export type OverViewMonth = {
    createDate: Date,
    month: number,
    year: number,
    quantityOrder: number,
    totalRevenue: number
}

export type OrderCounts = {
    countAll: number;
    countPending: number;
    countToShip: number;
    countToReceive: number;
    countDelivered: number;
    countCancelled: number;
    countReturned: number;
};

export type ChartOverviewData = {
    symbol: string,
    quantity: number,
    revenue: number
}
type DashboardDataResponse = {
    data: OverViewMonth[]
}
type LatestOrderParam = {
    status: string,
}
export type OrderDTO = {
    id: number;
    code: string;
    address: string;
    phone: string;
    recipientName: string;
    deleted: boolean;
    createdDate: string; // Có thể đổi thành Date nếu bạn muốn chuyển chuỗi thành Date
    status: string
    type: string
    payment: string
    total: number;
    deliveryFee: number;
    subTotal: number;
    discount: number;
    customerName: string;
    staffName: string;
    provinceId: number;
    provinceName: string;
    districtId: number;
    districtName: string;
    wardId: number;
    wardName: string;
};

export type StatisticState = {
    startDate: string; // Change from Date to string
    endDate: string; // Change from Date to string
    loading: boolean,
    typeStatistic: TypeStatistic,
    timeOption: TimeOption,
    overviewOneMonthData: OverViewMonth[],
    overviewOneMonthDataBefore: OverViewMonth[],
    overviewChartData: ChartOverviewData[],
    startDateChart: string,
    endDateChart: string,
    saleByCategoriesData?: OrderCounts,
    listTopProduct: TopProductDTO[];
    latestOrderParam: LatestOrderParam,
    listLatestOrders: OrderDTO[],
    topProductParam: TopProductParam,
    chartMode: number
}


export const SLICE_NAME = 'statisticSlice'

export const getStatisticOverview = createAsyncThunk(
    SLICE_NAME + '/getSalesDashboardData',
    async () => {
        const data = {
            'from': dayjs().subtract(1, 'month').startOf('month').toISOString(),
            'to': dayjs().endOf('month').toISOString()
        }
        const response = await apiFetchOverviewStatistic<DashboardDataResponse>(data)
        console.log('RESULT: ')
        return response.data
    }
)
export const getStatisticOverviewBefore = createAsyncThunk(
    SLICE_NAME + '/getStatisticOverviewBefore',
    async () => {
        const data = {
            'from':dayjs().subtract(1, 'month').startOf('month').toISOString(),
            'to': dayjs().subtract(1, 'month').endOf('month').toISOString()
        }
        const response = await apiFetchOverviewStatistic<DashboardDataResponse>(data)
        console.log('RESULT: ')
        return response.data
    }
)
export const getStatisticOverviewV2 = createAsyncThunk(
    SLICE_NAME + '/getChartOverview',
    async (_, { getState }) => {
        const state = getState() as RootState
        const data = {
            'from': state.statistic.startDateChart,
            'to': state.statistic.endDateChart,
            'timePeriod': state.statistic.timeOption
        }
        const response = await apiFetchChartOverview<DashboardDataResponse>(data)
        console.log('RESULT CHART: ', response.data)
        return response.data
    }
)
export const getSaleByCategories = createAsyncThunk(
    SLICE_NAME + '/getSaleByCategories',
    async () => {
        const response = await apiFetchSaleByCategories<OrderCounts>()
        return response.data
    }
)
export const getTopSeller = createAsyncThunk(
    SLICE_NAME + '/getTopSeller',
    async (_, { getState }) => {
        const state = getState() as RootState
        const response = await apiFetchTopSeller<TopProductDTO, TopProductParam>(state.statistic.topProductParam)
        return response.data
    }
)
export const getLastOrders = createAsyncThunk(
    SLICE_NAME + '/getLastOrders',
    async (_, { getState }) => {
        const state = getState() as RootState
        const response = await apiFetchLastOrders<TopProductDTO, LatestOrderParam>(state.statistic.latestOrderParam)
        return response.data
    }
)

// KHỞI TẠO DỮ LIỆU GỐC
const initialState: StatisticState = {
    startDate: dayjs().startOf('month').toISOString(),
    endDate: dayjs().endOf('month').toISOString(),
    loading: true,
    overviewOneMonthData: [],
    overviewOneMonthDataBefore: [],
    overviewChartData: [],
    typeStatistic: TypeStatistic.REVENUE,
    timeOption: TimeOption.DAILY,
    startDateChart: dayjs().subtract(2, 'year').toDate().toISOString(),
    endDateChart: new Date().toISOString(),
    listTopProduct: [],
    latestOrderParam: {
        status: ''
    },
    listLatestOrders: [],
    topProductParam: {
        page: 0,
        size: 10
    },
    chartMode: 0
}

// TẠO SLICE
const statisticSlice = createSlice({
    name: 'StatisticsSlice',
    initialState: initialState,
    // REDUCERS
    reducers: {
        setStartDate: (state, action: PayloadAction<string>) => {
            state.startDate = action.payload
        },
        setEndDate: (state, action: PayloadAction<string>) => {
            state.endDate = action.payload
        },
        setStartDateChart: (state, action: PayloadAction<string>) => {
            state.startDateChart = action.payload
        },
        setEndDateChart: (state, action: PayloadAction<string>) => {
            state.endDateChart = action.payload
        },
        setTimeOption: (state, action: PayloadAction<TimeOption>) => {
            state.timeOption = action.payload
        },
        setTypeStatistic: (state, action: PayloadAction<TypeStatistic>) => {
            state.typeStatistic = action.payload
        },
        setChartMode: (state, action: PayloadAction<number>) => {
            state.chartMode = action.payload
        }
    },
    // REDUCERS EXTRA
    extraReducers: (builder) => {
        builder
            .addCase(getStatisticOverview.fulfilled, (state, action) => {
                state.overviewOneMonthData = action.payload
                state.loading = false
            })
            .addCase(getStatisticOverview.pending, (state) => {
                state.loading = true
            })
            .addCase(getStatisticOverviewBefore.fulfilled, (state, action) => {
                state.overviewOneMonthDataBefore = action.payload
                state.loading = false
            })
            .addCase(getStatisticOverviewBefore.pending, (state) => {
                state.loading = true
            })
            .addCase(getStatisticOverviewV2.fulfilled, (state, action) => {
                state.overviewChartData = action.payload
                state.loading = false
            })
            .addCase(getStatisticOverviewV2.pending, (state) => {
                state.loading = true
            })
            .addCase(getSaleByCategories.fulfilled, (state, action) => {
                state.saleByCategoriesData = action.payload
                state.loading = false
            })
            .addCase(getSaleByCategories.pending, (state) => {
                state.loading = true
            })
            .addCase(getTopSeller.fulfilled, (state, action) => {
                state.listTopProduct = action.payload?.content
                state.loading = false
            })
            .addCase(getTopSeller.pending, (state) => {
                state.loading = true
            })
            .addCase(getLastOrders.fulfilled, (state, action) => {
                state.listLatestOrders = action.payload?.content
                state.loading = false
            })
            .addCase(getLastOrders.pending, (state) => {
                state.loading = true
            })

    }
})
export const {
    setStartDate,
    setEndDate,
    setTimeOption,
    setTypeStatistic,
    setChartMode,
    setStartDateChart,
    setEndDateChart
} = statisticSlice.actions

export default statisticSlice.reducer
