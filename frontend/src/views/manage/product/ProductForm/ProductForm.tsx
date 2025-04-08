import { forwardRef, useState, useEffect } from 'react';
import { FormContainer } from '@/components/ui/Form';
import Button from '@/components/ui/Button';
import StickyFooter from '@/components/shared/StickyFooter';
import { Form, Formik, FormikProps } from 'formik';
import BasicInformationFields from './components/BasicInformationFields';
import OrganizationFields from './components/OrganizationFields';
import DetailedProductList from './components/DetailedProductList';
import type { Option, DetailedProduct,Product } from './store';
import { AiOutlineSave } from 'react-icons/ai';
import * as Yup from 'yup';
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import { v4 as uuidv4 } from 'uuid';
import reducer, {
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
    setCombinations,
} from './store';
import { injectReducer } from '@/store/';

injectReducer('optionList', reducer);
injectReducer('dataDetailedProduct', reducer);

type Options = {
    id: number;
    code: string;
    name: string;
    deleted: boolean;
    // createdDate: string;
    // modifiedDate: string;
};



type InitialData = {
    id?: number;
    code?: string;
    product?: Product | null;
    size: Options[];
    color: Options[];
    brand?: Options | null;
    collar?: Options | null;
    elasticity?: Options | null;
    material?: Options | null;
    origin?: Options | null;
    sleeve?: Options | null;
    style?: Options | null;
    texture?: Options | null;
    thickness?: Options | null;
    price?: number;
    quantity?: number; 
    mass?:number;
    description?:string;

};

export type FormModel = DetailedProduct
export type SetSubmitting = (isSubmitting: boolean) => void
type ProductFormProps = {
    initialData?: InitialData; 
    onDiscard?: () => void;
    onFormSubmit: (formData: FormModel[], setSubmitting: SetSubmitting) => void
};

const validationSchema = Yup.object().shape({
    product: Yup.object().nullable().required('Tên sản phẩm là bắt buộc!'),
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
    color: Yup.array()
        .nullable()
        .required('Màu sắc là bắt buộc!')
        .min(1, 'Cần chọn ít nhất một màu sắc!'),
    size: Yup.array()
        .nullable()
        .required('Kích thước là bắt buộc!')
        .min(1, 'Cần chọn ít nhất một kích thước!'),
});

const ProductForm = forwardRef<FormikProps<any>, ProductFormProps>((props, ref) => {
    const {
        initialData = {
            id: 0,
            name: '',
            code: '',
            product: null,
            size: [],
            color: [],
            brand: null,
            collar: null,
            elasticity: null,
            material: null,
            origin: null,
            sleeve: null,
            style: null,
            texture: null,
            thickness: null,
            mass:500,
            price: 100000,
            quantity: 40,
            description:''
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

    const combine = useAppSelector ((state)=>state.dataDetailedProduct.detailedProduct)
    useEffect(()=>{
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
    }, [combine])

    const mapOptions = (items: Option[] | undefined) => {
        return items?.map(item => ({
            label: item.name,
            value: item,
        })) || [];
    };
    const mapProducts = (items: Product[] | undefined) => {
        return items?.map(item => ({
            label: item.name,
            value: item,
        })) || [];
    };

    const combinedData = {
        products: mapProducts(productData),
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
 
    const newCode = () => uuidv4();

    let currentId = 0;
    const newId = () => ++currentId;

    const generateCombinations = (colors: Options[], sizes: Options[], initialData: InitialData): DetailedProduct[] => {
        return colors.flatMap(color =>
            sizes.map(size => ({
                id: newId(),
                code: newCode(),
                product: initialData.product || null,
                color,
                size,
                brand: initialData.brand || null,
                collar: initialData.collar || null,
                elasticity: initialData.elasticity || null,
                material: initialData.material || null,
                origin: initialData.origin || null,
                sleeve: initialData.sleeve || null,
                style: initialData.style || null,
                texture: initialData.texture || null,
                thickness: initialData.thickness || null,
                price: initialData.price || 0, 
                quantity: initialData.quantity || 0,
                mass: initialData.mass || 0,
                images:[],
                deleted: false,
                createdDate: new Date().toISOString(),
                modifiedDate: new Date().toISOString(),
            }))
        );
    };
    const combinations = useAppSelector((state) => state.dataDetailedProduct.detailedProduct);
    

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
                color: initialData.color || [],
                size: initialData.size || [],
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                onFormSubmit?.(combinations.data, setSubmitting)
                dispatch(setCombinations([])); 
            }}
        >
            {({ values, touched, errors, isSubmitting, setFieldValue }) => {
                useEffect(() => {
                    if (
                        values.color.length > 0 &&
                        values.size.length > 0 &&
                        values.product &&
                        values.brand &&
                        values.origin &&
                        values.style &&
                        values.material &&
                        values.collar &&
                        values.sleeve &&
                        values.texture &&
                        values.thickness &&
                        values.elasticity
                    ) {
                        const combinations =  generateCombinations(values.color, values.size, values);
                        dispatch(setCombinations(combinations)); 
                    }
                     else
                     {
                        dispatch(setCombinations([]));
                    }
                }, [values]);

                const productCombinations = useAppSelector((state) => state.dataDetailedProduct.detailedProduct.data) || [];

                return (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="lg:col-span-1">
                                    <BasicInformationFields
                                        touched={touched}
                                        errors={errors}
                                        values={values}
                                        setFieldValue={setFieldValue}
                                        data={combinedData}
                                    />
                                    <OrganizationFields
                                        touched={touched}
                                        errors={errors}
                                        values={values}
                                        setFieldValue={setFieldValue}
                                        data={combinedData}
                                    />
                                </div>
                                {productCombinations.length > 0 ? (
                                    <div className="lg:col-span-1">
                                        <DetailedProductList
                                            productCombinations={productCombinations}
                                            errors={errors}
                                            touched={touched}
                                        />
                                    </div>
                                 ):(
                                        <div className="flex flex-col justify-center items-center h-full">
                                            <DoubleSidedImage
                                                className="max-w-[200px]"
                                                src="/img/others/no-mail-selected.png"
                                                darkModeSrc="/img/others/no-mail-selected-dark.png"
                                            />
                                            <div className="mt-4 text-2xl font-semibold">
                                                Chọn các thuộc tính để hiển thị sản phẩm chi tiết.
                                            </div>
                                        </div>
                                 )
                                 } 
                            </div>
                            <StickyFooter
                                className="-mx-8 px-8 flex items-center justify-between py-4"
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
                                    <Button
                                        size="sm"
                                        className="ltr:mr-3 rtl:ml-3"
                                        loading={isSubmitting}
                                        icon={<AiOutlineSave />}
                                        type="submit"
                                        variant="solid"
                                        style={{ backgroundColor: 'rgb(79, 70, 229)'}}
                                    >
                                        Lưu 
                                    </Button>
                                </div>
                            </StickyFooter>
                        </FormContainer>
                    </Form>
                );
            }}
        </Formik>
    );

});

ProductForm.displayName = 'ProductForm';

export default ProductForm;
