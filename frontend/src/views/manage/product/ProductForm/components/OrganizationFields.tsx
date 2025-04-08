import React, { useEffect, useState } from 'react';
import AdaptableCard from '@/components/shared/AdaptableCard';
import { FormItem } from '@/components/ui/Form';
import Select from '@/components/ui/Select';
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik';
import CreatableSelect from 'react-select/creatable';
import { useAppDispatch, useAppSelector } from '../store';
import AttributeAddConfirmation from './AttributeAddConfirmation';
import {
    setNameAttribute,
    setAttributeData,
    toggleAddAttributeConfirmation,
    setLabelAttribute,
} from '../store';
import type { Option } from '../store';
import { components, GroupBase } from 'react-select'
import type {
    ControlProps,
    OptionProps,
    MultiValueGenericProps,
} from 'react-select';
import Input from '@/components/ui/Input'
import { HiCheck } from 'react-icons/hi';

const { MultiValueLabel } = components;

// Component tùy chỉnh cho mỗi option của color
const CustomSelectOption = ({
    innerProps,
    label,
    data,
    isSelected,
}: OptionProps<{ label: string; value: Option }>) => {
    return (
        <div
            className={`flex items-center justify-between p-2 ${isSelected
                ? 'bg-gray-100 dark:bg-gray-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
            {...innerProps}
        >
            <div className="flex items-center">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: data.value.name }} />
                <span className="ml-2 rtl:mr-2">{label}</span>
            </div>
            {isSelected && <HiCheck style={{ color: 'rgb(79, 70, 229)' }} className="text-xl" />}

        </div>
    );
};

const CustomControlMulti = ({
    children,
    ...props
}: MultiValueGenericProps<{ label: string; value: Option }, true>) => {
    const { data } = props; // Ensure data is properly destructured
    return (
        <MultiValueLabel {...props}>
            <div className="inline-flex items-center">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: data.value.name }} />
                <span className="ml-1 rtl:mr-2">{children}</span>
            </div>
        </MultiValueLabel>
    );
};
type FormFieldsName = {
    brand: Option | null;
    origin: Option | null;
    style: Option | null;
    material: Option | null;
    collar: Option | null;
    sleeve: Option | null;
    texture: Option | null;
    thickness: Option | null;
    elasticity: Option | null;
    size: Option[] | null;
    color: Option[] | null;
    mass: number;
};

type OrganizationFieldsProps = {
    touched: FormikTouched<FormFieldsName>;
    errors: FormikErrors<FormFieldsName>;
    values: FormFieldsName;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    data?: {
        brands: { label: string; value: Option }[] | undefined;
        origins: { label: string; value: Option }[] | undefined;
        styles: { label: string; value: Option }[] | undefined; // Thêm styles vào type
        materials: { label: string; value: Option }[] | undefined; // Thêm materials vào type
        collars: { label: string; value: Option }[] | undefined; // Thêm collars vào type
        sleeves: { label: string; value: Option }[] | undefined; // Thêm sleeves vào type
        textures: { label: string; value: Option }[] | undefined; // Thêm textures vào type
        thicknesses: { label: string; value: Option }[] | undefined; // Thêm thicknesses vào type
        elasticities: { label: string; value: Option }[] | undefined; // Thêm elasticities vào type
        sizes: { label: string; value: Option }[] | undefined;
        colors: { label: string; value: Option }[] | undefined;
    };
};


const OrganizationFields = ({ touched, errors, values, setFieldValue, data }: OrganizationFieldsProps) => {
    const dispatch = useAppDispatch();
    const openDialog = useAppSelector((state) => state.addAttribute.attributeAdd.addAttribute);

    const [brands, setBrands] = useState(data?.brands || []);
    const [origins, setOrigins] = useState(data?.origins || []);
    const [styles, setStyles] = useState(data?.styles || []);
    const [materials, setMaterials] = useState(data?.materials || []);
    const [collars, setCollars] = useState(data?.collars || []);
    const [sleeves, setSleeves] = useState(data?.sleeves || []);
    const [textures, setTextures] = useState(data?.textures || []);
    const [thicknesses, setThicknesses] = useState(data?.thicknesses || []);
    const [elasticities, setElasticities] = useState(data?.elasticities || []);
    const [sizes, setSizes] = useState(data?.sizes || []);
    const [colors, setColors] = useState(data?.colors || []); // Thêm state cho colors

    useEffect(() => {
        if (data) {
            setBrands(data.brands || []);
            setOrigins(data.origins || []);
            setStyles(data.styles || []); // Thêm styles
            setMaterials(data.materials || []); // Thêm materials
            setCollars(data.collars || []); // Thêm collars
            setSleeves(data.sleeves || []); // Thêm sleeves
            setTextures(data.textures || []); // Thêm textures
            setThicknesses(data.thicknesses || []); // Thêm thicknesses
            setElasticities(data.elasticities || []); // Thêm elasticities
            setSizes(data.sizes || []);
            setColors(data.colors || []);
        }
    }, [data]);


    const generateRandomCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length: 5 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    };

    const createOption = (label: string): Option => ({
        id: Math.floor(Math.random() * 1000),
        code: generateRandomCode(),
        name: label,
        deleted: false,
        
    });

    const handleCreate = (inputValue: string, fieldLabel: string, fieldName:string ) => {
        const newOption = createOption(inputValue);
        dispatch(setAttributeData(newOption));
        dispatch(setLabelAttribute(fieldLabel));
        dispatch(setNameAttribute(fieldName));
        dispatch(toggleAddAttributeConfirmation(true));
    };

    const renderSelectField = (
        name: keyof FormFieldsName,
        label: string,
        options: { label: string; value: Option }[],
        isMulti: boolean = false,
        closeMenuOnSelect?: boolean
    ) => (
        <FormItem
            label={label}
            invalid={Boolean(errors[name] && touched[name])}
            errorMessage={errors[name] as string}
        >
            <Field name={name}>
                {({ field, form }: FieldProps) => {
                    const selectedValue = values[name];

                    // Lấy các option đã chọn
                    const selectedOptions = isMulti && Array.isArray(selectedValue)
                        ? options.filter(option => selectedValue.some(val => val.id === option.value.id))
                        : selectedValue && 'id' in selectedValue
                            ? [options.find(option => option.value.id === selectedValue.id) || null]
                            : [];

                    // Lọc các giá trị không phải là null
                    const filteredSelectedOptions = isMulti
                        ? selectedOptions.filter((option): option is { label: string; value: Option } => option !== null)
                        : selectedOptions.length > 0 ? selectedOptions[0] : null;
                    const defaultValue = (name !== 'color' && name !== 'size' && options.length > 0)
                        ? options[0]
                        : undefined;



                    useEffect(() => {
                        if (filteredSelectedOptions === null && defaultValue) {
                            form.setFieldValue(name, isMulti ? [defaultValue.value] : defaultValue.value);
                        }
                        console.log("moi chon")
                    }, [filteredSelectedOptions, defaultValue, form, name, isMulti, data]);
                    return (
                        <Select
                            isClearable
                            componentAs={CreatableSelect}
                            isMulti={isMulti}
                            components={{
                                Option: CustomSelectOption,
                                MultiValueLabel: CustomControlMulti,
                            }}
                            onCreateOption={(inputValue) => handleCreate(inputValue, label,name)}
                            field={field}
                            form={form}
                            options={options}
                            value={filteredSelectedOptions || defaultValue}
                            onChange={(newOptions) => {
                                if (isMulti) {
                                    const newValue = (newOptions as { label: string; value: Option }[]).map(option => option.value);
                                    form.setFieldValue(field.name, newValue);
                                } else {
                                    form.setFieldValue(field.name, newOptions ? (newOptions as { label: string; value: Option }).value : null);
                                    console.log(form.values)
                                }
                            }}
                            placeholder={`Chọn ${label.toLowerCase()}...`}
                            formatCreateLabel={(inputValue) => `Thêm nhanh "${inputValue}"`}
                            closeMenuOnSelect={closeMenuOnSelect}
                        />
                    );
                }}
            </Field>
        </FormItem>
    );

 

    return (
        <AdaptableCard divider isLastChild className="mb-4">
            <h5>Thuộc tính</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3"> {/* Thay đổi số cột để bao gồm color */}
                <div className="col-span-1">
                    {renderSelectField('brand', 'Thương hiệu', brands)} {/* Chỉ chọn 1 thương hiệu */}
                </div>
                <div className="col-span-1">
                    {renderSelectField('origin', 'Xuất xứ', origins)} {/* Chỉ chọn 1 xuất xứ */}
                </div>
                <div className="col-span-1">
                    {renderSelectField('style', 'Kiểu dáng', styles)}
                </div>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3"> {/* Thay đổi số cột để bao gồm color */}
                <div className="col-span-1">
                    {renderSelectField('material', 'Chất liệu', materials)}
                </div>
                <div className="col-span-1">
                    {renderSelectField('collar', 'Kiểu cổ áo', collars)}
                </div>
                <div className="col-span-1">
                    {renderSelectField('sleeve', 'KIểu tay áo', sleeves)}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3"> {/* Thay đổi số cột để bao gồm color */}
                <div className="col-span-1">
                    {renderSelectField('texture', 'Kết cấu', textures)}
                </div>
                <div className="col-span-1">
                    {renderSelectField('thickness', 'Độ dày', thicknesses)}
                </div>
                <div className="col-span-1">
                    {renderSelectField('elasticity', 'Độ co giãn', elasticities)}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* Thay đổi số cột để bao gồm color */}

                <div className="col-span-1">
                    <FormItem
                        label="Khối lượng"
                        invalid={Boolean(errors.mass && touched.mass)}
                        errorMessage={errors.mass as string}
                    >
                        <Field
                            type="text" 
                            autoComplete="off"
                            name="mass"
                            placeholder="Hãy điền khối lượng..."
                            component={Input}
                            suffix="gm"
                            
                        />
                    </FormItem>
                </div>
                <div className="col-span-1">
                    {renderSelectField('color', 'Màu sắc', colors, true, false)} 
                </div>
                <div className="col-span-1">
                    {renderSelectField('size', 'Kích thước', sizes, true, false)} 
                </div>
            </div>
            <AttributeAddConfirmation
                setFieldValue={setFieldValue}
                updateOptions={(field, newOption) => {
                    if (field === 'brand') {
                        setBrands((prev) => [{ label: newOption.name, value: newOption },...prev]);
                    } else if (field === 'origin') {
                        setOrigins((prev) => [  { label: newOption.name, value: newOption }, ...prev]);
                    } else if (field === 'size') {
                        setSizes((prev) => [  { label: newOption.name, value: newOption },...prev]);
                    } else if (field === 'color') {
                        setColors((prev) => [  { label: newOption.name, value: newOption },...prev]);
                    } else if (field === 'style') {
                        setStyles((prev) => [  { label: newOption.name, value: newOption },...prev]); 
                    } else if (field === 'material') {
                        setMaterials((prev) => [  { label: newOption.name, value: newOption },...prev]);
                    } else if (field === 'collar') {
                        setCollars((prev) => [  { label: newOption.name, value: newOption },...prev]);
                    } else if (field === 'sleeve') {
                        setSleeves((prev) => [  { label: newOption.name, value: newOption },...prev]); 
                    } else if (field === 'texture') {
                        setTextures((prev) => [  { label: newOption.name, value: newOption },...prev]); 
                    } else if (field === 'thickness') {
                        setThicknesses((prev) => [  { label: newOption.name, value: newOption },...prev]); 
                    } else if (field === 'elasticity') {
                        setElasticities((prev) => [  { label: newOption.name, value: newOption },...prev]); 
                    }
                }}
                touched={touched}
                errors={errors}
                values={values}
            />

        </AdaptableCard>
    );
};

export default OrganizationFields;
