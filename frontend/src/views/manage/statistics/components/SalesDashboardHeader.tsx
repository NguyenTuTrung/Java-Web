import DatePicker from '@/components/ui/DatePicker'
import Button from '@/components/ui/Button'
import {
    setStartDate,
    setEndDate,  // Thêm action cho endDate
    useAppSelector, getStatisticOverviewV2, setStartDateChart, setEndDateChart
} from '../store'
import { useAppDispatch } from '@/store'
import { HiOutlineFilter } from 'react-icons/hi'
import dayjs from 'dayjs'
import { useEffect } from 'react'

const dateFormat = 'MMM DD, YYYY'
const { DatePickerRange } = DatePicker

const SalesDashboardHeader = () => {
    const dispatch = useAppDispatch()

    const startDate = useAppSelector((state) => state.statistic.startDateChart)
    const endDate = useAppSelector((state) => state.statistic.endDateChart)

    const handleDateChange = (value: [Date | null, Date | null]) => {
        if (value[0]) {
            dispatch(setStartDateChart(value[0].toISOString()))
        }
        if (value[1]) {
            dispatch(setEndDateChart(value[1].toISOString()))  // Gọi setEndDate cho giá trị endDate
        }
    }
    const handleDateChangeStartDateChart = (value: Date | null) => {
        console.log("-------")
        console.log(value)
        if(value){
            dispatch(setStartDateChart(value.toISOString()))
            dispatch(getStatisticOverviewV2())
        }
    }
    const handleDateChangeEndDateChart = (value: Date | null) => {
        console.log("-------")
        console.log(value)
        if(value){
            dispatch(setEndDateChart(value.toISOString()))
            dispatch(getStatisticOverviewV2())
        }
    }
    const onFilter = () => {
        dispatch(getStatisticOverviewV2())
    }
    useEffect(() => {
        getStatisticOverviewV2()
    }, [startDate, endDate])
    return (
        <div className="lg:flex items-center justify-between mb-4 gap-3">
            <div className="mb-4 lg:mb-0">
                <h3>Tổng quan bán hàng</h3>
                <p>Xem doanh số và tóm tắt hiện tại của bạn</p>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                <DatePicker value={dayjs(startDate).toDate()} placeholder="Pick a date" onChange={handleDateChangeStartDateChart} />
                <DatePicker value={dayjs(endDate).toDate()} placeholder="Pick a date" onChange={handleDateChangeEndDateChart} />

                {/*<Button size="sm" icon={<HiOutlineFilter />} onClick={onFilter}>*/}
                {/*    Lọc*/}
                {/*</Button>*/}
            </div>
        </div>
    )
}

export default SalesDashboardHeader
