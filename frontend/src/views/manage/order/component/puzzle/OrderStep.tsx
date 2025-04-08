import { Fragment, useEffect, useState, useRef } from 'react'
import Steps from '@/components/ui/Steps'
import { Button, Dialog, Input, Radio } from '@/components/ui'
import { OrderResponseDTO, EOrderStatus, EOrderStatusEnums } from '@/@types/order'
import {
    HiOutlineArrowLeft,
    HiOutlineCash,
    HiOutlineHand,
    HiOutlineMap,
    HiOutlineTruck
} from 'react-icons/hi'
import instance from '@/axios/CustomAxios'
import { useToastContext } from '@/context/ToastContext'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useLoadingContext } from '@/context/LoadingContext'
import { ErrorMessage, Field, Form, Formik } from 'formik'


type ExampleAnswers = {
    status: EOrderStatus;
    messages: string[];
}


type HistoryDTO = {
    note: string
}


type MODE = 'FOR_CANCEL' | 'FOR_TOSHIP'
const OrderStep = ({ selectObject, fetchData }: { selectObject: OrderResponseDTO, fetchData: () => Promise<void> }) => {

    const { setIsLoadingComponent } = useLoadingContext()
    const [isMode, setIsMode] = useState<MODE>()
    const [endHistoryStatus, setEndHistoryStatus] = useState<EOrderStatus | undefined>()
    useEffect(() => {
        const historyLength = selectObject.historyResponseDTOS.length
        setEndHistoryStatus(historyLength > 0
            ? selectObject.historyResponseDTOS[historyLength - 1]?.status
            : undefined)
    }, [selectObject])
    // Schema xác thực
    const validationSchemaTrade = Yup.object().shape({
        transactionCode: Yup.string()
            .required('Mã giao dịch là bắt buộc')
            .min(6, 'Mã giao dịch phải có ít nhất 6 ký tự')
    })

    // Xử lý khi submit form
    const handleSubmitCancelTrade = async (values: { transactionCode: string }) => {
        console.log(values)
        const data = {
            amount: isMode === 'FOR_TOSHIP' ? selectObject.refund : selectObject.totalPaid,
            tradingCode: values.transactionCode,
            status: isMode === 'FOR_TOSHIP' ? EOrderStatusEnums.TOSHIP : EOrderStatusEnums.CANCELED
        }
        await instance.post(`orders/refund_and_change_status/${selectObject.id}`, data).then(function(response) {
            console.log(response)
            if (response.status === 200) {
                openNotification('Thay đổi trạng thái thành công')
            }
            setIsOpenTradingCodeConfirm(false)
            fetchData()
        })
    }

    const { openNotification } = useToastContext()
    const { sleepLoading } = useLoadingContext()

    const validationSchema = Yup.object({
        note: Yup.string().required('Vui lòng nhập nội dung').min(5, 'Nội dung phải có ít nhất 5 ký tự')
    })
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue: setNoteValue
    } = useForm<HistoryDTO>({
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })
    useEffect(() => {
        setNoteValue('note', '')
    }, [])

    const textareaRef = useRef<HTMLTextAreaElement>(null) // Khai báo ref độc lập

    const focusTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.focus() // Gọi focus trên DOM node
        }
    }
    const run = async () => {
        try {
            const response = await instance.get(`orders/exportPdf/${selectObject.id}`, {
                responseType: 'blob' // Đảm bảo nhận phản hồi dưới dạng blob (file)
            })

            // Tạo URL từ Blob
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))

            // Tạo iframe ẩn để in
            const iframe = document.createElement('iframe')
            iframe.style.display = 'none'
            iframe.src = url

            // Đợi khi iframe tải xong và in
            iframe.onload = () => {
                if (iframe.contentWindow) {
                    iframe.contentWindow.print()

                }
            }

            // Thêm iframe vào body
            document.body.appendChild(iframe)

            // Dọn dẹp tài nguyên sau khi in xong
            iframe.addEventListener('load', () => {
                setTimeout(() => {
                    document.body.removeChild(iframe)
                    window.URL.revokeObjectURL(url)
                }, 600000) // Để đảm bảo quá trình in hoàn tất trước khi xóa iframe
            })
        } catch (error) {
            console.error('Failed to print PDF', error)
        }
    }
    const [currentStatus, setCurrentStatus] = useState<EOrderStatus>(selectObject.status)

    const exampleAnswers: ExampleAnswers[] = [
        {
            'status': 'PENDING',
            'messages': [
                'Đã xác nhận đơn hàng',
                'Khách muốn hủy đơn'
            ]
        },
        {
            'status': 'TOSHIP',
            'messages': [
                'Xác nhận đơn hàng đang được vận chuyển',
                'Khách hàng muốn chỉnh sửa giỏ hàng'
            ]
        },
        {
            'status': 'TORECEIVE',
            'messages': [
                'Xác nhận hoàn thành đơn hàng',
                'Khách chưa nhận được hàng',
            ]
        },
        {
            'status': 'REQUESTED',
            'messages': [
                'Xác nhận hủy và hoàn trả'
            ]
        }
    ]

    const [dialogIsOpenTradingCodeConfirm, setIsOpenTradingCodeConfirm] = useState(false)

    const onDialogClose = () => {
        setIsOpenTradingCodeConfirm(false)
    }

    useEffect(() => {
        setCurrentStatus(selectObject.status)
        console.log('Current status: ', selectObject.status)
    }, [selectObject])


    const onClickSelectSuggest = (value: string) => {
        console.log(value)
        setNoteValue('note', value)
    }

    const onChangeNote = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNoteValue('note', e.target.value) // Cập nhật giá trị trong form
    }
    const submitChangeStatus = async (status: EOrderStatus) => {
        const data = {
            'status': status,
            'note': getValues('note')
        }
        await sleepLoading(500).then(async () => {
            instance.put(`/orders/status/change/${selectObject.id}`, data).then(function(response) {
                setIsLoadingComponent(true)
                if (response.status === 200) {
                    openNotification('Thay đổi trạng thái thành công')
                    if (status === 'TOSHIP') {
                        run()
                    }
                }
                fetchData()
                setNoteValue('note', '')
            }).catch(function(error) {
                console.log('-----')
                console.log(error.response)
                if (error?.response?.data?.error) {
                    openNotification(error?.response?.data?.error, 'Thông báo', 'warning', 5000)
                }
            }).finally(function() {
                setIsLoadingComponent(false)
            })
        })
    }

    const ActionButton = () => {
        if (currentStatus === 'PENDING' && endHistoryStatus !== "REQUESTED") {
            return (
                <div className="flex gap-2">

                    {
                        selectObject.type === 'ONLINE' && selectObject.refund > 0 ?
                            (
                                <Button block variant="solid" size="sm" className="bg-indigo-500 !w-auto"
                                        disabled={selectObject.orderDetailResponseDTOS.length === 0}
                                        icon={<HiOutlineTruck />}
                                        onClick={handleSubmit(async () => {
                                            setIsMode('FOR_TOSHIP')
                                            setIsOpenTradingCodeConfirm(true)
                                        })}>
                                    Trả lại tiền và chuyển sang chờ vận chuyển
                                </Button>
                            )
                            : selectObject.type === 'ONLINE' ? (
                                    <Button block variant="solid" size="sm" className="bg-indigo-500 !w-auto"
                                            disabled={selectObject.orderDetailResponseDTOS.length === 0}
                                            icon={<HiOutlineTruck />}
                                            onClick={handleSubmit(async () => submitChangeStatus('TOSHIP'))}>
                                        Chuyển trạng thái chờ vận chuyển
                                    </Button>
                                ) :
                                (
                                    <Button block variant="solid" size="sm" className="bg-indigo-500 !w-auto"
                                            disabled={selectObject.orderDetailResponseDTOS.length === 0}
                                            icon={<HiOutlineCash />}
                                            onClick={handleSubmit(async () => submitChangeStatus('DELIVERED'))}>
                                        Xác nhận giao hàng
                                    </Button>
                                )
                    }
                    {
                        selectObject.isPayment ?
                            (
                                <Button block variant="default" size="sm" className="bg-indigo-500"
                                        icon={<HiOutlineHand />}
                                        onClick={handleSubmit(async () => {
                                            setIsMode('FOR_CANCEL')
                                            setIsOpenTradingCodeConfirm(true)
                                        })}>Trả lại tiền và hủy đơn</Button>
                            )
                            : (
                                <Button block variant="default" size="sm" className="bg-indigo-500 !w-32"
                                        icon={<HiOutlineHand />}
                                        onClick={handleSubmit(async () => submitChangeStatus('CANCELED'))}>Hủy đơn
                                    hàng</Button>
                            )
                    }

                </div>
            )
        } else if (currentStatus === 'PENDING' && endHistoryStatus === "REQUESTED") {
            return (
                <div className="flex gap-2">
                    <Button block variant="default" size="sm" className="bg-indigo-500"
                            icon={<HiOutlineHand />}
                            onClick={handleSubmit(async () => {
                                setIsMode('FOR_CANCEL')
                                setIsOpenTradingCodeConfirm(true)
                            })}>Trả lại tiền và hủy đơn</Button>
                </div>
            )
        }else if (currentStatus === 'TOSHIP') {
            return (
                <div className="flex gap-2">
                    <Button block variant="solid" size="sm" className="bg-indigo-500 !w-auto" icon={<HiOutlineMap />}
                            onClick={handleSubmit(async () => submitChangeStatus('TORECEIVE'))}>Xác nhận đang vận
                        chuyển </Button>
                    <Button block variant="default" size="sm" className="bg-indigo-500 !w-auto"
                            icon={<HiOutlineArrowLeft />}
                            onClick={handleSubmit(async () => submitChangeStatus('PENDING'))}>Quay lại chờ xác
                        nhận</Button>
                </div>
            )
        } else if (currentStatus === 'TORECEIVE') {
            return (
                <div className="flex gap-2">
                    <Button block variant="solid" size="sm" className="bg-indigo-500 !w-auto" icon={<HiOutlineCash />}
                            onClick={handleSubmit(async () => submitChangeStatus('DELIVERED'))}>Xác nhận hoàn
                        thành</Button>
                    <Button block variant="default" size="sm" className="bg-indigo-500 !w-auto"
                            icon={<HiOutlineArrowLeft />}
                            onClick={handleSubmit(async () => submitChangeStatus('PENDING'))}>Quay lại chờ xác
                        nhận</Button>
                </div>
            )
        } else if (currentStatus === 'DELIVERED') {
            return (
                <div className="flex gap-2">
                    {/* <Button block variant="solid" size="sm" className='bg-indigo-500 !w-auto' icon={<HiPlusCircle />} onClick={() => submitChangeStatus('DELIVERED')}> Confirm</Button>
                    <Button block variant="default" size="sm" className='bg-indigo-500 !w-32' icon={<HiPlusCircle />}>Cancelled</Button> */}
                </div>
            )
        }
    }

    const ChangeForPending = () => {
        const answers = exampleAnswers.find(s => s.status === endHistoryStatus)?.messages

        return (
            <div>
                <div className="mb-4">
                    <div className="">
                        <div className="mt-4">
                            {answers && answers.length > 0 ? (
                                <Radio.Group vertical value={getValues('note')}>
                                    {answers.map((item, index) => (
                                        <Radio value={item} key={index} onClick={() => onClickSelectSuggest(item)}>
                                            {item}
                                        </Radio>
                                    ))}
                                    <Radio value={''} onClick={() => onClickSelectSuggest('')}>Khác</Radio>
                                </Radio.Group>
                            ) : (
                                <div>
                                    {currentStatus && (
                                        <Fragment>
                                            <div className="text-[15px] font-semibold text-center py-5">
                                                {currentStatus === 'DELIVERED'
                                                    ? 'Đơn hàng được giao thành công'
                                                    : currentStatus === 'CANCELED'
                                                        ? 'Trạng thái đơn hàng bị hủy'
                                                        : null}
                                            </div>
                                        </Fragment>
                                    )}
                                </div>
                            )}
                        </div>


                    </div>
                    <div className="col-span-4"
                         hidden={currentStatus === 'DELIVERED' || currentStatus === 'CANCELED'}>
                        <Input
                            placeholder="Nhập nội dung"
                            {...register('note')}
                            textArea
                            width={600}
                            className="!w-full !min-h-12"
                            rows={2}
                            onFocus={focusTextarea} // Đảm bảo focus khi cần
                            onChange={onChangeNote} // Đảm bảo cập nhật giá trị trong form khi nhập
                        />
                        {errors.note && (
                            <p className="text-red-500 text-sm mt-2">{errors.note.message}</p>
                        )}
                    </div>
                </div>
                <div className="flex gap-5 justify-end">
                    {
                        ActionButton()
                    }
                </div>
            </div>
        )
    }

    const getLabel = (st: EOrderStatusEnums) => {
        if (st === EOrderStatusEnums.PENDING) {
            return 'Chờ xác nhận'
        } else if (st === EOrderStatusEnums.TOSHIP) {
            return 'Chờ vận chuyển'
        } else if (st === EOrderStatusEnums.TORECEIVE) {
            return 'Đang vận chuyển'
        } else if (st === EOrderStatusEnums.DELIVERED) {
            return 'Đã giao hàng'
        } else if (st === EOrderStatusEnums.CANCELED) {
            return 'Đã hủy'
        } else if (st === EOrderStatusEnums.REQUESTED) {
            return 'Yêu cầu hủy và hoàn trả'
        } else {
            return 'Không xác định'
        }
    }


    return (
        <div className="bg-white p-5 card card-border  h-auto">
            <div className={'max-w-full py-5 overflow-auto'}>
                {
                    selectObject.historyResponseDTOS.length > 0 ? (
                        <Steps current={selectObject.historyResponseDTOS.length}>
                            {
                                selectObject.historyResponseDTOS.map((item, index) => (
                                    <Steps.Item key={index} title={getLabel((item.status as EOrderStatusEnums))}
                                                className={'pr-20'} />
                                ))
                            }
                        </Steps>
                    ) : (
                        <Steps current={0}>
                            <Steps.Item title={currentStatus} />
                        </Steps>
                    )
                }
            </div>
            <div className="dark:bg-gray-700 rounded">
                <ChangeForPending />
            </div>
            <Dialog
                isOpen={dialogIsOpenTradingCodeConfirm}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h5 className="mb-4">Nhập mã giao dịch</h5>
                <div className={'flex gap-2 pb-4'}>
                    <p className={'text-black'}>Số tiền cần trả lại: </p>
                    <p className={'text-red-500'}>{isMode === 'FOR_CANCEL' ? `${selectObject.totalPaid.toLocaleString('vi')}` : `${selectObject.refund.toLocaleString('vi')}` + 'đ'}</p>
                </div>
                <Formik
                    initialValues={{ transactionCode: '' }}
                    validationSchema={validationSchemaTrade}
                    onSubmit={handleSubmitCancelTrade}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form>
                            <div>
                                <Field
                                    name="transactionCode"
                                    as={Input}
                                    placeholder="Vui lòng nhập mã giao dịch"
                                    className={`${
                                        errors.transactionCode && touched.transactionCode
                                            ? 'border-red-500'
                                            : ''
                                    }`}
                                />
                                <ErrorMessage
                                    name="transactionCode"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>
                            <div className="text-right mt-6">
                                <Button
                                    className="ltr:mr-2 rtl:ml-2"
                                    variant="plain"
                                    type="button"
                                    onClick={onDialogClose}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    Xác nhận
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </div>
    )
}


export default OrderStep
