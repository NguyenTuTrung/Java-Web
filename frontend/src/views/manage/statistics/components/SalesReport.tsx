import Card from '@/components/ui/Card'
import Chart from '@/components/shared/Chart'
import { Button, Radio, Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { HiOutlineCash, HiOutlineChartSquareBar, HiOutlineHome, HiOutlineUser } from 'react-icons/hi'
import {
    getStatisticOverviewV2,
    setChartMode,
    setTimeOption,
    TimeOption,
    useAppDispatch,
    useAppSelector
} from '../store'
import { useEffect, useState } from 'react'

const SalesReport = () => {
    const dispatch = useAppDispatch()
    const selectedTimeOption = useAppSelector((state) => state.statistic.timeOption)
    const listOverViewChart = useAppSelector((state) => state.statistic.overviewChartData)
    const chartMode = useAppSelector((state) => state.statistic.chartMode)

    const [visitorChartData, setVisitorChartData] = useState({
        series: [
            {
                name: 'Session Duration',
                data: []
            }
        ],
        categories: Array.isArray(listOverViewChart) ? listOverViewChart.map(s => s.symbol) : []
    });

    useEffect(() => {
        const updatedSeries = [];
        const updatedCategories = Array.isArray(listOverViewChart) ? listOverViewChart.map(s => s.symbol) : []; // Cập nhật categories

        if (chartMode === 0) {
            updatedSeries.push({
                name: 'Số lượng sản phẩm',
                data: Array.isArray(listOverViewChart) ?listOverViewChart.map(s => s.quantity) : []
            });
        } else {
            updatedSeries.push({
                name: 'Doanh số',
                data: Array.isArray(listOverViewChart) ?listOverViewChart.map(s => Number((s.revenue).toFixed(0))) : []
            });
        }

        setVisitorChartData(prevData => ({
            ...prevData,
            series: updatedSeries,
            categories: updatedCategories  // Cập nhật categories
        }));
    }, [chartMode, listOverViewChart]);


    useEffect(() => {
        dispatch(getStatisticOverviewV2())
    }, [])
    const handleChangeTimeOption = (el: TimeOption) => {
        console.log(el)
        dispatch(setTimeOption(el))
    }
    useEffect(() => {
        console.log('Change selectedTimeOption', selectedTimeOption)
        dispatch(getStatisticOverviewV2())
    }, [selectedTimeOption])

    return (
        <Card>
            <div className="flex items-center justify-between">
                <h4>Thống kê</h4>
                <Tabs defaultValue="tab1" value={chartMode.toString()} onChange={(val) => dispatch(setChartMode(Number(val)))}>
                    <TabList>
                        <TabNav value="0" icon={<HiOutlineChartSquareBar  />}>
                            Số lượng
                        </TabNav>
                        <TabNav value="1" icon={<HiOutlineCash />}>
                            Doanh số
                        </TabNav>
                    </TabList>
                </Tabs>
                <div>
                    <Radio.Group value={selectedTimeOption} onChange={(el) => handleChangeTimeOption(el)}>
                        <Radio value={TimeOption.DAILY}>Ngày</Radio>
                        <Radio value={TimeOption.MONTHLY}>Tháng</Radio>
                        <Radio value={TimeOption.YEARLY}>Năm</Radio>
                    </Radio.Group>
                </div>
                {/*<Button size="sm">Export Report</Button>*/}
            </div>
            <Chart
                series={visitorChartData.series}
                xAxis={visitorChartData.categories}
                height={400}
                type={'bar'}
            />
        </Card>
    )
}

export default SalesReport
