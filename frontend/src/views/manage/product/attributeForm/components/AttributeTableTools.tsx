import Button from '@/components/ui/Button'
import { HiPlusCircle } from 'react-icons/hi'
import { FaFileDownload } from "react-icons/fa";
import AttributeTableSearch from './AttributeTableSearch'
import { Link } from 'react-router-dom'
import {
    useAppDispatch,
    toggleAddAttributeConfirmation,
} from '../store';
import AttributeAddConfirmation from './AttributeAddConfirmation'
import { toast } from 'react-toastify';
type AttributeTableToolsProps = {
    apiFunc: any;
    apiAdd:any;
    lablel: string;
}; 
import {
    exportToExcel,
    useAppSelector,
} from '../store'

const AttributeTableTools = ({ apiFunc, lablel, apiAdd }: AttributeTableToolsProps) => {
    const dispatch = useAppDispatch();
    const selectedProduct = useAppSelector(
        (state) => state.salesAttributeList.data.AttributeList
    );
    const handleExport = () => {
        exportToExcel(selectedProduct, lablel);
        toast.success('Xuất thành công file sản phẩm.');
    };
    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-grow mb-4 lg:mb-0">
                <AttributeTableSearch apiFunc={apiFunc} />
            </div>
            <div className="flex-shrink-0">
                <div
                    className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                >
                    <Button block size="sm" onClick={handleExport} icon={<FaFileDownload />}>
                        Xuất Excel
                    </Button>

                </div>

              
                <div
                  className="block lg:inline-block  md:mb-0 mb-4"
                >
                    <Button
                        size='sm'
                        variant="solid"
                        style={{ backgroundColor: 'rgb(79, 70, 229)', height: '40px' }}
                        className='flex items-center justify-center gap-2 button-bg-important'
                        icon={<HiPlusCircle />}
                        onClick={e => dispatch(toggleAddAttributeConfirmation(true))}
                    >
                        Thêm {lablel}
                    </Button>

                </div>
            </div>
            <AttributeAddConfirmation apiAdd={apiAdd} apiFunc={apiFunc} label={lablel}/>
        </div>
    )
}

export default AttributeTableTools
