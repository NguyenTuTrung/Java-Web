import React, { MouseEvent, useState, useEffect } from 'react';
import { injectReducer } from '@/store/';
import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import { FormItem } from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import { toast } from 'react-toastify';;
import { Product } from '../store';
import { FormikErrors, FormikTouched } from 'formik';
import { apiCreateSalesProduct } from '@/services/ProductSalesService';
import RichTextEditor from '@/components/shared/RichTextEditor';
import reducer, {
    addProduct,
    toggleAddProductConfirmation,
    useAppDispatch,
    useAppSelector,
} from '../store';
injectReducer('addProduct', reducer);

type FormFieldsName = {
    product: Product | null;
    description: string;
};

type ProductAddConfirmationProps = {
    touched: FormikTouched<FormFieldsName>;
    errors: FormikErrors<FormFieldsName>;
    values: FormFieldsName;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    updateOptions: (field: string, newOption: Product) => void;
};

const ProductAddConfirmation = ({ setFieldValue, updateOptions }: ProductAddConfirmationProps) => {
    const dispatch = useAppDispatch();
    const { nameProduct: addedProduct, addProduct: openDialog } = useAppSelector((state) => ({
        nameProduct: state.addProduct.productAdd.nameProduct,
        addProduct: state.addProduct.productAdd.addProduct,
    }));

    const [inputValue, setInputValue] = useState<string>('');
    const [richTextEditorValue, setRichTextEditorValue] = useState<string>('');
    const [nameError, setNameError] = useState<string | null>(null);
    const [descriptionError, setDescriptionError] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState<boolean>(false);

    useEffect(() => {
        if (addedProduct) {
            setInputValue(addedProduct || '');
        }
    }, [addedProduct]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setInputValue(newName);
        if (newName.trim()) {
            setNameError(null);
        }
    };

    const onRichTextEditorChange = (newDescription: string) => {
        setRichTextEditorValue(newDescription);
        if (newDescription.trim()) {
            setDescriptionError(null);
        }
    };

    const onDialogClose = (e: MouseEvent) => {
        dispatch(toggleAddProductConfirmation(false));
        resetForm();
    };

    const resetForm = () => {
        setInputValue('');
        setRichTextEditorValue('');
        setNameError(null);
        setDescriptionError(null);
    };

    const generateRandomCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length: 5 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    };

    const createProduct = (name: string, description: string): Product => ({
        id: Math.floor(Math.random() * 1000),
        code: generateRandomCode(),
        name: name,
        description: description,
        deleted: false,
        createdDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
    });

    const onAdd = async () => {
        if (isAdding) return;
        setIsAdding(true);

        let hasError = false;

        if (!inputValue.trim()) {
            setNameError('Tên sản phẩm không được để trống');
            hasError = true;
        } else {
            setNameError(null);
        }

        if (!richTextEditorValue.trim()) {
            setDescriptionError('Mô tả sản phẩm không được để trống');
            hasError = true;
        } else {
            setDescriptionError(null);
        }

        if (hasError) {
            setIsAdding(false);
            return;
        }

        const newProduct = createProduct(inputValue, richTextEditorValue);

        try {
            const resultAction = await dispatch(addProduct({ ProductData: newProduct, apiFunc: apiCreateSalesProduct }));

            if (addProduct.fulfilled.match(resultAction)) {
                const newlyAddedProduct = resultAction.payload;

                const newProductOption: Product = {
                    id: newlyAddedProduct.id,
                    code: newlyAddedProduct.code,
                    name: newlyAddedProduct.name,
                    description: newlyAddedProduct.description,
                    deleted: false,
                    createdDate: newlyAddedProduct.createdDate || new Date().toISOString(),
                    modifiedDate: newlyAddedProduct.modifiedDate || new Date().toISOString(),
                };

                 setFieldValue('product', newProductOption);
                 updateOptions('product', newProductOption);  
                 setFieldValue('description', newProductOption.description);

                toast.success(`Thành công thêm sản phẩm ${newProductOption.name}.`);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định!!!';
            toast.error(` ${errorMessage}`);
        } finally {
            setIsAdding(false);
            resetForm();
            dispatch(toggleAddProductConfirmation(false));
        }
    };


    return ( 
        <Dialog
            isOpen={openDialog}
            onClose={onDialogClose}
            shouldCloseOnEsc={false}
            shouldCloseOnOverlayClick={false}
            onRequestClose={onDialogClose}
        >
            <h5 className="mb-4">Thêm nhanh sản phẩm</h5>
            <FormItem label="Tên sản phẩm">
                <Input value={inputValue || ''} onChange={onInputChange} className={nameError ? 'border-red-500' : ''} />
                {nameError && <p className="text-red-500">{nameError}</p>}
            </FormItem>
            <FormItem label="Mô tả sản phẩm" labelClass="!justify-start">
                <RichTextEditor
                    value={richTextEditorValue}
                    onChange={onRichTextEditorChange}
                    style={{ border: descriptionError ? '1px solid red' : 'none' }}
                />
                {descriptionError && <p className="text-red-500">{descriptionError}</p>}
            </FormItem>

            <div className="text-right mt-6">
                <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onDialogClose}>
                    Hủy bỏ
                </Button>
                <Button
                    style={{ backgroundColor: 'rgb(79, 70, 229)', height: '40px' }}
                    variant="solid"
                    onClick={onAdd}
                    disabled={isAdding} 
                >
                    Xác nhận
                </Button>
            </div>
        </Dialog>
    );
};

export default ProductAddConfirmation;
