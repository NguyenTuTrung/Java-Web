import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Chart from '@/components/shared/Chart'
import { COLORS } from '@/constants/chart.constant'
import {
    getSaleByCategories, OrderCounts,
    useAppDispatch,
    useAppSelector
} from '../store'
import { useEffect } from 'react'

type SalesByCategoriesProps = {
    labels: string[]
    data: number[]
}


// const chartOptions = {
//     series: [{
//         name: 'Data',
//         data: [1, 2, 3, 4],
//     }],
//     chart: {
//         type: 'line',
//     },
// };

const SalesByCategories = () => {
    const dispatch = useAppDispatch();
    const result = useAppSelector((state) => state.statistic.saleByCategoriesData);

    useEffect(() => {
        console.log(result)
        console.log(resultData)
    }, [])
    // Kiểm tra nếu `result` không phải là null hoặc undefined
    const resultData: SalesByCategoriesProps = {
        data: result
            ? [
                result.countPending || 0,
                result.countToShip || 0,
                result.countToReceive || 0,
                result.countDelivered || 0,
                result.countCancelled || 0,
            ]
            : [], // Nếu result không có dữ liệu, trả về mảng rỗng
        labels: [
            'Chờ xác nhận',
            'Chờ thanh toán',
            'Chờ vận chuyển',
            'Đã hoàn thành',
            'Đã hủy hàng',
        ],
    };

    useEffect(() => {
        // Chỉ dispatch khi cần thiết (kiểm tra nếu result chưa có dữ liệu)
        if (!result) {
            dispatch(getSaleByCategories());
        }
    }, [dispatch, result]); // Thêm `result` vào dependencies

    return (
        <Card>
            <h4>Danh mục</h4>
            <div className="mt-6">
                {/* Kiểm tra điều kiện để render chart */}
                {Array.isArray(resultData.data) && resultData.data.length > 0 && (
                    <div className="grid grid-cols-2">
                        <div>
                            <Chart
                                donutTitle={`${resultData.data.reduce(
                                    (a, b) => a + b,
                                    0
                                )}`}
                                donutText="Đơn hàng"
                                series={resultData.data}
                                customOptions={{ labels: resultData.labels }}
                                type="donut"
                            />
                        </div>
                        {resultData.data.length === resultData.labels.length && (
                            <div className="mt-6 grid grid-cols-1 gap-4 w-4/5 mx-auto">
                                {resultData.labels.map((value, index) => (
                                    <div key={value} className="flex items-center gap-1">
                                        <Badge
                                            badgeStyle={{
                                                backgroundColor: COLORS[index],
                                            }}
                                        />
                                        <span className="font-semibold">{value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default SalesByCategories;


