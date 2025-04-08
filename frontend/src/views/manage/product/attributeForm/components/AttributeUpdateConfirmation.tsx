import reducer, {
    getAttributes,
    updateAttribute,
    toggleUpdateConfirmation,
    useAppDispatch,
    useAppSelector,
} from '../store';
import { injectReducer } from '@/store/';
import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import { FormItem } from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import { Form, Formik, FormikProps } from 'formik';
import Loading from '@/components/shared/Loading'
import { Field } from 'formik';
import { FormContainer } from '@/components/ui/Form';
import { AiOutlineSave } from 'react-icons/ai';
import * as Yup from 'yup';
import isEmpty from 'lodash/isEmpty'
import { toast } from 'react-toastify';
injectReducer('updateAttribute', reducer);

type AttributeUpdateConfirmationProps = {
    apiFunc: any;
    apiUpdate: any;
    label: string;
};

type AttributeData = {
    id: number;
    code: string;
    name: string;
    deleted: boolean;
    createdDate: string;
    modifiedDate: string;
};

const AttributeUpdateConfirmation = ({ apiFunc, label, apiUpdate }: AttributeUpdateConfirmationProps) => {
    const dispatch = useAppDispatch();
    const updateAttributeState = useAppSelector((state) => state.updateAttribute.attibuteUpdate.updateConfirmation);
    const loading = useAppSelector(
        (state) => state.updateAttribute.attibuteUpdate.loading
    );
    const onDialogClose = () => {
        dispatch(toggleUpdateConfirmation(false));
    };

    const selectedAttribute = useAppSelector(
        (state) => state.updateAttribute.attibuteUpdate.attributeData
    );

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Tên không được bỏ trống!'),

    });
    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.salesAttributeList.data.tableData
    )

    return (
        <Dialog
            isOpen={updateAttributeState}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            shouldCloseOnEsc={false}
            shouldCloseOnOverlayClick={false}
        >
            <h5 className="mb-4">Sửa {label}</h5>
            <Loading loading={loading}>
                {!isEmpty(selectedAttribute) && (

                    <Formik
                        initialValues={{
                            ...selectedAttribute,
                        }}
                        validationSchema={validationSchema}
                        onSubmit={async (values: AttributeData, { setSubmitting }) => {
                            setSubmitting(true);
                            try {
                                const success = await updateAttribute(apiUpdate, { name: values.name }, values.id);
                                setSubmitting(false);
                                if (success) {
                                    const requestData = { pageIndex, pageSize, sort, query };
                                    dispatch(getAttributes({ apiFunc, requestData }));
                                    onDialogClose();
                                    toast.success(`Cập nhật ${ label } thành công`);
                                } else {
                                    onDialogClose();
                                    toast.error(`Lỗi cập nhật  ${ label }. Vui lòng thử lại.`);
                                }
                            } catch (error) {
                                setSubmitting(false);
                                console.error("Update failed:", error);
                            }
                        }}
                    >
                        {({ values, touched, errors, isSubmitting }) => (
                            <Form>
                                <FormContainer>
                                    <FormItem
                                        label={`Tên ${label}`}
                                        invalid={!!(errors.name && touched.name)}
                                        errorMessage={errors.name}
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="name"
                                            placeholder="Tên"
                                            component={Input}
                                        />
                                    </FormItem>
                                    <div
                                        className="-mx-8 px-8 flex items-center justify-between py-4"
                                    >
                                        <div> </div>
                              
                                    <div className="md:flex items-center mt-4">
                                        <Button
                                            size="sm" 
                                            className="ltr:mr-3 rtl:ml-3"
                                            type="button"
                                            onClick={onDialogClose}
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="solid"
                                            loading={isSubmitting}
                                            icon={<AiOutlineSave />}
                                            type="submit"
                                        >
                                            Lưu
                                        </Button>
                                    </div>
                                    </div>
                                </FormContainer>
                            </Form>
                        )}
                    </Formik>
                )}
            </Loading>
        </Dialog>
    );
};

export default AttributeUpdateConfirmation;
