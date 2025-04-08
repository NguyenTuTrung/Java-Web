import { IDistrict, IProvince, IWard } from '@/@types/address'
import { Button, Input, Select } from '@/components/ui'
import CloseButton from '@/components/ui/CloseButton'
import { fetchFindAllDistricts, fetchFindAllProvinces, fetchFindAllWards } from '@/services/AddressService'
import { SetStateAction, useEffect, useState } from 'react'
import instance from '@/axios/CustomAxios'
import { OrderResponseDTO } from '@/@types/order'
import { useToastContext } from '@/context/ToastContext'
import { useLoadingContext } from '@/context/LoadingContext'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

type AddressInfo = {
    recipientName: string;
    phone: string;
    provinceId: string;
    provinceName?: string;
    districtId: string;
    districtName?: string;
    wardId: string;
    wardName?: string;
    address?: string
};

const AddressModal = ({ selectedOrder, onCloseModal, fetchData }: {
    selectedOrder: OrderResponseDTO,
    onCloseModal: React.Dispatch<SetStateAction<boolean>>,
    fetchData?: () => Promise<void>
}) => {
    const [provinces, setProvinces] = useState<IProvince[]>([])
    const [districts, setDistricts] = useState<IDistrict[]>([])
    const [wards, setWards] = useState<IWard[]>([])
    const { openNotification } = useToastContext()
    const { sleep, setIsLoadingComponent } = useLoadingContext()

    const [selectedProvinceId, setSelectedProvinceId] = useState<string>(selectedOrder.provinceId || '')
    const [selectedDistrictId, setSelectedDistrictId] = useState<string>(selectedOrder.districtId ||'')
    const [selectedWardId, setSelectedWardId] = useState<string>(selectedOrder.wardId || '')

    const handleChangeProvince = (provinceId: string) => {
        setSelectedProvinceId(provinceId)
        setSelectedDistrictId('')
        setSelectedWardId('')
    }

    const handleChangeDistrict = (district: string) => {
        setSelectedDistrictId(district)
        setSelectedWardId('')
    }

    const validationSchema = Yup.object({
        recipientName: Yup.string().required('Vui lòng nhập tên người nhận'),
        phone: Yup.string().required('Vui lòng nhập số điện thoại'),
        provinceId: Yup.string().required('Vui lòng chọn tỉnh'),
        districtId: Yup.string().required('Vui lòng chọn thành phố'),
        wardId: Yup.string().required('Vui lòng chọn xã/phường')
    })

    useEffect(() => {
        handleFindAllProvinces()
    }, [])

    useEffect(() => {
        handleFindAllDistricts(selectedProvinceId)
    }, [selectedProvinceId])

    useEffect(() => {
        handleFindAllWards(selectedDistrictId)
    }, [selectedDistrictId])


    const handleFindAllProvinces = async () => {
        const modifiedProvinces: IProvince[] = await fetchFindAllProvinces()
        setProvinces(modifiedProvinces)
    }

    const handleFindAllDistricts = async (idProvince: string) => {
        const modifiedDistricts: IDistrict[] = await fetchFindAllDistricts(idProvince)
        setDistricts(modifiedDistricts)
    }

    const handleFindAllWards = async (idDistrict: string) => {
        const modifiedWards: IWard[] = await fetchFindAllWards(idDistrict)
        setWards(modifiedWards)
    }

    const handleSubmitForm = async (values: AddressInfo) => {
        console.log(values)
        setIsLoadingComponent(true)
        const data: AddressInfo = {
            provinceId: values.provinceId || '',
            provinceName: values.provinceName || '',
            districtId: values.districtId || '',
            districtName: values.districtName || '',
            wardId: values.wardId || '',
            wardName: values.wardName || '',
            address: values?.address || '',
            recipientName: values?.recipientName || '',
            phone: values?.phone || ''
        }
        await instance.put(`/orders/${selectedOrder.id}`, data).then(function(response) {
            console.log(response)
            if(response.status === 200){
                openNotification('Thay đổi địa chỉ thành công')
            }
        }).catch(function(err){
            console.log("Errorsss")
            console.log(err)
            if (err?.response?.status === 400) {
                openNotification(err.response.data.error, 'Thông báo', 'warning', 1500)
            }
        }).finally(function(){
            onCloseModal(false)
            if (fetchData) {
                fetchData()
            }
            setIsLoadingComponent(false)

        })
    }

    return (
        <div className="fixed top-0 left-0 bg-gray-300 bg-opacity-50 w-screen h-screen z-50">
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl w-3/5 xl:w-2/5 p-5 rounded-md z-51">
                <div className="flex justify-between py-3 text-[18px] font-semibold">
                    <div>
                        <label>Thay đổi địa chỉ</label>
                    </div>
                    <div>
                        <CloseButton onClick={() => onCloseModal(false)} />
                    </div>
                </div>

                <Formik
                    initialValues={{
                        recipientName: selectedOrder.recipientName,
                        phone: selectedOrder.phone,
                        provinceId: selectedOrder.provinceId,
                        districtId: selectedOrder.districtId,
                        wardId: selectedOrder.wardId,
                        address: selectedOrder.address
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmitForm}
                >
                    {({ setFieldValue }) => {
                        return (
                            <Form className="flex flex-col gap-3">
                                <div>
                                    <label className="font-semibold text-gray-600">Tên người nhận:</label>
                                    <Field
                                        name="recipientName"
                                        as={Input}
                                        placeholder="Vui lòng nhập tên người nhận"
                                        size="sm"
                                        onChange={(el: React.ChangeEvent<HTMLInputElement>) => {
                                            setFieldValue('recipientName', el.target.value)
                                        }}
                                    />
                                    <ErrorMessage name="recipientName" component="p"
                                                  className="text-red-500 text-[12.5px]" />
                                </div>

                                <div>
                                    <label className="font-semibold text-gray-600">Số điện thoại nhận:</label>
                                    <Field
                                        name="phone"
                                        as={Input}
                                        placeholder="Vui lòng nhập số điện thoại"
                                        size="sm"
                                        onChange={(el: React.ChangeEvent<HTMLInputElement>) => {
                                            setFieldValue('phone', el.target.value)
                                        }}
                                    />
                                    <ErrorMessage name="phone" component="p" className="text-red-500 text-[12.5px]" />
                                </div>

                                <div>
                                    <label className="font-semibold text-gray-600">Tỉnh:</label>
                                    <Select
                                        options={provinces}
                                        value={
                                            provinces.find((s) =>
                                                selectedProvinceId?.toString() === s.ProvinceID.toString()
                                            ) ?? null
                                        }
                                        placeholder="Vui lòng chọn tỉnh"
                                        onChange={(el) => {
                                            setFieldValue('provinceId', (el as IProvince).ProvinceID)
                                            setFieldValue('provinceName', (el as IProvince).ProvinceName)
                                            setFieldValue('districtId', '')
                                            setFieldValue('districtName', '')
                                            setFieldValue('wardId', '')
                                            setFieldValue('wardName', '')
                                            handleChangeProvince((el as IProvince).ProvinceID)
                                        }}
                                    />
                                    <ErrorMessage name="provinceId" component="p"
                                                  className="text-red-500 text-[12.5px]" />
                                </div>

                                <div>
                                    <label className="font-semibold text-gray-600">Thành phố:</label>
                                    <Select
                                        options={districts}
                                        value={
                                            districts.find((s) =>
                                                selectedDistrictId?.toString() === s.DistrictID.toString()
                                            ) ?? null
                                        }
                                        placeholder="Vui lòng chọn thành phố"
                                        onChange={(el) => {
                                            setFieldValue('districtId', (el as IDistrict).DistrictID)
                                            setFieldValue('districtName', (el as IDistrict).DistrictName)
                                            setFieldValue('wardId', '')
                                            setFieldValue('wardName', '')
                                            handleChangeDistrict((el as IDistrict).DistrictID)
                                        }}
                                    />
                                    <ErrorMessage name="districtId" component="p"
                                                  className="text-red-500 text-[12.5px]" />
                                </div>

                                <div>
                                    <label className="font-semibold text-gray-600">Xã:</label>
                                    <Select
                                        options={wards}
                                        value={
                                            wards.find((s) =>
                                                selectedWardId?.toString() === s.WardCode.toString()
                                            ) ?? null
                                        }
                                        placeholder="Vui lòng chọn xã/phường"
                                        onChange={(el) => {
                                            setFieldValue('wardId', (el as IWard).WardCode)
                                            setFieldValue('wardName', (el as IWard).WardName)
                                            setSelectedWardId((el as IWard).WardCode)
                                        }}
                                    />
                                    <ErrorMessage name="wardId" component="p" className="text-red-500 text-[12.5px]" />
                                </div>

                                <div>
                                    <label className="font-semibold text-gray-600">Địa chỉ:</label>
                                    <Field
                                        name="address"
                                        as={Input}
                                        placeholder="Vui lòng nhập địa chỉ"
                                        size="sm"
                                        onChange={(el: React.ChangeEvent<HTMLInputElement>) => {
                                            setFieldValue('address', el.target.value)
                                        }}
                                    />
                                </div>

                                <Button type="submit" className="mt-4" size="sm">
                                    Cập nhật
                                </Button>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    )
}

export default AddressModal
