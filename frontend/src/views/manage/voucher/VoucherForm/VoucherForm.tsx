import { Button, FormContainer } from '@/components/ui'
import { Form, Formik, FormikProps, Field, FieldProps } from 'formik'
import { forwardRef, useCallback, useState } from 'react'
import StickyFooter from '@/components/shared/StickyFooter'
import cloneDeep from 'lodash/cloneDeep'
import * as Yup from 'yup'
import CustomerTable from '../components/CustomerTable'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { addDays, format, parseISO } from 'date-fns'


// Types
type FormikRef = FormikProps<any>

export type InitialData = {
    name: string
    code?: string
    typeTicket: 'Individual' | 'Everybody'
    quantity: number
    maxPercent: number
    minAmount: number
    startDate: string
    endDate: string
    customers?: number[]
}

export type SetSubmitting = (isSubmitting: boolean) => void

export type OnDeleteCallback = React.Dispatch<React.SetStateAction<boolean>>

type OnDelete = (callback: OnDeleteCallback) => void

interface VoucherFormProps {
    initialData?: Partial<InitialData>
    type: 'edit' | 'new'
    onDiscard?: () => void
    onDelete?: OnDelete
    onFormSubmit: (values: InitialData, setSubmitting: SetSubmitting) => Promise<void>
}

interface ICustomer {
    id: number
    name: string
    email: string
}

// Validation Schema
const validationSchema = Yup.object().shape({
    name: Yup.string().required('Tên voucher không được để trống')
        .min(3, "Tên voucher phải có ít nhất 3 ký tự")
        .max(50, "Tên voucher không vượt quá 50 ký tự")
        .test('no-whitespace', 'Tên voucher không được chứa nhiều khoảng trắng', value => {
            // kiểm tra khoảng trắng thừa
            return value.trim() === value && !value.includes('  ')
        }),
    minAmount: Yup.number()
        .min(0, 'Giá trị tối thiểu phải lớn hơn hoặc bằng 0')
        .required('Vui lòng nhập giá trị tối thiểu'),
    maxPercent: Yup.number()
        .min(1, 'Phần trăm giảm giá phải lớn hơn hoặc bằng 1')
        .max(100, 'Phần trăm giảm giá không thể vượt quá 100')
        .required('Vui lòng nhập phần trăm giảm giá'),
    typeTicket: Yup.string()
        .oneOf(['Individual', 'Everybody'], 'Loại voucher không hợp lệ')
        .required('Vui lòng chọn loại voucher'),
    quantity: Yup.number()
        .min(1, 'Số lượng phải ít nhất là 1')
        .required('Vui lòng nhập số lượng'),
    startDate: Yup.string().required('Vui lòng chọn ngày bắt đầu'),
    endDate: Yup.string()
        .required('Vui lòng chọn ngày kết thúc')
        .test('is-after-start', 'Ngày kết thúc phải sau ngày bắt đầu', function (value) {
            const { startDate } = this.parent;
            if (!startDate || !value) return true;
            return new Date(value) > new Date(startDate);
        }),
})

// Default Initial Values
const defaultInitialData: InitialData = {
    name: '',
    code: '',
    typeTicket: 'Everybody',
    quantity: 1,
    maxPercent: 0,
    minAmount: 0,
    startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    endDate: format(addDays(new Date(), 7), "yyyy-MM-dd'T'HH:mm"),
    customers: [],
}

