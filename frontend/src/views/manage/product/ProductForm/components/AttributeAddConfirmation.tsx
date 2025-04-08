import reducer, {
    addAttribute,
    toggleAddAttributeConfirmation,
    useAppDispatch,
    useAppSelector,
} from '../store';
import { injectReducer } from '@/store/';
import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import { MouseEvent } from 'react';
import { FormItem } from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import { toast } from 'react-toastify';
import { Option } from '../store';
import { FormikErrors, FormikTouched } from 'formik';
import {
    apiCreateSalesBrand,
    apiCreateSalesOrigin,
    apiCreateSalesSize,
    apiCreateSalesColor,
    apiCreateSalesStyle,
    apiCreateSalesMaterial,
    apiCreateSalesCollar,
    apiCreateSalesSleeve,
    apiCreateSalesTexture,
    apiCreateSalesThickness,
    apiCreateSalesElasticity,
} from '@/services/ProductSalesService';

injectReducer('addAttribute', reducer);

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
};

type OrganizationFieldsProps = {
    touched: FormikTouched<FormFieldsName>;
    errors: FormikErrors<FormFieldsName>;
    values: FormFieldsName;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    updateOptions: (field: string, newOption: Option) => void;
};

const AttributeAddConfirmation = ({ setFieldValue, updateOptions, ...props }: OrganizationFieldsProps) => {
    const dispatch = useAppDispatch();
    const { dataAttribute: addedAttribute, labelAttribute, nameAttribute, addAttribute: openDialog } = useAppSelector((state) => ({
        dataAttribute: state.addAttribute.attributeAdd.dataAttribute,
        labelAttribute: state.addAttribute.attributeAdd.labelAttribute,
        nameAttribute: state.addAttribute.attributeAdd.nameAttribute,
        addAttribute: state.addAttribute.attributeAdd.addAttribute,
    }));

    const onDialogClose = (e: MouseEvent) => {
        dispatch(toggleAddAttributeConfirmation(false));
    };

    const onAdd = async () => {
        let apiFunc;
        switch (nameAttribute) {
            case 'brand':
                apiFunc = apiCreateSalesBrand;
                break;
            case 'origin':
                apiFunc = apiCreateSalesOrigin;
                break;
            case 'style':
                apiFunc = apiCreateSalesStyle;
                break;
            case 'material':
                apiFunc = apiCreateSalesMaterial;
                break;
            case 'collar':
                apiFunc = apiCreateSalesCollar;
                break;
            case 'sleeve':
                apiFunc = apiCreateSalesSleeve;
                break;
            case 'texture':
                apiFunc = apiCreateSalesTexture;
                break;
            case 'thickness':
                apiFunc = apiCreateSalesThickness;
                break;
            case 'elasticity':
                apiFunc = apiCreateSalesElasticity;
                break;
            case 'size':
                apiFunc = apiCreateSalesSize;
                break;
            case 'color':
                apiFunc = apiCreateSalesColor;
                break;
            default:
                toast.error('Không có chức năng API cho thuộc tính này!!');
                return;
        }

        if (!addedAttribute) {
            toast.error('Không có dữ liệu thuộc tính để thêm!!');
            return;
        }

        try {
            const resultAction = await dispatch(addAttribute({ AttributeData: addedAttribute, apiFunc }));

            if (addAttribute.fulfilled.match(resultAction)) {
                const newlyAddedAttribute = resultAction.payload;

                const newAttributeOption: Option = {
                    id: newlyAddedAttribute.id,
                    code: newlyAddedAttribute.code,
                    name: newlyAddedAttribute.name,
                    deleted: false,
                };

                const fieldName = nameAttribute === 'brand' || nameAttribute === 'origin' || nameAttribute === 'style' ||
                    nameAttribute === 'material' || nameAttribute === 'collar' ||
                    nameAttribute === 'sleeve' || nameAttribute === 'texture' ||
                    nameAttribute === 'thickness' || nameAttribute === 'elasticity'
                    ? nameAttribute : nameAttribute === 'size' ? 'size' : 'color';

                if (nameAttribute === 'size' || nameAttribute === 'color') {
                    const currentValues = props.values[nameAttribute] || [];
                    const updatedValues = [...currentValues, newAttributeOption];
                    setFieldValue(fieldName, updatedValues);
                } else {
                    setFieldValue(fieldName, newAttributeOption);
                }

                updateOptions(fieldName, newAttributeOption);
                toast.success(` Thành công thêm  ${labelAttribute}  ${newAttributeOption.name}.`);
            } else {
                throw new Error("Failed to add attribute");
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định!!!';
            toast.error(` ${errorMessage}`);
        } finally {
            dispatch(toggleAddAttributeConfirmation(false));
        }
    };

    return (
        <Dialog
            isOpen={openDialog}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            shouldCloseOnEsc={false}
            shouldCloseOnOverlayClick={false}
        >
            <h5 className="mb-4">Thêm nhanh {labelAttribute}</h5>
            <FormItem label={`Tên ${labelAttribute}`}>
                <Input placeholder={addedAttribute?.name || ''} disabled />
            </FormItem>
            <div className="text-right mt-6">
                <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onDialogClose}>
                    Hủy bỏ
                </Button>
                <Button
                    style={{ backgroundColor: 'rgb(79, 70, 229)', height: '40px' }}
                    variant="solid"
                    onClick={onAdd}
                >
                    Xác nhận
                </Button>
            </div>
        </Dialog>
    );
};

export default AttributeAddConfirmation;
