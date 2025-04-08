import { Fragment } from 'react'
import Button from '@/components/ui/Button'

const StatusOrderFormat = ({ status }: { status: string }) => {
    return (
        <Fragment>
            <Button
                size="xs"
                variant="plain"
                className={`bg-white bg-opacity-0 ${status === 'PENDING'
                    ? '!text-yellow-500'
                    : status === 'TOSHIP'
                        ? '!text-blue-500'
                        : status === 'TORECEIVE'
                            ? '!text-green-500'
                            : status === 'DELIVERED'
                                ? '!text-purple-500'
                                : status === 'CANCELED'
                                    ? '!text-red-500'
                                    : status === 'REQUESTED'
                                        ? '!text-red-500'
                                    : '!text-gray-500'
                }`}
            >
                    <span className={`flex items-center font-bold`}>
                        <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${status === 'PENDING'
                                ? '!bg-yellow-500'
                                : status === 'TOSHIP'
                                    ? '!bg-blue-500'
                                    : status === 'TORECEIVE'
                                        ? '!bg-green-500'
                                        : status === 'DELIVERED'
                                            ? '!bg-purple-500'
                                            : status === 'CANCELED'
                                                ? '!bg-red-500'
                                                : status === 'REQUESTED'
                                                    ? '!bg-red-500'
                                                : '!bg-gray-500'
                            }`}></span>
                        <span>
                            <p>
                                {status === 'PENDING'
                                    ? 'Chờ xác nhân'
                                    : status === 'TOSHIP'
                                        ? 'Chờ vận chuyển'
                                        : status === 'TORECEIVE'
                                            ? 'Đang vận chuyển'
                                            : status === 'DELIVERED'
                                                ? 'Đã hoàn thành'
                                                : status === 'CANCELED'
                                                    ? 'Đã hủy đơn'
                                                    : status === 'REQUESTED'
                                                        ? 'Yêu cầu hủy và hoàn trả'
                                                    : 'Không xác định'}
                            </p>
                        </span>
                    </span>
            </Button>
        </Fragment>
    )
}
export default StatusOrderFormat