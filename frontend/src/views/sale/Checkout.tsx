import React, { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { Badge, Button, Card, Input, Radio, Select } from '@/components/ui'
import { AddressResponse, IAddress, IDistrict, IProvince, IWard } from '@/@types/address'
import { fetchFindAllDistricts, fetchFindAllProvinces, fetchFindAllWards } from '@/services/AddressService'
import { EPaymentMethod } from '@/views/manage/sell'
import { Link, useNavigate, useParams } from 'react-router-dom'
import instance from '@/axios/CustomAxios'
import { useToastContext } from '@/context/ToastContext'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useSaleContext } from '@/views/sale/SaleContext'
import VoucherModal from './VoucherModal'
import { useWSContext } from '@/context/WsContext'
import debounce from 'lodash/debounce'
import Logo from '@/components/template/Logo'
import { useAuthContext } from '@/views/client/auth/AuthContext'
import CloseButton from '@/components/ui/CloseButton'
import ConfirmModal from './ConfirmModal'

export interface Image {
    id: number;
    createdDate: string;
    updatedDate: string;
    code: string;
    url: string;
    deleted: boolean;
}

export interface Attribute {
    id: number;
    code: string;
    name: string;
    deleted: boolean;
    createdDate: string;
    modifiedDate?: string | null;
}

export interface Product {
    id: number;
    code: string;
    name: string;
    deleted: boolean;
    createdDate: string;
    updatedDate: string;
    eventDTOList: EventDTO[];
}

type EventDTO = {
    id: number;
    discountCode: string;
    name: string;
    discountPercent: number;
    startDate: string; // ISO 8601 format or can use Date type
    endDate: string; // ISO 8601 format or can use Date type
    quantityDiscount: number;
    status: string;
    productDTOS: any[] | null; // Replace `any` with the actual type if available
};

export interface ProductDetailResponseDTO {
    id: number;
    code: string;
    name: string;
    price: number;
    quantity: number;
    deleted: boolean;
    size: Attribute;
    color: Attribute;
    product: Product;
    texture: Attribute;
    origin: Attribute;
    brand: Attribute;
    collar: Attribute;
    sleeve: Attribute;
    style: Attribute;
    material: Attribute;
    thickness: Attribute;
    elasticity: Attribute;
    images: Image[];
    createdDate: string;
    modifiedDate?: string | null;
}

export interface CartDetailResponseDTO {
    id: number;
    code?: string | null;
    address?: string | null;
    phone?: string | null;
    recipientName?: string | null;
    email?: string | null;
    provinceId?: number | null;
    provinceName?: string | null;
    districtId?: number | null;
    districtName?: string | null;
    wardId?: number | null;
    wardName?: string | null;
    deleted?: boolean | null;
    total?: number | null;
    deliveryFee?: number | null;
    discount?: number | null;
    subTotal?: number | null;
    quantity: number;
    productDetailResponseDTO: ProductDetailResponseDTO;
}

export interface VoucherResponseDTO {
    id: number;
    name: string;
    code: string;
    startDate: string;
    endDate: string;
    status: string;
    quantity: number;
    maxPercent: number;
    minAmount: number;
    typeTicket: string;
    customerId?: number | null;
    customerName?: string | null;
    customerEmail?: string | null;
}

export interface CartResponseDTO {
    id: number;
    name: string;
    code: string;
    address?: string | null;
    email?: string | null;
    phone?: string | null;
    recipientName?: string | null;
    provinceId?: number | null;
    provinceName?: string | null;
    districtId?: number | null;
    districtName?: string | null;
    wardId?: number | null;
    wardName?: string | null;
    deleted: boolean;
    status: string;
    type?: string | null;
    payment?: string | null;
    total: number;
    deliveryFee: number;
    discount: number;
    subTotal: number;
    customerResponseDTO?: any;
    voucherResponseDTO?: VoucherResponseDTO | null;
    cartDetailResponseDTOS: CartDetailResponseDTO[];
}

type VoucherFormValues = {
    voucherCode: string;
};

type RecipientDTO = {
    recipientName: string,
    email: string,
    phone: string,
    address: string,
    provinceId: string,
    districtId: string,
    wardId: string,
}

interface Voucher {
    id: number;
    name: string;
    code: string;
    startDate: string;
    endDate: string;
    status: string;
    quantity: number;
    maxPercent: number;
    minAmount: number;
    typeTicket: string;
}


