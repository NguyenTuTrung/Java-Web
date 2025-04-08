import { useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import ActionLink from '@/components/shared/ActionLink'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'

interface ForgotPasswordModalProps {
    isOpen: boolean;
    setIsOpenLoginModal: React.Dispatch<React.SetStateAction<boolean>>
    setIsOpenForgotModal: React.Dispatch<React.SetStateAction<boolean>>
    onClose: () => void;
}

type ForgotPasswordFormSchema = {
    email: string
    verificationCode: string
    newPassword: string
}

const validationSchema = Yup.object().shape({
    email: Yup.string().required('Please enter your email').email('Invalid email address'),
    verificationCode: Yup.string().when('emailSent', {
        is: true,
        then: Yup.string().required('Please enter the verification code'),
    }),
    newPassword: Yup.string().when('emailSent', {
        is: true,
        then: Yup.string().required('Please enter your new password').min(6, 'Password must be at least 6 characters'),
    }),
})

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ 
    isOpen, 
    setIsOpenLoginModal, 
    setIsOpenForgotModal, 
    onClose 
}) => {
    const [emailSent, setEmailSent] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [showPasswordForm, setShowPasswordForm] = useState(false)

    const onSendMail = async (
        values: ForgotPasswordFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)
        try {
            const response = await axios.post('http://localhost:8080/api/v1/users/request-verification-code', {
                email: values.email,
            })
            if (response.status === 200) {
                setEmailSent(true)
                setShowPasswordForm(true)
                toast.success('Mã xác minh đã được gửi đến email của bạn')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra!'
            setMessage(errorMessage)
            toast.error(errorMessage)
        }
        setSubmitting(false)
    }

    const onChangePassword = async (
        values: ForgotPasswordFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)
        try {
            const response = await axios.post('http://localhost:8080/api/v1/users/reset-password/v2', {
                email: values.email,
                verificationCode: values.verificationCode,
                newPassword: values.newPassword,
            })
            if (response.status === 200) {
                toast.success('Mật khẩu của bạn đã được đặt lại thành công')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra!'
            setMessage(errorMessage)
            toast.error(errorMessage)
        }
        setSubmitting(false)
    }

    if (!isOpen) return null;

    return (
        <div className="bg-black/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 h-full items-center justify-center flex">
            <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                <div className="relative bg-white rounded-lg shadow">
                    <button
                        type="button"
                        className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                        onClick={onClose}
                    >
                        <svg
                            aria-hidden="true"
                            className="w-5 h-5"
                            fill="#c6c7c7"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>

                    <div className="p-5">
                        <ToastContainer />
                        <div className="mb-6">
                            {emailSent ? (
                                <>
                                    <h3 className="mb-1">Kiểm tra email của bạn</h3>
                                    <p>Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu tới email của bạn</p>
                                </>
                            ) : (
                                <>
                                    <h3 className="mb-1">Quên mật khẩu</h3>
                                    <p>Vui lòng nhập địa chỉ email của bạn để nhận mã xác minh</p>
                                </>
                            )}
                        </div>

                        {message && (
                            <Alert showIcon className="mb-4" type="danger">
                                {message}
                            </Alert>
                        )}

                        <Formik
                            initialValues={{ email: '', verificationCode: '', newPassword: '' }}
                            validationSchema={validationSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                if (!emailSent) {
                                    onSendMail(values, setSubmitting)
                                } else if (showPasswordForm) {
                                    onChangePassword(values, setSubmitting)
                                } else {
                                    setSubmitting(false)
                                }
                            }}
                        >
                            {({ touched, errors, isSubmitting }) => (
                                <Form>
                                    <FormContainer>
                                        {/* Email Field */}
                                        {!emailSent && !showPasswordForm && (
                                            <FormItem invalid={errors.email && touched.email} errorMessage={errors.email}>
                                                <Field
                                                    type="email"
                                                    autoComplete="off"
                                                    name="email"
                                                    placeholder="Email"
                                                    component={Input}
                                                />
                                            </FormItem>
                                        )}

                                        {/* Verification Code and New Password Fields */}
                                        {showPasswordForm && (
                                            <>
                                                <FormItem invalid={errors.verificationCode && touched.verificationCode} errorMessage={errors.verificationCode}>
                                                    <Field
                                                        type="text"
                                                        name="verificationCode"
                                                        placeholder="Verification Code"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                                <FormItem invalid={errors.newPassword && touched.newPassword} errorMessage={errors.newPassword}>
                                                    <Field
                                                        type="password"
                                                        name="newPassword"
                                                        placeholder="New Password"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                            </>
                                        )}

                                        <Button block loading={isSubmitting} variant="solid" type="submit">
                                            {emailSent ? 'Xác nhận' : 'Gửi Email'}
                                        </Button>
                                        <div className="mt-4 text-center">
                                            <span>Quay lại </span>
                                            <ActionLink onClick={() => {
                                                setIsOpenForgotModal(false)
                                                setIsOpenLoginModal(true)
                                            }}>
                                                Đăng nhập
                                            </ActionLink>
                                        </div>
                                    </FormContainer>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordModal