import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { HiPlusCircle } from 'react-icons/hi';
import { FaFileDownload } from 'react-icons/fa';

interface VoucherTableToolProps {
    exportToExcel: () => void;
}

const VoucherTableTool: React.FC<VoucherTableToolProps> = ({ exportToExcel }) => {


    return (
        <div className="flex flex-col lg:flex-row lg:items-center">
            <Button className='mr-2' block onClick={exportToExcel} size="sm" icon={<FaFileDownload />}>
                Xuất Excel
            </Button>
            <Link
                className="block lg:inline-block md:mb-0 mb-4"
                to="/admin/manage/voucher/voucher-new"
            >
                <Button block variant="solid" size="sm" color='blue' icon={<HiPlusCircle />}>
                    Thêm Mới
                </Button>
            </Link>
        </div>
    );
}

export default VoucherTableTool;
