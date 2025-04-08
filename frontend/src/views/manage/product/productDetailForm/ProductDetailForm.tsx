
import { forwardRef, useState, useEffect } from 'react';
import { Form, Formik, FormikProps } from 'formik';
import { FormContainer } from '@/components/ui/Form';
import { injectReducer } from '@/store/';
import Button from '@/components/ui/Button';
import StickyFooter from '@/components/shared/StickyFooter';
import OrganizationFields from './components/OrganizationFields';
import ProductDetailImages from './components/ProductDetailImages';
import BasicInformationFields from './components/BasicInformationFields'
import PricingFields from './components/PricingFields'
import cloneDeep from 'lodash/cloneDeep'
import * as Yup from 'yup';
import reducer, {
    Option,
    Image,
    Product,
    getProductData,
    getBrandData,
    getOriginData,
    getStyleData,
    getCollarData,
    getSleeveData,
    getThicknessData,
    getTextureData,
    getElasticityData,
    getColorData,
    getSizeData,
    getMaterialData, 
    useAppDispatch,
    useAppSelector,
} from './store';
import { useHasRole } from '@/utils/permission'

injectReducer('optionList', reducer);


type InitialData = {
    id: number;
    code: string;
    product?: Product | null;
    size: Option | undefined;   
    color:  Option | undefined;
    brand?: Option | null;
    collar?: Option | null;
    elasticity?: Option | null;
    material?: Option | null;
    origin?: Option | null;
    sleeve?: Option | null;
    style?: Option | null;
    texture?: Option | null;
    thickness?: Option | null;
    images?: Image[] | [];
    price: number;
    mass: number;
    quantity: number;
    deleted?: boolean;
    createdDate: string;
    modifiedDate: string;

};

export type FormModel = InitialData
export type SetSubmitting = (isSubmitting: boolean) => void

type ProductFormProps = {
    initialData?: InitialData;
    onDiscard?: () => void;
    onFormSubmit: (formData: FormModel, setSubmitting: SetSubmitting) => void
};

const validationSchema = Yup.object().shape({
    brand: Yup.object().nullable().required('Thương hiệu là bắt buộc!'),
    origin: Yup.object().nullable().required('Xuất xứ là bắt buộc!'),
    style: Yup.object().nullable().required('Kiểu dáng là bắt buộc!'),
    material: Yup.object().nullable().required('Chất liệu là bắt buộc!'),
    collar: Yup.object().nullable().required('Kiểu cổ áo là bắt buộc!'),
    sleeve: Yup.object().nullable().required('Kiểu tay áo là bắt buộc!'),
    texture: Yup.object().nullable().required('Kết cấu vải là bắt buộc!'),
    thickness: Yup.object().nullable().required('Độ dày vải là bắt buộc!'),
    elasticity: Yup.object().nullable().required('Độ đàn hồi vải là bắt buộc!'),
    mass: Yup.number()
        .required('Khối lượng là bắt buộc!')
        .typeError('Khối lượng phải là số!')
        .positive('Khối lượng phải là số dương!'),
    price: Yup.number()
        .required('giá là bắt buộc!')
        .typeError('giá phải là số!')
        .positive('giá phải là số dương!'),
    quantity: Yup.number()
        .required('Số lượng là bắt buộc!')
        .typeError('Số lượng  phải là số!')
        .positive('Số lượng phải là số dương!'),
    color: Yup.object().nullable().required('Màu sắc là bắt buộc!'),
    size: Yup.object().nullable().required('Kích thước là bắt buộc!'),
});

