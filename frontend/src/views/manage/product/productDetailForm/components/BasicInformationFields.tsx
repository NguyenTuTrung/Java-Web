import AdaptableCard from '@/components/shared/AdaptableCard'
import RichTextEditor from '@/components/shared/RichTextEditor'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik'
import { Product } from '../store'

type FormFieldsName = {
    product: Product | null;
    description: string;
}

type BasicInformationFields = {
    touched: FormikTouched<FormFieldsName>;
    errors: FormikErrors<FormFieldsName>;
    values: FormFieldsName;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  
};

const BasicInformationFields = (props: BasicInformationFields) => {
    const { touched, errors } = props

    return (
        <AdaptableCard divider >
            <h5>Mô tả sản phẩm </h5>
           
            <FormItem
                // label="description"
                labelClass="!justify-start"
                invalid={(errors.description && touched.description) as boolean}
                errorMessage={errors.description}
            >
                <Field name="description">
                    {({ field, form }: FieldProps) => (
                        <RichTextEditor
                            value={field.value}
                            onChange={(val) =>
                                form.setFieldValue(field.name, val)
                            }
                            readOnly
                        />
                    )}
                </Field>
            </FormItem>
        </AdaptableCard>
    )
}

export default BasicInformationFields
