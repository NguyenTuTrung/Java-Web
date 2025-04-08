import { Fragment } from 'react'
import Button from '@/components/ui/Button'
import IconAndLabel from '@/views/util/IconAndLabel'
import { HiOutlineGlobe, HiOutlinePresentationChartLine } from 'react-icons/hi'

const IsInStoreOrderFormat = ({ status }: { status: boolean }) => {
    return (
        <Fragment>
            <Button
                size="xs"
                variant="plain"
            >
                <div
                    className={`flex items-center font-bold ${status ? 'text-indigo-600' : 'text-yellow-600'}`}>
                    {status ? <IconAndLabel
                        className={'text-green-600'}
                        label={'Tại cửa hàng'}
                        icon={<HiOutlinePresentationChartLine size={20} />}
                    /> : <IconAndLabel
                        className={'text-blue-600'}
                        label={'Trực tuyến'}
                        icon={<HiOutlineGlobe size={20} />}
                    />}
                </div>
            </Button>
        </Fragment>
    )
}
export default IsInStoreOrderFormat