const ProductDetailForm = forwardRef<FormikProps<any>, ProductFormProps>((props, ref) => {

    const {
        initialData = {
            id: 0,
            name: '',
            code: '',
            product: null,
            size: null,
            color: null,
            brand: null,
            collar: null,
            elasticity: null,
            material: null,
            origin: null,
            sleeve: null,
            style: null,
            texture: null,
            thickness: null,
            images:null,
            mass: 500,
            price: 100000,
            quantity: 40,
            description: ''
        },
        onFormSubmit,
        onDiscard,
    } = props;

    const dispatch = useAppDispatch();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        dispatch(getProductData());
        dispatch(getBrandData());
        dispatch(getOriginData());
        dispatch(getStyleData());
        dispatch(getCollarData());
        dispatch(getSleeveData());
        dispatch(getThicknessData());
        dispatch(getTextureData());
        dispatch(getElasticityData());
        dispatch(getColorData());
        dispatch(getSizeData());
        dispatch(getMaterialData());
    };


    const {
        productData,
        brandData,
        originData,
        styleData,
        collarData,
        sleeveData,
        thicknessData,
        textureData,
        elasticityData,
        colorData,
        sizeData,
        materialData,
    } = useAppSelector((state) => state.optionList.options);

    const mapOptions = (items: Option[] | undefined) => {
        return items?.map(item => ({
            label: item.name,
            value: item,
        })) || [];
    };

    const combinedData = {
        brands: mapOptions(brandData),
        origins: mapOptions(originData),
        styles: mapOptions(styleData),
        collars: mapOptions(collarData),
        sleeves: mapOptions(sleeveData),
        thicknesses: mapOptions(thicknessData),
        textures: mapOptions(textureData),
        elasticities: mapOptions(elasticityData),
        colors: mapOptions(colorData),
        sizes: mapOptions(sizeData),
        materials: mapOptions(materialData),
    }; 
   
    return (
        <Formik
            innerRef={ref}
            initialValues={{
                ...initialData,
                code: initialData.code || '',
                price: initialData.price || 0,
                mass: initialData.mass || 0,
                quantity: initialData.quantity || 0,
                product: initialData.product || null,
                brand: initialData.brand || null,
                origin: initialData.origin || null,
                style: initialData.style || null,
                material: initialData.material || null,
                collar: initialData.collar || null,
                sleeve: initialData.sleeve || null,
                texture: initialData.texture || null,
                thickness: initialData.thickness || null,
                elasticity: initialData.elasticity || null,
                color: initialData.color || null,
                size: initialData.size || null,
                images: initialData.images|| [],
                description: initialData.product?.description||null
            }}
            validationSchema={validationSchema}
            onSubmit={(values: FormModel, { setSubmitting }) => {
                const formData = cloneDeep(values)
              
                onFormSubmit?.(formData, setSubmitting)
            }}
        >
            {({ values, touched, errors, isSubmitting, setFieldValue }) => {
                return (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="lg:col-span-1">
                                    <OrganizationFields 
                                        touched={touched}
                                        errors={errors}
                                        values={values}
                                        setFieldValue={setFieldValue}
                                        data={combinedData}
                                    />
                                    <BasicInformationFields touched={touched}
                                        errors={errors}
                                        values={values}
                                        setFieldValue={setFieldValue}
                                         />
                                </div>
                                <div className="lg:col-span-1">
                                    <PricingFields
                                     touched={touched}
                                     errors={errors} />
                                    <ProductDetailImages values={values}/>
                                </div>
                               
                            </div>
                            <StickyFooter
                                className=" px-8 flex items-center justify-between py-4"
                                stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            >
                                <div> </div>
                                <div className="md:flex items-center">
                                    <Button
                                        size="sm"
                                        className="ltr:mr-3 rtl:ml-3"
                                        type="button"
                                        onClick={() => onDiscard?.()}
                                    >
                                        Quay lại
                                    </Button>
                                    {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
                                    <div hidden={!useHasRole(["ROLE_ADMIN"])}>
                                        <Button
                                            size="sm"
                                            className="ltr:mr-3 rtl:ml-3"
                                            loading={isSubmitting}
                                            // icon={<AiOutlineSave />}
                                            type="submit"
                                            variant="solid"
                                            style={{ backgroundColor: 'rgb(79, 70, 229)' }}
                                        >
                                            Lưu
                                        </Button>
                                    </div>
                                </div>
                            </StickyFooter>
                        </FormContainer>
                    </Form> 
                );
            }}
        </Formik>
    );
   


})
ProductDetailForm.displayName = 'ProductDetailForm';
export default ProductDetailForm