const Checkout = () => {
    const [IAddress, setIAddress] = useState<IAddress>({})
    const [provinces, setProvinces] = useState<IProvince[]>([])
    const [districts, setDistricts] = useState<IDistrict[]>([])
    const [wards, setWards] = useState<IWard[]>([])
    const [listCartDetailResponseDTO, setListCartDetailResponseDTO] = useState<CartDetailResponseDTO[]>([])
    const { id } = useParams()
    const [selectedCart, setSelectedCart] = useState<CartResponseDTO>()
    const [paymentMethod, setPaymentMethod] = useState<EPaymentMethod>((selectedCart?.payment as EPaymentMethod))
    const navigate = useNavigate()
    const { openNotification } = useToastContext()
    const { setIsOpenCartDrawer } = useSaleContext()
    const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false)
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)
    const [amount, setAmount] = useState<number>(100000)
    const [isOpenSelectAddressModal, setIsOpenSelectAddressModal] = useState<boolean>(false)
    const { callHaveNewOrder } = useWSContext()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleConfirmOrder = async () => {
        setIsModalOpen(true)
    }


    const toggleVoucherModal = () => {
        setIsVoucherModalOpen(!isVoucherModalOpen)
    }


    const handleVoucherSelect = (voucher: Voucher) => {
        setSelectedVoucher(voucher)
        setValue('voucherCode', voucher.code)
        toggleVoucherModal()
        console.log('Phiếu giảm giá đã chọn:', voucher)
    }

    const checkValidCart = async () => {
        instance.get(`cart/check-cart-active/${id}`).then(function(response) {
            if ((response.data as CartResponseDTO).deleted) {
                localStorage.removeItem('myCartId')
                console.log('Xóa cart id ở check-cart-activ')

                window.location.reload()
            }
        }).catch(function(error) {
            console.log(error.response.data.error === 'Order not found')
            if (error.response.status === 400) {
                localStorage.removeItem('myCartId')
                console.log('Xóa cart id ở check Order')
                window.location.href = '/'
            }
        })

    }


    // SCHEMA
    const schemaRecipientName: yup.ObjectSchema<RecipientDTO> = yup.object({
        recipientName: yup.string().default('').required('Tên người nhận không được để trống'),
        email: yup.string().default('').required('Email người nhận không được để trống'),
        phone: yup.string().default('').required('Số điện thoại không được để trống'),
        address: yup.string().default('').required('Địa chỉ không được để trống'),
        provinceId: yup.string().default('').required('Tỉnh/ thành không được để trống'),
        districtId: yup.string().default('').required('Quận/huyện không được để trống'),
        wardId: yup.string().default('').required('Xã/ phường không được để trống')
    })

    // YUP
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<VoucherFormValues>({ mode: 'onChange' })

    const {
        register: registerFormRecipient,
        handleSubmit: handleSubmitFormRecipient,
        getValues: getValuesFormRecipient,
        formState: { errors: errorsFormRecipient, isValid: isValidFormRecipient },
        watch,
        setValue: setValuesFormRecipient
    } = useForm<RecipientDTO>({
        resolver: yupResolver(schemaRecipientName),
        mode: 'onChange'
    })

    const formValues = watch()


    // COMMON
    const getFinalPrice = (item: ProductDetailResponseDTO) => {
        const price = item.price
        const discountPercent = item.product.eventDTOList.length > 0
            ? item.product.eventDTOList[0].discountPercent
            : 0

        return Math.round(price * (1 - discountPercent / 100))
    }

    const hasSale = (item: ProductDetailResponseDTO) => {
        return item.product.eventDTOList.length > 0
    }


    useEffect(() => {
        if (isValidFormRecipient && (
            selectedCart?.address !== getValuesFormRecipient('address')
        )) {
            const data = {
                recipientName: getValuesFormRecipient('recipientName'),
                email: getValuesFormRecipient('email'),
                phone: getValuesFormRecipient('phone'),
                address: getValuesFormRecipient('address'),
                provinceId: getValuesFormRecipient('provinceId'),
                districtId: getValuesFormRecipient('districtId'),
                wardId: getValuesFormRecipient('wardId'),
                provinceName: IAddress.iprovince?.ProvinceName,
                districtName: IAddress.idistrict?.DistrictName,
                wardName: IAddress.iward?.WardName
            }
            console.log(data.email)
            handleUpdateCart(data)
        }
    }, [formValues])

    const customHandleSubmit = async (data: VoucherFormValues) => {
        event?.preventDefault()
        // Giả sử bạn có logic kiểm tra mã giảm giá với API hoặc điều kiện khác

        // Giả lập một API call (có thể thay bằng gọi API thực tế)

        const payload = {
            'idCartId': id,
            'voucherCode': data.voucherCode
        }
        instance.post(`cart/use-voucher`, payload).then(function(response) {
            if (response.status === 200 && response.data) {
                setSelectedCart(response.data)

                openNotification('Sử dụng thành công')
            }
        }).catch(function(error) {
            console.log(error)
            openNotification(error.response.data.error, 'Thông báo', 'warning', 5000)
        })
    }

    // DUNG CLOSE CO MAY CAI LAM DO TAT DI QUEN K BIET CAI NAO

    const handleConfirmCart = async () => {
        // check valid convert
        let allowConvert = true
        await instance.get(`/cart/allow-convert/${id}`)
            .then(function(response) {
                if (response.status === 200) {
                    console.log('OKOK ALLOW CONVERT')
                }
            })
            .catch(function(error) {
                console.log('ERRORR', error)
                if (error?.response?.data?.error) {
                    openNotification(error?.response?.data?.error, 'Thông báo', 'warning', 5000)
                }
                allowConvert = false
            })
            .finally(() => {
                console.log('allow convert: ', allowConvert)
            })

        //
        setIsModalOpen(false)
        if (allowConvert) {
            if (paymentMethod === 'CASH') {
                try {
                    const data = {
                        status: 'PENDING',
                        payment: paymentMethod,
                        recipientName: getValuesFormRecipient('recipientName'),
                        email: getValuesFormRecipient('email'),
                        phone: getValuesFormRecipient('phone'),
                        address: getValuesFormRecipient('address'),
                        provinceId: getValuesFormRecipient('provinceId'),
                        districtId: getValuesFormRecipient('districtId'),
                        wardId: getValuesFormRecipient('wardId'),
                        provinceName: IAddress.iprovince?.ProvinceName,
                        districtName: IAddress.idistrict?.DistrictName,
                        wardName: IAddress.iward?.WardName
                    }

                    // Update cart
                    await handleUpdateCart(data)
                    instance.put(`/cart/v2/${id}`, data).then(function(response) {
                        if (response.status === 200 && response.data) {
                            instance.get(`/orders/convert/${id}`).then(function(response) {
                                if (response.status === 200 && response.data) {
                                    getDetailAboutCart()
                                    callHaveNewOrder()
                                    location.href = '/thank'

                                    console.log('Xóa cart id ở convert')
                                    localStorage.removeItem('myCartId')
                                }
                            })
                            getDetailAboutCart()

                        }
                    })

                    // Convert cart to order

                } catch (error) {
                    console.error('Error processing payment:', error)
                    // Add appropriate error handling (e.g., show a notification to the user)
                }
            } else if (paymentMethod === 'TRANSFER') {
                const data = {
                    'status': 'PENDING',
                    payment: paymentMethod,
                    recipientName: getValuesFormRecipient('recipientName'),
                    email: getValuesFormRecipient('email'),
                    phone: getValuesFormRecipient('phone'),
                    address: getValuesFormRecipient('address'),
                    provinceId: getValuesFormRecipient('provinceId'),
                    districtId: getValuesFormRecipient('districtId'),
                    wardId: getValuesFormRecipient('wardId'),
                    provinceName: IAddress.iprovince?.ProvinceName,
                    districtName: IAddress.idistrict?.DistrictName,
                    wardName: IAddress.iward?.WardName
                }
                instance.put(`/cart/v2/${id}`, data).then(function(response) {
                    if (response.status === 200 && response.data) {
                        instance.get(`/orders/convert/${id}`).then(function(response) {
                            if (response.status === 200 && response.data) {
                                const idOrder = response.data.id
                                const amount = Math.round((selectedCart as CartResponseDTO).total)
                                instance.get(`/payment/vn-pay?amount=${amount}&currency=VND&returnUrl=http://localhost:5173/client/payment/callback&idOrder=${idOrder}`).then(function(response) {
                                    if (response.status === 200 && response.data) {
                                        callHaveNewOrder()
                                        const url = response?.data?.data?.paymentUrl
                                        if (url) {
                                            window.location.href = url // Mở đường dẫn mới
                                        }
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }

    }

    const debounceFn = debounce(handleDebounceFn, 500)

    function handleDebounceFn(val: string) {
        console.log(val)
        if (typeof val === 'string' && (val.length > 1 || val.length === 0)) {
            setIAddress((prev) => ({ ...prev, address: (val) }))
            setValuesFormRecipient('address', val)

        }
    }

    const handleChangeAddress = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    const handleUpdateCart = async (data: any) => {
        instance.put(`/cart/v2/${id}`, data).then(function(response) {
            if (response.status === 200 && response.data) {
                getDetailAboutCart()
            }
        })
    }

    const handleUnLinkVoucherCart = async () => {
        await instance.get(`/cart/unlink-voucher/${id}`).then(function(response) {
            if (response.status === 200 && response.data) {
                setSelectedCart(response.data)
            }
        })
    }


    const getDetailAboutCart = async () => {
        instance.get(`cart/detail/${id}`).then(function(response) {
            if (response.status === 200 && response.data) {
                setSelectedCart(response.data)
                setPaymentMethod(response.data.payment)

                const selectedCart = response.data

                console.log('----------------')
                console.log(selectedCart)
                setValuesFormRecipient('recipientName', (selectedCart as CartResponseDTO)?.recipientName ?? '')
                setValuesFormRecipient('email', (selectedCart as CartResponseDTO)?.email ?? '')
                setValuesFormRecipient('phone', (selectedCart as CartResponseDTO)?.phone ?? '')
                setValuesFormRecipient('address', (selectedCart as CartResponseDTO)?.address ?? '')
                setValuesFormRecipient('provinceId', (selectedCart as CartResponseDTO)?.provinceId?.toString() ?? '')
                setValuesFormRecipient('districtId', (selectedCart as CartResponseDTO)?.districtId?.toString() ?? '')
                setValuesFormRecipient('wardId', (selectedCart as CartResponseDTO)?.wardId?.toString() ?? '')
                if ((selectedCart as CartResponseDTO)?.provinceId !== undefined && (selectedCart as CartResponseDTO)?.provinceId !== null) {
                    const provinceId = (selectedCart as CartResponseDTO)?.provinceId.toString()
                    handleFindAllDistricts(provinceId)
                }

                if ((selectedCart as CartResponseDTO)?.districtId !== undefined && (selectedCart as CartResponseDTO)?.districtId !== null) {
                    const districtId = (selectedCart as CartResponseDTO)?.districtId.toString()
                    handleFindAllWards(districtId)
                }


                if ((response.data.voucherResponseDTO as VoucherResponseDTO)) {
                    setValue('voucherCode', response.data.voucherResponseDTO.code)
                }
            }
        })
    }

    useEffect(() => {
        checkValidCart()
        instance.get(`cart-details/in-cart/${id}`).then(function(response) {
            if (response?.data) {
                setListCartDetailResponseDTO(response?.data)
            }
        }).catch(function(error) {
            console.log(error.response.data.error === 'cart not found')
        })
        handleFindAllProvinces()
        getDetailAboutCart()
        setIsOpenCartDrawer(false)
    }, [])


    useEffect(() => {
        console.log('++++++++++++++++')
        console.log(IAddress)
        if (IAddress.iprovince) {
            console.log('Change provine')
            handleFindAllDistricts(IAddress.iprovince.ProvinceID)
            if (IAddress.idistrict) {
                console.log('Change district')
                handleFindAllWards(IAddress.idistrict.DistrictID)
                if (IAddress.iward) {
                    console.log('Change iward')
                    const data = {
                        payment: paymentMethod,
                        recipientName: getValuesFormRecipient('recipientName'),
                        email: getValuesFormRecipient('email'),
                        phone: getValuesFormRecipient('phone'),
                        address: getValuesFormRecipient('address'),
                        districtId: IAddress.idistrict?.DistrictID,
                        districtName: IAddress.idistrict?.DistrictName,
                        provinceId: IAddress.iprovince.ProvinceID,
                        provinceName: IAddress.iprovince.ProvinceID,
                        wardId: IAddress.iward?.WardCode,
                        wardName: IAddress.iward?.WardName
                    }
                    handleUpdateCart(data)
                }
            }
        }
    }, [IAddress])

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

    const onChangeMethod = async (val: EPaymentMethod) => {
        setPaymentMethod(val)
        const data = {
            payment: val
        }
        await handleUpdateCart(data)
    }

    const { user, setUser } = useAuthContext()

    const Breadcrumb = () => {
        return (
            <div className="lg:flex items-center justify-between mb-4">
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li>
                            <div className="flex items-center">
                                <a href="/" className="text-gray-700 hover:text-blue-600">
                                    Trang Chủ
                                </a>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <span className="mx-2">/</span>
                                <Link to={`/checkout/${id}`} className="text-gray-700 hover:text-blue-600">
                                    Thanh toán
                                </Link>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>
        )
    }

    const MyAddressModal = () => {
        const [myAddress, setMyAddress] = useState<AddressResponse[]>([])
        const [selectedAddressId, setSelectedAddressId] = useState<string>('')

        const getMyAddress = async () => {
            instance.get('/address/my-address').then(function(response) {
                console.log(response)
                if (response.status === 200) {
                    console.log('MY ADDRESS')
                    console.log(response.data)
                    setMyAddress(response.data)
                }
            })
        }
        useEffect(() => {
            getMyAddress()
        }, [])

        useEffect(() => {
            const defaultAddress = myAddress.find(s => s.isDefault)
            if (defaultAddress) {
                console.log('DEFALUT ADDRESS ID', defaultAddress?.id)
                setSelectedAddressId(defaultAddress?.id.toString())
            }
        }, [myAddress])

        const updateCartAddress = async () => {
            if (selectedAddressId) {
                await instance.get(`/cart/edit-my-address/${id}?addressId=${selectedAddressId}`).then(function(response) {
                    if (response.status === 200) {
                        openNotification('Cập nhật thành công')
                        getDetailAboutCart()
                        setIsOpenSelectAddressModal(false)
                    }
                })
            }
        }
        return (
            <div>
                <Radio.Group
                    vertical
                    value={getValuesFormRecipient('address') + getValuesFormRecipient('phone').toString() + getValuesFormRecipient('recipientName')}
                    className={'w-full'}
                >
                    {myAddress.length > 0 ? myAddress.map((item, index) => (
                        <Radio
                            key={index}
                            value={item.detail + item.phone + item.name}
                            onClick={() => setSelectedAddressId(item.id.toString())}
                        >
                            <div>
                                <div>
                                    <span className={'text-black'}>{item.name}</span>
                                    | {item.phone}
                                </div>
                                <div>
                                    {item.detail}, {item.ward}, {item.district}, {item.province}
                                </div>
                                <div>
                                    {
                                        item.isDefault && (
                                            <p className={'text-[12px] text-blue-600 py-1'}>
                                                Địa chỉ mặc định
                                            </p>
                                        )
                                    }

                                </div>
                            </div>
                        </Radio>
                    )) : (
                        <div className={'py-5 text-center'}>
                            <p className={'text-[16px] font-semibold'}>Quý khách không có bất kì địa chỉ nào khác</p>
                        </div>
                    )}
                </Radio.Group>
                <div className={'flex justify-end gap-2'}>
                    <Button size={'sm'} onClick={updateCartAddress}>
                        Xác nhận
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white ">
            {
                isOpenSelectAddressModal && (
                    <div className={'fixed top-0 left-0 bg-gray-500 bg-opacity-30 w-screen h-screen z-[40]'}>
                        <div
                            className={'fixed top-1/2 left-1/2 w-3/6 bg-white -translate-x-1/2 -translate-y-1/2 z-50 shadow-2xl rounded'}>
                            <div className={'p-5'}>
                                <div className={'flex justify-between'}>
                                    <div>
                                        <p className={'font-semibold text-[16px] text-black'}>Địa chỉ của tôi</p>
                                    </div>
                                    <div>
                                        <CloseButton
                                            className={'text-xl'}
                                            onClick={() => setIsOpenSelectAddressModal(false)}
                                        />
                                    </div>
                                </div>
                                <div className={'p-3'}>
                                    <MyAddressModal />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            <div className={'px-[2%] h-full'}>
                <form className={'py-10 grid grid-cols-12 gap-12 h-full'}>
                    {/*BLOCK 1*/}
                    <div className={'order-2 md:order-1 h-full col-span-8 flex flex-col justify-start '}>
                        <Fragment>
                            <div className={'flex gap-1 justify-start items-center'}>
                                <div className="text-black font-semibold text-xl">
                                    Xin chào {user?.username || 'quý khách'}
                                </div>
                            </div>

                            <div className={'flex flex-col gap-5'}>
                                <div>
                                    <div>
                                        <Breadcrumb />
                                    </div>
                                    <div className={'flex justify-between items-center'}>
                                        <div className={'text-black font-semibold text-xl'}>
                                            <p>Thông tin giao hàng</p>
                                        </div>
                                        <div>
                                            <button
                                                type={'button'}
                                                className={'p-2 border border-gray-300'}
                                                onClick={() => setIsOpenSelectAddressModal(true)}
                                            >
                                                Chọn địa chỉ
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className={'grid 2xl:grid-cols-3 xl:grid-cols-1 gap-4'}>
                                    <div className={'col-span-1'}>
                                        <p className={' text-black text-[18px] font-semibold'}>Họ và tên</p>
                                        <Input
                                            className={'border-2 rounded-lg shadow-sm border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400'}
                                            placeholder={'Họ và tên'}
                                            {...registerFormRecipient('recipientName')}
                                            onChange={(el) => {
                                                setValuesFormRecipient('recipientName', el.target.value)
                                            }}
                                        ></Input>
                                        {errorsFormRecipient.recipientName && (
                                            <p className="text-red-500 text-sm mt-2">{errorsFormRecipient.recipientName.message}</p>
                                        )}
                                    </div>
                                    <div className={'col-span-1'}>
                                        <p className={' text-black text-[18px] font-semibold'}>Email</p>
                                        <Input
                                            className={'border-2 rounded-lg shadow-sm border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400'}
                                            placeholder={'Email'}
                                            {...registerFormRecipient('email')}
                                            onChange={(el) => {
                                                setValuesFormRecipient('email', el.target.value)
                                            }}
                                        ></Input>
                                        {errorsFormRecipient.recipientName && (
                                            <p className="text-red-500 text-sm mt-2">{errorsFormRecipient.recipientName.message}</p>
                                        )}
                                    </div>
                                    <div className={'col-span-1'}>
                                        <p className={'  text-black text-[18px] font-semibold'}>Số điện thoại</p>
                                        <Input
                                            className={'border-2 rounded-lg shadow-sm border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400'}
                                            placeholder="Số điện thoại"
                                            {...registerFormRecipient('phone')}
                                            onChange={(el) => {
                                                setValuesFormRecipient('phone', el.target.value)
                                            }}
                                        />
                                        {errorsFormRecipient.phone && (
                                            <p className="text-red-500 text-sm mt-2">{errorsFormRecipient.phone.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className={'grid grid-cols-3 gap-4'}>
                                    <div>
                                        <p className={'text-black text-[18px] font-semibold'}>Tỉnh thành</p>
                                        <Select
                                            className={'border-2 rounded-lg shadow-sm border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400'}
                                            options={provinces}
                                            placeholder="Tỉnh/thành"
                                            {...registerFormRecipient('provinceId')}
                                            onChange={(el) => {
                                                setIAddress((prev) => ({ ...prev, iprovince: (el as IProvince) }))
                                                setValuesFormRecipient('provinceId', (el as IProvince).ProvinceID)
                                            }}
                                            value={
                                                provinces.find((s) =>
                                                    getValuesFormRecipient('provinceId')?.toString() === s.ProvinceID.toString()
                                                ) ?? null
                                            }
                                        />
                                        {errorsFormRecipient.provinceId && (
                                            <p className="text-red-500 text-sm mt-2">{errorsFormRecipient.provinceId.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className={'  text-black text-[18px] font-semibold'}>Quận/huyện</p>
                                        <Select
                                            className={'border-2 rounded-lg shadow-sm border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400'}
                                            options={districts}
                                            placeholder="Quận/huyện"
                                            {...registerFormRecipient('districtId')}
                                            onChange={(el) => {
                                                setIAddress((prev) => ({ ...prev, idistrict: (el as IDistrict) }))
                                                setValuesFormRecipient('districtId', (el as IDistrict).DistrictID)
                                            }}
                                            value={
                                                districts.find((s) =>
                                                    getValuesFormRecipient('districtId')?.toString() === s.DistrictID.toString()
                                                ) ?? null
                                            }
                                        />
                                        {errorsFormRecipient.districtId && (
                                            <p className="text-red-500 text-sm mt-2">{errorsFormRecipient.districtId.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className={'  text-black text-[18px] font-semibold'}>Xã/phường</p>
                                        <Select
                                            className={'border-2 rounded-lg shadow-sm border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400'}
                                            options={wards}
                                            placeholder="Xã/phường"
                                            {...registerFormRecipient('wardId')}
                                            onChange={(el) => {
                                                setIAddress((prev) => ({ ...prev, iward: (el as IWard) }))
                                                setValuesFormRecipient('wardId', (el as IWard).WardCode)
                                            }}
                                            value={
                                                wards.find((s) =>
                                                    getValuesFormRecipient('wardId')?.toString() === s.WardCode.toString()
                                                ) ?? null
                                            }
                                        />
                                        {errorsFormRecipient.wardId && (
                                            <p className="text-red-500 text-sm mt-2">{errorsFormRecipient.wardId.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className={'  text-black text-[18px] font-semibold'}>Địa chỉ</p>
                                    <Input
                                        className={'border-2 rounded-lg shadow-sm border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400'}
                                        placeholder={'Địa chỉ'}
                                        {...registerFormRecipient('address')}
                                        onChange={(el) => {
                                            handleChangeAddress(el)
                                        }}
                                    ></Input>
                                    {errorsFormRecipient.address && (
                                        <p className="text-red-500 text-sm mt-2">{errorsFormRecipient.address.message}</p>
                                    )}
                                </div>

                                <div>
                                    <div className={'py-2 text-black font-semibold text-[18px]'}>
                                        <p>Phương thức vận chuyển</p>
                                    </div>
                                    <Card className={'border-2 rounded-lg shadow-sm border-gray-300'}>
                                        <Radio checked>Vận chuyển</Radio>
                                    </Card>
                                </div>
                                <div>
                                    <div className={'py-2 text-black font-semibold text-[18px]'}>
                                        Phương thức thanh toán
                                    </div>
                                    <Card className={'border-2 rounded-lg shadow-sm border-gray-300'}>
                                        <Radio.Group
                                            vertical
                                            className={'gap-1'}
                                            value={paymentMethod}
                                            onChange={onChangeMethod}
                                        >
                                            <Radio value={EPaymentMethod.TRANSFER}
                                                   checked={selectedCart?.payment === 'TRANSFER'}>Thanh toán ngân
                                                hàng</Radio>
                                            <Radio value={EPaymentMethod.CASH}
                                                   checked={selectedCart?.payment === 'CASH'}>Thanh toán khi nhận
                                                hàng</Radio>
                                        </Radio.Group>
                                    </Card>
                                </div>
                            </div>
                        </Fragment>
                    </div>

                    {/*BLOCK 2*/}
                    {/* BLOCK 2 */}
                    <div className="order-1 md:order-2 h-full col-span-4">
                        <div className="grid">
                            <div
                                className="dark:text-gray-500 bg-white flex flex-col justify-between ">
                                <div className={'overflow-y-auto'}>
                                    {/* CENTER */}
                                    <div className="px-2 max-h-[800px]">
                                        {Array.isArray(listCartDetailResponseDTO) && listCartDetailResponseDTO.length > 0 ? (
                                            listCartDetailResponseDTO.map((item, index) => (
                                                <Fragment key={index}>
                                                    <div
                                                        className="flex justify-between gap-6 border-b border-gray-300 py-6">
                                                        {/* Hình ảnh sản phẩm */}
                                                        <div className="flex-shrink-0">
                                                            <Badge content={item?.quantity} maxCount={9999}>
                                                                <div className="w-28 h-28">
                                                                    {item.productDetailResponseDTO?.images[0]?.url ? (
                                                                        <img
                                                                            src={item.productDetailResponseDTO.images[0]?.url}
                                                                            className="w-full h-full object-cover rounded-lg"
                                                                            alt=""
                                                                        />
                                                                    ) : (
                                                                        <img
                                                                            src="https://t4.ftcdn.net/jpg/04/99/93/31/360_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg"
                                                                            className="w-full h-full object-cover rounded-lg"
                                                                            alt=""
                                                                        />
                                                                    )}
                                                                </div>
                                                            </Badge>
                                                        </div>

                                                        {/* Thông tin sản phẩm */}
                                                        <div className="flex flex-col justify-between w-full">
                                                            {/* Tên sản phẩm */}
                                                            <div>
                                                                <p className="font-semibold text-sm">
                                                                    Sản phẩm: <span
                                                                    className="text-gray-800">{item.productDetailResponseDTO?.product?.name}</span>
                                                                </p>
                                                                {/* Thuộc tính sản phẩm */}
                                                                <div className="mt-2 text-sm text-gray-600 space-y-1">
                                                                    <p>
                                                                        <span
                                                                            className="text-gray-800">{item.productDetailResponseDTO?.color?.name}</span>
                                                                    </p>
                                                                    <p>
                                                                        Size: <span
                                                                        className="text-gray-800">{item.productDetailResponseDTO?.size?.name}</span>
                                                                    </p>
                                                                    <p>
                                                                        Thương hiệu: <span
                                                                        className="text-gray-800">{item.productDetailResponseDTO?.brand?.name}</span>
                                                                    </p>
                                                                    <p>
                                                                        Đơn giá:{' '}
                                                                        <span
                                                                            className={`text-red-600 ${hasSale(item.productDetailResponseDTO) ? 'line-through' : ''}`}>
                                                                            {Math.round(item.productDetailResponseDTO?.price).toLocaleString('vi-VN') + '₫'}
                                                                        </span>
                                                                    </p>
                                                                    {item.productDetailResponseDTO.product.eventDTOList.length > 0 && (
                                                                        <p>
                                                                            Giá khuyến mãi:{' '}
                                                                            <span className="text-red-600">
                                                                                {getFinalPrice(item.productDetailResponseDTO).toLocaleString('vi-VN') + '₫'}
                                                                            </span>
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {/* Giá sản phẩm */}
                                                        </div>
                                                        <div className="flex justify-between items-center mt-4">
                                                            <div></div>
                                                            <span className="font-semibold text-red-600 text-lg">
                                                                {Math.round(getFinalPrice(item.productDetailResponseDTO) * item?.quantity).toLocaleString('vi-VN') + '₫'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Fragment>
                                            ))
                                        ) : (
                                            <Fragment>
                                                <div className="flex flex-col justify-center items-center h-full">
                                                    <div>
                                                        <img className="w-28 h-28 object-cover"
                                                             src="/img/OIP-removebg-preview.png"
                                                             alt="No product image" />
                                                    </div>
                                                    <div>
                                                        <span className="font-light text-gray-500">Không có sản phẩm nào trong giỏ hàng</span>
                                                    </div>
                                                </div>
                                            </Fragment>
                                        )}
                                    </div>
                                </div>
                                {/* BOTTOM */}
                                <div className="text-sm">
                                    <div className="py-2 text-black font-semibold text-[18px]">
                                        Thông tin thanh toán
                                    </div>
                                    <form className="grid grid-cols-12 gap-4 w-full py-4">
                                        <div className="col-span-6">
                                            <Input
                                                placeholder="Mã giảm giá"
                                                className={`border-2  rounded-none border-gray-200  ${errors.voucherCode ? 'border-red-500' : ''}`}
                                                {...register('voucherCode', {
                                                    required: 'Mã giảm giá không hợp lệ',
                                                    minLength: {
                                                        value: 5,
                                                        message: 'Mã giảm giá phải có ít nhất 5 ký tự'
                                                    }
                                                })}
                                            />
                                            {errors.voucherCode && (
                                                <p className="text-red-500 text-sm mt-2">{errors.voucherCode.message}</p>
                                            )}
                                        </div>
                                        <div className="col-span-6">
                                            <div className={'flex justify-between gap-2'}>
                                                <button
                                                    className="border-2 w-full h-[38px] rounded-none border-black text-black"
                                                    onClick={handleSubmit(customHandleSubmit)}
                                                >
                                                    Sử dụng
                                                </button>
                                                {
                                                    selectedCart?.voucherResponseDTO && (
                                                        <button
                                                            type={'button'}
                                                            className={'border-2 w-full h-[38px] rounded-none border-black text-black'}
                                                            onClick={ handleUnLinkVoucherCart}
                                                        >
                                                            Bỏ gán
                                                        </button>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </form>

                                    {/* Dòng "Xem thêm mã giảm giá" */}
                                    <div className="text-sm text-blue-600 cursor-pointer mt-2"
                                         onClick={toggleVoucherModal}>
                                        Xem thêm mã giảm giá
                                    </div>

                                    {/* Hiển thị voucher đã chọn */}
                                    <div className="mt-4">
                                        {
                                            isVoucherModalOpen && (
                                                <VoucherModal
                                                    setIsVoucherModalOpen={setIsVoucherModalOpen}
                                                    isVoucherModalOpen={isVoucherModalOpen}
                                                    toggleVoucherModal={toggleVoucherModal}
                                                    onVoucherSelect={handleVoucherSelect}
                                                />
                                            )
                                        }
                                    </div>

                                    {selectedVoucher && (
                                        <div className="mt-4 p-4 border rounded bg-gray-100">
                                            <div className={'flex justify-between items-center'}>
                                                <div>
                                                    <h2 className="font-semibold text-lg">Phiếu giảm giá đã chọn</h2>
                                                </div>

                                            </div>
                                            <p>Tên: {selectedVoucher.name}</p>
                                            <p>Mã: {selectedVoucher.code}</p>
                                            <p>Phần trăm giảm: {selectedVoucher.maxPercent}%</p>
                                            <p>Số tiền tối
                                                thiểu: {selectedVoucher.minAmount.toLocaleString('vi-VN')}₫</p>
                                        </div>
                                    )}

                                    <div className="py-2 flex justify-between">
                                        <span>Tạm tính:</span>
                                        <span
                                            className="text-red-500 font-semibold">{(selectedCart as CartResponseDTO)?.subTotal?.toLocaleString('vi') ?? 'n/a'}₫</span>
                                    </div>
                                    <div className="py-2 flex justify-between">
                                        <div className={'flex gap-2'}>
                                            <p>Phí vận chuyển</p>
                                            <img
                                                src={'https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHN-Blue-Orange-350x88.png'}
                                                width={'60px'} />
                                        </div>
                                        <span
                                            className="text-red-500 font-semibold">+ {(selectedCart as CartResponseDTO)?.deliveryFee?.toLocaleString('vi') ?? '0'}₫</span>
                                    </div>
                                    <div className="py-2 flex justify-between">
                                        <span>Giảm giá:</span>
                                        <span
                                            className="text-red-500 font-semibold">- {(selectedCart as CartResponseDTO)?.discount?.toLocaleString('vi') ?? '0'}₫</span>
                                    </div>
                                    <div className="py-2 flex justify-between">
                                        <span>Tổng tiền:</span>
                                        <span
                                            className="text-red-500 font-semibold">{(selectedCart as CartResponseDTO)?.total?.toLocaleString('vi') ?? '0'}₫</span>
                                    </div>
                                    <>
                                        <ConfirmModal
                                            isOpen={isModalOpen}
                                            onClose={() => setIsModalOpen(false)}
                                            onConfirm={() => {
                                                handleSubmitFormRecipient(handleConfirmCart)()
                                                setIsModalOpen(false)
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="bg-black w-full py-2 font-thin rounded-none text-white"
                                            onClick={() => {
                                                handleSubmitFormRecipient(() => {
                                                    setIsModalOpen(true)
                                                })()
                                            }}
                                        >
                                            Xác nhận đơn hàng
                                        </button>
                                    </>

                                </div>


                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default Checkout