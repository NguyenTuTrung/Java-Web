import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik'
import { format, parseISO } from 'date-fns'

type FormFieldsName = {
    name: string
    startDate: string
    endDate: string
    typeTicket: string
    code: string
    quantity: number
    maxPercent: number
    minAmount: number
}

type BasicInformationFields = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
}

const BasicInformationFields = (props: BasicInformationFields) => {
    const { touched, errors } = props

    return (
        <AdaptableCard divider className="mb-4">
            <FormItem
                asterisk
                label="Tên Phiếu Giảm Giá:"
                invalid={(errors.name && touched.name) as boolean}
                errorMessage={errors.name}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="name"
                    placeholder="Tên phiếu giảm giá..."
                    component={Input}
                    className="w-full"
                />
            </FormItem>
            <FormItem
                label="Mã Phiếu Giảm Giá:"
                invalid={(errors.code && touched.code) as boolean}
                errorMessage={errors.code}
            >
                <div className="relative group"> 
                    <Field
                        type="text"
                        autoComplete="off"
                        name="code"
                        placeholder="Mã phiếu giảm giá...."
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
                errorMessage={errors.quantity}
            >
                <Field
                    type="number"
                    autoComplete="off"
                    name="quantity"
                    placeholder="Số Lượng"
                    component={Input}
                    className="w-full "
                />
            </FormItem>

            <FormItem
                label="Phần trăm giảm giá tối đa"
                asterisk
                invalid={(errors.maxPercent && touched.maxPercent) as boolean}
                errorMessage={errors.maxPercent}
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
                errorMessage={errors.minAmount}
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
                    errorMessage={errors.startDate}
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
                    errorMessage={errors.endDate}
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
                errorMessage={errors.typeTicket}
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
        </AdaptableCard>
    )
}

export default BasicInformationFields
