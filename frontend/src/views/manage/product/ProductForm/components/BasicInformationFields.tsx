import { useEffect, useState } from 'react';
import AdaptableCard from '@/components/shared/AdaptableCard';
import RichTextEditor from '@/components/shared/RichTextEditor';
import { FormItem } from '@/components/ui/Form';
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik';
import Select from '@/components/ui/Select';
import { Option, Product, ProductFromData } from '../store';
import { useAppDispatch, useAppSelector } from '../store';
import { setProductData, toggleAddProductConfirmation, setNameProduct } from '../store';
import ProductAddConfirmation from './ProductAddConfirmation';
import CreatableSelect from 'react-select/creatable';

type FormFieldsName = {
    product: Product | null;
    description: string;
};

type BasicInformationFieldsProps = {
    touched: FormikTouched<FormFieldsName>;
    errors: FormikErrors<FormFieldsName>;
    values: FormFieldsName;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    data?: {
        products: { label: string; value: Product }[] | undefined;
    };
};

const BasicInformationFields = ({ touched, errors, values, setFieldValue, data }: BasicInformationFieldsProps) => {
    const dispatch = useAppDispatch();
    const [products, setProducts] = useState(data?.products || []);


    useEffect(() => {
        console.log(products)
    }, [products])


    useEffect(() => {
        if (data) {
            setProducts(data.products || []);

        }
    }, [data]);

    const handleCreate = (inputValue: string) => {
        dispatch(toggleAddProductConfirmation(true));
        dispatch(setNameProduct(inputValue));
    };

    const updateOptions = (field: string, newOption: Product) => {
        if (field === 'product') {
            const productNew = { label: newOption.name, value: newOption }
            setProducts((prev) => [productNew,...prev]);
        }
    };



    return (
        <AdaptableCard divider className="mb-4">
 
            <h5>Thông tin cơ bản</h5>
            <FormItem
                label="Tên sản phẩm"
                invalid={Boolean(errors.product && touched.product)}
                errorMessage={errors.product as string}
            >
                <Field name="product">
                    {({ field, form }: FieldProps) => (
                        <Select
                            isClearable
                            componentAs={CreatableSelect}
                            onCreateOption={handleCreate}
                            field={field}
                            form={form}
                            options={products}
                            value={values.product ? products.find(prod => prod.value.id === values.product?.id) : null}
                            onChange={(el) => {
                                if (el) {
                                    form.setFieldValue(field.name, el.value);
                                    form.setFieldValue('description', el.value.description)
                                } else {
                                    form.setFieldValue(field.name, null);
                                }
                            }}
                            placeholder="Tên sản phẩm..."
                            formatCreateLabel={(inputValue) => `Thêm nhanh "${inputValue}"`}
                        />
                    )}
                </Field>
            </FormItem>
            <FormItem
                label="Mô tả sản phẩm"
                labelClass="!justify-start"
                invalid={Boolean(errors.description && touched.description)}
                errorMessage={errors.description}
            >
                <Field name="description">
                    {({ field, form }: FieldProps) => (
                        <RichTextEditor
                            value={field.value}
                            onChange={(val) => form.setFieldValue(field.name, val)}
                            readOnly
                        />
                    )}
                </Field>
            </FormItem>
            <ProductAddConfirmation
                setFieldValue={setFieldValue}
                updateOptions={updateOptions}
                touched={touched}
                errors={errors}
                values={values}
            />
        </AdaptableCard>
    );
};

export default BasicInformationFields;
