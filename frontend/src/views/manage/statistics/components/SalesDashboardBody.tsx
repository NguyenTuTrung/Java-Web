import React, { Fragment, useEffect } from 'react'
import Statistic from '@/views/manage/statistics/components/Statistic'
import SalesReport from '@/views/manage/statistics/components/SalesReport'
import SalesByCategories from '@/views/manage/statistics/components/SalesByCategories'
import LatestOrder from '@/views/manage/statistics/components/LatestOrder'
import TopProduct from '@/views/manage/statistics/components/TopProduct'
import { useAppDispatch } from '@/store'
import { getLastOrders, getTopSeller, useAppSelector } from '@/views/manage/statistics/store'

const SalesDashboardBody = () => {
    const dispatch = useAppDispatch()
    const listTopProduct = useAppSelector((state) => state.statistic.listTopProduct)
    const listLatestOrders = useAppSelector((state) => state.statistic.listLatestOrders)

    useEffect(() => {
        dispatch(getTopSeller())
        dispatch(getLastOrders())
    }, [])
    return (
        <Fragment>
            <Statistic />
            <div className="grid grid-cols-1 2xl:grid-cols-3 gap-4">
                <div className={'col-span-2'}>
                    <SalesReport />
                </div>
                <SalesByCategories/>
            </div>
            <div className="grid grid-cols-1 2xl:grid-cols-3 gap-4">
                <LatestOrder data={listLatestOrders} className="lg:col-span-2" />
                <TopProduct data={listTopProduct} />
            </div>
        </Fragment>
    )
}

export default SalesDashboardBody