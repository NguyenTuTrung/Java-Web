import AdaptableCard from '@/components/shared/AdaptableCard'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import {
    Field,
    FormikErrors,
    FormikTouched,
    FieldProps,
    FieldInputProps,
} from 'formik'
import type { ComponentType } from 'react'
import type { InputProps } from '@/components/ui/Input'

type FormFieldsName = {
    price: number;
    quantity: number;
}

type PricingFieldsProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
}

const PriceInput = (props: InputProps) => {
    return <Input {...props} value={props.field.value} prefix="$" />
}

const NumberInput = (props: InputProps) => {
    return <Input {...props} value={props.field.value} />
}
const NumericFormatInput = ({
    onValueChange,
    ...rest
}: Omit<NumericFormatProps, 'form'> & {
    form: any
    field: FieldInputProps<unknown>
}) => {
    return (
        <NumericFormat
            customInput={Input as ComponentType}
            type="text"
            autoComplete="off"
            onValueChange={onValueChange}
            {...rest}
        />
    )
}

const PricingFields = (props: PricingFieldsProps) => {
    const { touched, errors } = props

    return (
        <AdaptableCard divider className="mb-4">
            <h5>Thông tin sản phẩm</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                    <FormItem
                        label="Số lượng"
                        invalid={Boolean(errors.quantity && touched.quantity)}
                        errorMessage={errors.quantity as string}
                    >
                        <Field name="quantity">
                            {({ field, form }: FieldProps) => {
                                return (
                                    <NumericFormatInput
                                        form={form}
                                        field={field}
                                        placeholder="Số lượng"
                                        customInput={
                                            NumberInput as ComponentType
                                        }
                                        onValueChange={(e) => {
                                            form.setFieldValue(
                                                field.name,
                                                e.value
                                            )
                                        }}
                                    />
                                )
                            }}
                        </Field>
                    </FormItem>
                </div>
                <div className="col-span-1">
                    <FormItem
                        label="Giá"
                        invalid={(errors.price && touched.price) as boolean}
                        errorMessage={errors.price}
                    >
                        <Field name="price">
                            {({ field, form }: FieldProps) => {
                                return (
                                    <NumericFormatInput
                                        form={form}
                                        field={field}
                                        placeholder="Giá"
                                        customInput={
                                            PriceInput as ComponentType
                                        }
                                        onValueChange={(e) => {
                                            form.setFieldValue(
                                                field.name,
                                                e.value
                                            )
                                        }}
                                    />
                                )
                            }}
                        </Field>
                    </FormItem>
                </div>
            </div>
         
        </AdaptableCard>
    )
}

export default PricingFields