const VoucherForm = forwardRef<FormikRef, VoucherFormProps>((props, ref) => {
    const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([])

    const handleSelectedCustomersChange = useCallback((selectedCustomers: ICustomer[]) => {
        const customerIds = selectedCustomers.map((customer) => customer.id)
        setSelectedCustomerIds(customerIds)
    }, [])



    const {
        type,
        initialData = defaultInitialData,
        onFormSubmit,
        onDiscard,
    } = props

    return (
        <>
            <Formik
                innerRef={ref}
                initialValues={initialData}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    const formData = cloneDeep(values);
                    formData.customers = selectedCustomerIds;
                    onFormSubmit?.(formData, setSubmitting);
                }}
            >
                {({ values, touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-1">
                                    <FormItem
                                        asterisk
                                        label="Tên Phiếu Giảm Giá:"
                                        invalid={(errors.name && touched.name) as boolean}
                                        errorMessage={errors.name?.toString()}
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="name"
                                            placeholder="Tên phiếu giảm giá"
                                            component={Input}
                                            className="w-full"
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="Mã Phiếu Giảm Giá:"
                                        invalid={(errors.code && touched.code) as boolean}
                                        errorMessage={errors.code?.toString()}
                                    >
                                        <div className="relative group">
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="code"
                                                placeholder="Mã phiếu giảm giá"
                                                component={Input}
                                                className="w-full"
                                            />
                                            <div className="absolute left-0 right-0 top-full mt-1 text-red-500 hidden bg-white border border-gray-300 p-2 z-10 group-hover:block">
                                                Mã có thể nhập hoặc hệ thống sẽ tự động tạo mã
                                            </div>
                                        </div>
                                    </FormItem>

                                    <FormItem
                                        label="Số Lượng:"
                                        asterisk
                                        invalid={(errors.quantity && touched.quantity) as boolean}
                                        errorMessage={errors.quantity?.toString()}
                                    >
                                        <Field
                                            type="number"
                                            autoComplete="off"
                                            name="quantity"
                                            placeholder="Quantity"
                                            component={Input}
                                            className="w-full "
                                        />
                                    </FormItem>

                                    <FormItem
                                        label="Phần trăm giảm giá tối đa"
                                        asterisk
                                        invalid={(errors.maxPercent && touched.maxPercent) as boolean}
                                        errorMessage={errors.maxPercent?.toString()}
                                    >
                                        <div className="relative flex items-center">
                                            <Field
                                                type="number"
                                                autoComplete="off"
                                                name="maxPercent"
                                                placeholder="Phần trăm giảm giá tối đa"
                                                component={Input}
                                                className="w-full pr-12"
                                            />
                                            <span className="absolute right-1 text-gray-500">%</span>
                                        </div>
                                    </FormItem>

                                    <FormItem
                                        label="Giá tối thiểu"
                                        asterisk

                                        invalid={(errors.minAmount && touched.minAmount) as boolean}
                                        errorMessage={errors.minAmount?.toString()}
                                    >
                                        <Field
                                            type="number"
                                            autoComplete="off"
                                            name="minAmount"
                                            placeholder="Giá tối thiểu"
                                            component={Input}
                                            className="w-full pr-12"
                                        />
                                        <span className="absolute right-1 text-gray-500 mt-3">VNĐ</span>

                                    </FormItem>

                                    <div className="flex gap-4">
                                        <FormItem
                                            label="Ngày Bắt Đầu"
                                            asterisk
                                            invalid={(errors.startDate && touched.startDate) as boolean}
                                            errorMessage={errors.startDate?.toString()}
                                        >
                                            <Field name="startDate">
                                                {({ field, form }: FieldProps) => (
                                                    <Input
                                                        type="datetime-local" // Allows date and time selection
                                                        autoComplete="off"
                                                        value={field.value ? format(parseISO(field.value), "yyyy-MM-dd'T'HH:mm") : ''}
                                                        onChange={(e) => form.setFieldValue(field.name, e.target.value)}
                                                        placeholder="Start Date"
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>

                                        <FormItem
                                            label="Ngày Kết Thúc"
                                            asterisk
                                            invalid={(errors.endDate && touched.endDate) as boolean}
                                            errorMessage={errors.endDate?.toString()}
                                        >
                                            <Field name="endDate">
                                                {({ field, form }: FieldProps) => (
                                                    <Input
                                                        type="datetime-local" // Allows date and time selection
                                                        autoComplete="off"
                                                        value={field.value ? format(parseISO(field.value), "yyyy-MM-dd'T'HH:mm") : ''}
                                                        onChange={(e) => form.setFieldValue(field.name, e.target.value)}
                                                        placeholder="End Date"
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>
                                    </div>

                                    <FormItem
                                        label="Loại Phiếu Giảm Giá"
                                        asterisk
                                        invalid={(errors.typeTicket && touched.typeTicket) as boolean}
                                        errorMessage={errors.typeTicket?.toString()}
                                    >
                                        <Field name="typeTicket">
                                            {({ field, form }: FieldProps) => (
                                                <div className="flex items-center gap-4">
                                                    <label className="flex items-center space-x-2">
                                                        <Field
                                                            type="radio"
                                                            name="typeTicket"
                                                            value="Individual"
                                                            className="form-radio"
                                                            checked={field.value === 'Individual'}
                                                        />
                                                        <span>Cá Nhân</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2">
                                                        <Field
                                                            type="radio"
                                                            name="typeTicket"
                                                            value="Everybody"
                                                            className="form-radio"
                                                            checked={field.value === 'Everybody'}
                                                        />
                                                        <span>Mọi Người</span>
                                                    </label>
                                                </div>
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>
                                <div className="lg:col-span-2 border border-gray-300 rounded-lg p-4">
                                    <CustomerTable selectedCustomerIds={selectedCustomerIds} onSelectedCustomersChange={handleSelectedCustomersChange} />
                                </div>
                            </div>

                            <StickyFooter
                                className="-mx-8 px-8 flex items-center justify-between py-4"
                                stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            >

                                <div className="md:flex items-center">
                                    <Button
                                        color='blue'
                                        size="sm"
                                        variant="solid"
                                        loading={isSubmitting}
                                        type="submit"
                                    >
                                        Lưu
                                    </Button>
                                </div>
                            </StickyFooter>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </>
    )
})

VoucherForm.displayName = 'VoucherForm'

export default VoucherForm
