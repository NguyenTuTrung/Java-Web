import Card from '@/components/ui/Card'
import { NumericFormat } from 'react-number-format'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import { getStatisticOverview, OverViewMonth, useAppDispatch, useAppSelector } from '../store'
import dayjs from 'dayjs'
import { useEffect, useMemo } from 'react'

type StatisticCardProps = {
    value: string
    growShrink: number
    label: string
    valuePrefix?: string
    date: string,
    message: string
}

const StatisticCard = ({
                           value,
                           growShrink,
                           label,
                           valuePrefix,
                           message
                       }: StatisticCardProps) => {
    return (
        <Card>
            <h6 className="font-semibold mb-4 text-sm">{label}</h6>
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-bold">
                        <NumericFormat
                            thousandSeparator
                            displayType="text"
                            value={value}
                            prefix={valuePrefix}
                        />
                    </h3>
                    <p>
                        {message}{' '}
                        {/*<span className="font-semibold">*/}
                        {/*    {dayjs(date).format('DD MMM')}*/}
                        {/*</span>*/}
                    </p>
                </div>
                <GrowShrinkTag value={growShrink} suffix="%" />
            </div>
        </Card>
    )
}

const Statistic = () => {
    const dispatch = useAppDispatch()
    const startDate = useAppSelector((state) => state.statistic.startDate)
    const salesData = useAppSelector((state) => state.statistic.overviewOneMonthData)

    // Tính ngày hôm qua
    const start_of_yesterday = dayjs().subtract(1, 'day').startOf('day').toDate()
    const end_of_yesterday = dayjs().subtract(1, 'day').endOf('day').toDate()

    // Tính tuần trước
    const startOfWeekISO = dayjs().startOf('week') // Đầu tuần này
    const startOfLastWeekISO = startOfWeekISO.subtract(1, 'week') // Đầu tuần trước
    const endOfLastWeekISO = startOfWeekISO.subtract(1, 'day') // Ngày kết thúc của tuần trước

    // Tính tháng trước
    const startOfMonth = dayjs().startOf('month') // Đầu tháng này
    const startOfLastMonth = dayjs().subtract(1, 'month').startOf('month') // Đầu tháng trước
    const endOfLastMonth = startOfMonth.subtract(1, 'day') // Ngày cuối tháng trước

    const calculateSummary = (data: OverViewMonth[], periodStart: Date, periodEnd: Date) => {
        return Array.isArray(data) && data.reduce(
            (acc, sale) => {
                const saleDate = new Date(sale.createDate)
                if (saleDate >= periodStart && saleDate < periodEnd) {
                    acc.quantityOrder += sale.quantityOrder
                    acc.totalRevenue += sale.totalRevenue
                }
                return acc
            },
            { quantityOrder: 0, totalRevenue: 0 }
        )
    }

    const summaryToday = useMemo(() => {
        const startOfDay = dayjs().startOf('day').toDate()
        const endOfDay = dayjs().endOf('day').toDate()
        return calculateSummary(salesData, startOfDay, endOfDay)
    }, [salesData])
    console.log("DOANH SO HOM NAY: ", summaryToday?.totalRevenue)
    const summaryYesterday = useMemo(() => calculateSummary(salesData, start_of_yesterday, end_of_yesterday), [salesData])
    console.log("DOANH SO HOM QUA: ", summaryYesterday?.totalRevenue)

    const summaryWeek = useMemo(() => calculateSummary(salesData, startOfWeekISO.toDate(), dayjs().endOf('day').toDate()), [salesData])
    const summaryMonth = useMemo(() => calculateSummary(salesData, startOfMonth.toDate(), dayjs().endOf('day').toDate()), [salesData])

    const summaryLastWeek = useMemo(() => calculateSummary(salesData, startOfLastWeekISO.toDate(), endOfLastWeekISO.toDate()), [salesData])
    const summaryLastMonth = useMemo(() => calculateSummary(salesData, startOfLastMonth.toDate(), endOfLastMonth.toDate()), [salesData])

    useEffect(() => {
        dispatch(getStatisticOverview())
    }, [dispatch])

    const calculateGrowth = (symbol: string, current: number, previous: number) => {
        console.log(current, previous)
        if (previous === 0) return 100 // Trường hợp đặc biệt khi doanh số trước đó bằng 0
        return ((current - previous) / previous) * 100
    }

    // Tính toán tăng trưởng
    const growthToday = calculateGrowth('day', summaryToday?.totalRevenue ?? 0, summaryYesterday?.totalRevenue ?? 0)
    const growthWeek = calculateGrowth('week', summaryWeek?.totalRevenue ?? 0, summaryLastWeek?.totalRevenue ?? 0)
    const growthMonth = calculateGrowth('month', summaryMonth?.totalRevenue ?? 0, summaryLastMonth?.totalRevenue ?? 0)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <StatisticCard
                value={summaryToday?.totalRevenue?.toFixed() ?? '0'}
                growShrink={Math.round(growthToday)}
                message={'So với ' + dayjs(start_of_yesterday).format('DD-MM-YYYY')}
                label="Doanh số hôm nay"
                date={startDate}
            />
            <StatisticCard
                value={summaryWeek?.totalRevenue?.toFixed() ?? '0'}
                growShrink={Math.round(growthWeek)}
                message={'So với tuần trước'}
                label="Doanh số tuần này"
                date={startDate}
            />
            <StatisticCard
                value={summaryMonth?.totalRevenue?.toFixed() ?? '0'}
                growShrink={Math.round(growthMonth)}
                message={'So với tháng trước'}
                label="Doanh số tháng này"
                date={startDate}
            />
        </div>
    )
}

export default Statistic
