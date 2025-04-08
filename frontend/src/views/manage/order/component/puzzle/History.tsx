import Timeline from '@/components/ui/Timeline'
import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import type { AvatarProps } from '@/components/ui/Avatar'
import { OrderResponseDTO } from '@/@types/order'
import { formatDistanceToNow, parse } from 'date-fns'
import { vi } from 'date-fns/locale'
import StatusOrderFormat from '@/views/util/StatusOrderFormat'

type TimelineAvatarProps = AvatarProps

const TimelineAvatar = ({ children, ...rest }: TimelineAvatarProps) => {
    return (
        <Avatar {...rest} size={25} shape="circle">
            {children}
        </Avatar>
    )
}

const History = ({ selectObject }: { selectObject: OrderResponseDTO }) => {
    const calculateDistanceTime = (formattedDate: string) => {
        const date = parse(formattedDate, 'HH:mm dd-MM-yyyy', new Date())
        return formatDistanceToNow(date, { addSuffix: true, locale: vi })
    }
    return (
        <div className="max-w-[700px]">
            <Timeline>
                {
                    selectObject.historyResponseDTOS.map((item, index) => (
                        // eslint-disable-next-line react/jsx-key
                        <Timeline.Item
                            key={index}
                            media={
                                <TimelineAvatar
                                    src="/img/avatars/thumb-3.jpg"
                                    className="bg-amber-500"
                                />
                            }
                        >
                            <p className="my-1 flex items-center">
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                    {item?.account?.username || "Không xác định"}
                                </span>
                                <span className="mx-2">đã chuyển trạng thái  </span>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                    Đơn hàng
                                </span>
                                <span className="ml-3 rtl:mr-3">{calculateDistanceTime(item.createdDate)}</span>
                            </p>
                            <Card className="mt-4">
                                <div className={'flex gap-1 items-center'}>
                                    <p>
                                        Trạng thái:{' '}
                                    </p>
                                    <p>
                                        <StatusOrderFormat status={item.status} />
                                    </p>
                                </div>
                                <p>
                                    Ghi chú:{' ' + item.note}
                                </p>
                            </Card>
                        </Timeline.Item>
                    ))
                }

            </Timeline>
        </div>
    )
}

export default History

