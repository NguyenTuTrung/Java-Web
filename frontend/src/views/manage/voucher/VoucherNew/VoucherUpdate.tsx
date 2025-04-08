
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Radio } from '@/components/ui';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { InitialData } from '../VoucherForm/VoucherForm';
import instance from '@/axios/CustomAxios';
import CustomerTable from '../components/CustomerTable';
import { addDays, format, parseISO } from 'date-fns'

type ICustomer = {
    id: number;
    name: string;
    email: string;
    phone: string;
};

const VoucherUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState<InitialData | null>(null);
    const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([]);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<InitialData>();

    const typeTicket = watch('typeTicket');

    useEffect(() => {
        const fetchVoucherData = async () => {
            try {
                const response = await instance.get(`/voucher/${id}`);
                const { countOrders } = response.data;
                toast.success(`Số lượt sử dụng: ${countOrders ?? 0}`);


                const voucherData = response.data;

                // Set initial form values and directly pass Date objects to DatePicker
                setInitialData(voucherData);
                setValue('name', voucherData.name);
                setValue('code', voucherData.code);
                setValue('typeTicket', voucherData.typeTicket);
                setValue('quantity', voucherData.quantity);
                setValue('maxPercent', voucherData.maxPercent);
                setValue('minAmount', voucherData.minAmount);

                setValue('startDate', format(voucherData.startDate, 'yyyy-MM-dd\'T\'HH:mm'));
                setValue('endDate', format(voucherData.endDate, 'yyyy-MM-dd\'T\'HH:mm'));

                setSelectedCustomerIds(voucherData.customers || []);
            } catch (error) {
                toast.error('Không thể tải thông tin voucher');
                navigate('/admin/manage/voucher');
            }
        };

        if (id) {
            fetchVoucherData();
        }
    }, [id, setValue, navigate]);

    const onSubmit = async (data: InitialData) => {
        setLoading(true);
        try {
            const startDateISO = parseISO(data.startDate);
            const endDateISO = parseISO(data.endDate);

            const response = await instance.put(`/voucher/update/${id}`,
                {
                    ...data, startDate: format(startDateISO, 'yyyy-MM-dd\'T\'HH:mm'),
                    endDate: format(endDateISO, 'yyyy-MM-dd\'T\'HH:mm'), customers: selectedCustomerIds
                });
            if (response.status === 200) {
                toast.success('Cập nhật voucher thành công');
                navigate('/admin/manage/voucher');
            }
        } catch (error) {
            toast.error('Cập nhật voucher thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectedCustomersChange = useCallback((selectedCustomers: ICustomer[]) => {
        const customerIds = selectedCustomers.map((customer: ICustomer) => customer.id);
        setSelectedCustomerIds(customerIds);
    }, []);

    if (!initialData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Cập Nhật Phiếu Giảm Giá</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div>
                            <label className="block mb-2">Tên phiếu</label>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: 'Vui lòng nhập tên phiếu' }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Nhập tên phiếu"
                                        error={errors.name?.message}
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <label className="block mb-2">Mã phiếu</label>
                            <Controller
                                name="code"
                                control={control}
                                rules={{ required: 'Vui lòng nhập mã phiếu' }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Nhập mã phiếu"
                                        error={errors.code?.message}
                                    />
                                )}
                            />
                        </div>


                        <div>
                            <label className="block mb-2">Số lượng</label>
                            <Controller
                                name="quantity"
                                control={control}
                                rules={{
                                    required: 'Vui lòng nhập số lượng',
                                    min: { value: 1, message: 'Số lượng phải lớn hơn 0' }
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder="Nhập số lượng"
                                        error={errors.quantity?.message}
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <label className="block mb-2">Phần trăm giảm tối đa</label>
                            <Controller
                                name="maxPercent"
                                control={control}
                                rules={{
                                    required: 'Vui lòng nhập phần trăm giảm',
                                    min: { value: 1, message: 'Phần trăm ít nhất là 1' },
                                    max: { value: 100, message: 'Phần trăm không được vượt quá 100' }
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder="Nhập phần trăm giảm"
                                        error={errors.maxPercent?.message}
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <label className="block mb-2">Số tiền tối thiểu</label>
                            <Controller
                                name="minAmount"
                                control={control}
                                rules={{
                                    required: 'Vui lòng nhập số tiền tối thiểu',
                                    min: { value: 0, message: 'Số tiền không được âm' }
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder="Nhập số tiền tối thiểu"
                                        error={errors.minAmount?.message}
                                    />
                                )}
                            />
                        </div>

                        <div className={'flex'}>
                            <div className="flex-1">
                                <label className="block mb-2">Ngày bắt đầu</label>
                                <Controller
                                    name="startDate"
                                    control={control}
                                    rules={{ required: 'Vui lòng chọn ngày bắt đầu' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="datetime-local"
                                            value={field.value ? new Date(field.value).toLocaleString('sv-SE').slice(0, 16) : ''} // 'sv-SE' sẽ tạo định dạng 'YYYY-MM-DDTHH:mm'
                                            onChange={(e) => field.onChange(e.target.value)}
                                            placeholder="Chọn ngày bắt đầu"
                                            error={errors.startDate?.message}
                                        />
                                    )}
                                />
                            </div>


                            <div className="flex-1">
                                <label className="block mb-2">Ngày kết thúc</label>
                                <Controller
                                    name="endDate"
                                    control={control}
                                    rules={{ required: 'Vui lòng chọn ngày kết thúc' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="datetime-local"
                                            value={field.value ? new Date(field.value).toLocaleString('sv-SE').slice(0, 16) : ''} // Đảm bảo định dạng 'YYYY-MM-DDTHH:mm'
                                            onChange={(e) => field.onChange(e.target.value)}
                                            placeholder="Chọn ngày kết thúc"
                                            error={errors.endDate?.message}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2">Loại phiếu giảm giá</label>
                            <Controller
                                name="typeTicket"
                                control={control}
                                rules={{ required: 'Vui lòng chọn loại phiếu' }}
                                render={({ field }) => (
                                    <Radio.Group
                                        value={field.value}
                                        onChange={field.onChange}
                                    >
                                        <Radio value="Individual">Cá nhân</Radio>
                                        <Radio value="Everybody">Tất cả</Radio>
                                    </Radio.Group>
                                )}
                            />
                        </div>
                    </div>

                    {/* Right side - Customer Table */}
                    {typeTicket === 'Individual' && (
                        <div className="space-y-6 border border-gray-300 rounded-lg p-4">
                            <label className="block mb-2">Chọn khách hàng</label>
                            <CustomerTable
                                onSelectedCustomersChange={handleSelectedCustomersChange}
                                selectedCustomerIds={selectedCustomerIds}
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="plain"
                        onClick={() => navigate('/admin/manage/voucher')}
                    >
                        Hủy
                    </Button>
                    <Button
                        loading={loading}
                        variant="solid"
                        type="submit"
                    >
                        Cập nhật
                    </Button>
                </div>
            </form>

        </div>
    );
};

export default VoucherUpdate;
