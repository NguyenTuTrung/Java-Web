import { IDistrict, IProvince, IWard } from '@/@types/address'
import { fetchFindAllDistricts, fetchFindAllProvinces, fetchFindAllWards } from '@/services/AddressService'
import * as yup from 'yup'
import CloseButton from '@/components/ui/CloseButton'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { SetStateAction, useEffect, useState } from 'react'
import instance from '@/axios/CustomAxios'
import { useToastContext } from '@/context/ToastContext'
import { Button, Input, Select } from '@/components/ui'
import { OrderResponseDTO } from '@/@types/order'
import { HiOutlineLightBulb } from 'react-icons/hi'


interface IProps {
    setIsOpenCreateCustomerModal: React.Dispatch<SetStateAction<boolean>>
    selectedOrder: OrderResponseDTO,
    fetchSelectedOrder: () => Promise<void>
}

const CreateNewCustomerModal: React.FC<IProps> = ({setIsOpenCreateCustomerModal, selectedOrder, fetchSelectedOrder }) => {
    const [listProvince, setListProvince] = useState<IProvince[]>([])
    const [listDistrict, setListDistrict] = useState<IDistrict[]>([])
    const [listWard, setListWard] = useState<IWard[]>([])
    const [selectedProvinceID, setSelectedProvinceID] = useState<string>('')
    const [selectedDistrictID, setSelectedDistrictID] = useState<string>('')
    const [selectedWardID, setSelectedWardID] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const handleChangeProvince = (provinceId: string) => {
        setSelectedProvinceID(provinceId)
        setSelectedDistrictID('')
        setSelectedWardID('')
    }

    const handleChangeDistrict = (district: string) => {
        setSelectedDistrictID(district)
        setSelectedWardID('')
    }
    const handleFindAllProvinces = async () => {
        const modifiedProvinces: IProvince[] = await fetchFindAllProvinces()
        setListProvince(modifiedProvinces)
    }

    const handleFindAllDistricts = async (idProvince: string) => {
        const modifiedDistricts: IDistrict[] = await fetchFindAllDistricts(idProvince)
        setListDistrict(modifiedDistricts)
    }

    const handleFindAllWards = async (idDistrict: string) => {
        const modifiedWards: IWard[] = await fetchFindAllWards(idDistrict)
        setListWard(modifiedWards)
    }
    useEffect(() => {
        handleFindAllDistricts(selectedProvinceID)
    }, [selectedProvinceID])

    useEffect(() => {
        handleFindAllWards(selectedDistrictID)
    }, [selectedDistrictID])


    useEffect(() => {
        handleFindAllProvinces()
    }, [])

    enum Gender {
        Male = 'Nam',
        Female = 'Nữ',
    }

    enum Status {
        Active = 'Active',
        Inactive = 'Inactive',
    }

    type AddressDTO = {
        provinceId?: number;
        districtId: string;
        wardId: string;
        province: string;
        district: string;
        ward: string;
        detail: string;
        isDefault: boolean;
    };

    type UserProfile = {
        name: string;
        email: string;
        phone: string;
        birthDate: string;
        gender: Gender;
        addressDTOS: AddressDTO[];
        status: Status;
    };

    const addressDTOSchema = yup.object().shape({
        provinceId: yup.number().min(1, 'Vui lòng chọn tỉnh').required('Vui lòng chọn tỉnh'),
        districtId: yup.string().required('Vui lòng chọn thành phố'),
        wardId: yup.string().required('Vui lòng chọn xã/phường'),
        province: yup.string().required('Tỉnh không được để trống'),
        district: yup.string().required('Thành phố không được để trống'),
        ward: yup.string().required('Xã/Phường không được để trống'),
        detail: yup.string().required('Địa chỉ chi tiết không được để trống'),
        isDefault: yup.boolean().required('Trạng thái mặc định không được để trống')
    });

    const formSchema = yup.object().shape({
        name: yup.string().required('Tên không được để trống'),
        email: yup.string().email('Email không đúng định dạng').required('Email không được để trống'),
        phone: yup.string().required("Số điện thoại là bắt buộc")
            .matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"),
        addressDTOS: yup.array().of(addressDTOSchema).required('Địa chỉ không được để trống'),
        status: yup.string()
            .oneOf(['Active', 'Inactive'], 'Trạng thái phải là "Active" hoặc "Inactive"')
            .required('Trạng thái không được để trống')
    });


    const initialValues: UserProfile = {
        name: '',
        email: '',
        phone: '',
        birthDate: '',
        gender: Gender.Female,
        addressDTOS: [
            {
                provinceId: 0,
                districtId: '',
                wardId: '',
                province: '',
                district: '',
                ward: '',
                detail: '',
                isDefault: true
            }
        ],
        status: Status.Active
    }

    const { openNotification } = useToastContext()

    const handleSubmit = async (values: UserProfile) => {
        console.log('Submitted values:', values)
        setIsSubmitting(true)
        await instance.post('customer/save', values).then(function(response) {
            if (response.status === 201) {
                fetchSelectedOrder();
                console.log("------------")
                console.log("ORDER ID: ", selectedOrder?.id)
                console.log("CUSTOMER ID: ", response?.data?.id)

                const editOrderCustomerData = {
                    "id": selectedOrder.id,
                    "customer": {
                        "id": response?.data?.id
                    }
                }
                console.log("PUT data:", editOrderCustomerData);
                console.log("------------")
                instance.put(`orders/edit-customer/${selectedOrder.id}`, editOrderCustomerData).then(function(res){
                    if(res.status === 200){
                        openNotification("Tự động cập nhật khách hàng thành công")
                        fetchSelectedOrder();
                    }
                })

                setIsOpenCreateCustomerModal(false)
            }
        }).catch(function(error) {
            if (error?.response?.data?.error) {
                openNotification(error?.response?.data?.error, 'Thông báo', 'warning', 5000)
            }
        }).finally(function() {
                setIsSubmitting(false)
            }
        )
    }

    return (
        <div className={'fixed top-1/2 left-1/2 w-2/5 -translate-x-1/2 -translate-y-1/2 bg-white shadow p-6 z-20'}>
            <div className={'flex justify-between py-5'}>
                <div>
                    <h4>
                        Tạo mới khách hàng
                    </h4>
                </div>
                <div>
                    <CloseButton
                        className={'text-xl'}
                        onClick={() => setIsOpenCreateCustomerModal(false)}
                    />
                </div>
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={formSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, values }) => (
                    <Form className={'flex-col flex gap-2'}>
                        <div>
                            <label className="font-semibold text-gray-600">Tên khách hàng:</label>
                            <Field
                                name="name"
                                as={Input}
                                placeholder="Vui lòng nhập tên khách hàng"
                                size="sm"
                                onChange={async (el: React.ChangeEvent<HTMLInputElement>) => {
                                    await setFieldValue('name', el.target.value)
                                }}
                            />
                            <ErrorMessage name="name" component="p"
                                          className="text-red-500 text-[12.5px]" />
                        </div>

                        <div>
                            <label className="font-semibold text-gray-600">Email:</label>
                            <Field
                                name="email"
                                as={Input}
                                placeholder="Vui lòng nhập email"
                                size="sm"
                                onChange={async (el: React.ChangeEvent<HTMLInputElement>) => {
                                    await setFieldValue('email', el.target.value)
                                }}
                            />
                            <ErrorMessage name="email" component="p"
                                          className="text-red-500 text-[12.5px]" />
                        </div>

                        <div>
                            <label className="font-semibold text-gray-600">Số điện thoại:</label>
                            <Field
                                name="phone"
                                as={Input}
                                placeholder="Vui lòng nhập phone"
                                size="sm"
                                onChange={async (el: React.ChangeEvent<HTMLInputElement>) => {
                                    await setFieldValue('phone', el.target.value)
                                }}
                            />
                            <ErrorMessage name="phone" component="p"
                                          className="text-red-500 text-[12.5px]" />
                        </div>

                        <div>
                            <label className="font-semibold text-gray-600">Tỉnh:</label>
                            <Select
                                options={listProvince}
                                value={
                                    listProvince.find((s) =>
                                        selectedProvinceID?.toString() === s.ProvinceID.toString()
                                    ) ?? null
                                }
                                placeholder="Vui lòng chọn tỉnh"
                                onChange={async (el) => {
                                    await setFieldValue('addressDTOS[0].provinceId', (el as IProvince).ProvinceID)
                                    await setFieldValue('addressDTOS[0].province', (el as IProvince).ProvinceName)
                                    await setFieldValue('addressDTOS[0].districtId', '')
                                    await setFieldValue('addressDTOS[0].district', '')
                                    await setFieldValue('addressDTOS[0].wardId', '')
                                    await setFieldValue('addressDTOS[0].ward', '')
                                    handleChangeProvince((el as IProvince).ProvinceID)
                                }}
                            />
                            <ErrorMessage name="addressDTOS[0].provinceId" component="p"
                                          className="text-red-500 text-[12.5px]" />
                        </div>

                        <div>
                            <label className="font-semibold text-gray-600">Tỉnh:</label>
                            <Select
                                options={listDistrict}
                                value={
                                    listDistrict.find((s) =>
                                        selectedDistrictID?.toString() === s.DistrictID.toString()
                                    ) ?? null
                                }
                                placeholder="Vui lòng chọn thành phố"
                                onChange={async (el) => {
                                    await setFieldValue('addressDTOS[0].districtId', (el as IDistrict).DistrictID)
                                    await setFieldValue('addressDTOS[0].district', (el as IDistrict).DistrictName)
                                    await setFieldValue('addressDTOS[0].wardId', '')
                                    await setFieldValue('addressDTOS[0].ward', '')
                                    handleChangeDistrict((el as IDistrict).DistrictID)
                                }}
                            />
                            <ErrorMessage name="addressDTOS[0].districtId" component="p"
                                          className="text-red-500 text-[12.5px]" />
                        </div>

                        <div>
                            <label className="font-semibold text-gray-600">Xã:</label>
                            <Select
                                options={listWard}
                                value={
                                    listWard.find((s) =>
                                        selectedWardID?.toString() === s.WardCode.toString()
                                    ) ?? null
                                }
                                placeholder="Vui lòng chọn xã/phường"
                                onChange={async (el) => {
                                    await setFieldValue('addressDTOS[0].wardId', (el as IWard).WardCode)
                                    await setFieldValue('addressDTOS[0].ward', (el as IWard).WardName)
                                    setSelectedWardID((el as IWard).WardCode)
                                }}
                            />
                            <ErrorMessage name="addressDTOS[0].wardId" component="p"
                                          className="text-red-500 text-[12.5px]" />
                        </div>

                        <div>
                            <label className="font-semibold text-gray-600">Địa chỉ:</label>
                            <Field
                                name="addressDTOS[0].detail"
                                as={Input}
                                placeholder="Vui lòng nhập địa chỉ chi tiết"
                                size="sm"
                                onChange={async (el: React.ChangeEvent<HTMLInputElement>) => {
                                    await setFieldValue('addressDTOS[0].detail', el.target.value)
                                    console.log(values)
                                }}
                            />
                            <ErrorMessage name="addressDTOS[0].detail" component="p"
                                          className="text-red-500 text-[12.5px]" />
                        </div>
                        <div className={'flex gap-2 py-1'}>
                            <HiOutlineLightBulb size={20} />
                            <p className={'text-yellow-700'}>
                                Khách hàng tự động đuọc gán vào đơn hàng & Địa chỉ tự động được gán mặc định</p>
                        </div>


                        <Button
                            block
                            loading={isSubmitting}
                            variant="solid"
                            type="submit"
                        >
                            {isSubmitting
                                ? 'Đang tạo mới...'
                                : 'Xác nhận tạo mới'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}
export default CreateNewCustomerModal;