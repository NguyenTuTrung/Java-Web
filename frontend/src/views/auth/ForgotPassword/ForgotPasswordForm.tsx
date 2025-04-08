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

interface ForgotPasswordFormProps {
    disableSubmit?: boolean
    signInUrl?: string
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

const ForgotPasswordForm = ({ disableSubmit = false, signInUrl = '/auth/sign-in' }: ForgotPasswordFormProps) => {
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

    return (
        <div className="forgot-password-form">
            <ToastContainer />
            <div className="mb-6">
                {emailSent ? (
                    <>
                        <h3 className="mb-1">
                            Kiểm tra email của bạn</h3>
                        <p>
                            Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu tới email của bạn</p>
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
                {({ touched, errors, isSubmitting, setFieldValue }) => (
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
                                <ActionLink to={signInUrl}>Đăng nhập</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ForgotPasswordForm
