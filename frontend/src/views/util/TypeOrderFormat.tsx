import { Fragment } from 'react'
import Button from '@/components/ui/Button'
import IconAndLabel from '@/views/util/IconAndLabel'
import { HiOutlineDesktopComputer, HiOutlineTruck } from 'react-icons/hi'

const TypeOrderFormat = ({ status }: { status: string }) => {
    return (
        <Fragment>
            <Button
                size="xs"
                variant="plain"
            >

                    <div
                        className={`flex items-center font-bold ${status === 'INSTORE' ? 'text-green-600' : 'text-blue-600'}`}>
                                {status === 'INSTORE'
                                    ? <IconAndLabel
                                        label={'Tại cửa hàng'}
                                        icon={<HiOutlineDesktopComputer size={20} />}
                                    />
                                    : status === 'ONLINE'
                                        ? <IconAndLabel
                                            label={'Giao hàng'}
                                            icon={<HiOutlineTruck size={20} />}
                                        />
                                        : 'Không xác định'}
                    </div>
            </Button>
        </Fragment>
    )
}
export default TypeOrderFormat