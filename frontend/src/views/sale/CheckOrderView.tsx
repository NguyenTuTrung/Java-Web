import React, { Fragment } from 'react'
import { Input } from 'antd' // Assume you are using Ant Design for Input
import { HiSearch } from 'react-icons/hi'
import instance from '@/axios/CustomAxios'
import { useToastContext } from '@/context/ToastContext'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
    orderCode: Yup.string()
        .required('Mã đơn hàng là bắt buộc')
        .min(5, 'Mã đơn hàng phải có ít nhất 5 ký tự')
})

const CheckOrderView = () => {
    const { openNotification } = useToastContext()
    const navigate = useNavigate()

    // Function to handle form submission
    const getDetailOrder = (values, { setSubmitting }) => {
        instance.get(`orders/by-code/${values.orderCode}`)
            .then(response => {
                if (response.status === 200 && response.data) {
                    navigate(`/user/purchase/${response.data.code}`)
                }
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    openNotification('Không tìm thấy hóa đơn này')
                }
            })
            .finally(() => {
                setSubmitting(false)
            })
    }

    return (
        <Fragment>
            {/* Wrapper with background */}
            <div
                className="relative flex flex-col items-center justify-center min-h-[600px]"
            >
                {/* Main Background */}
                <div className="absolute top-0 left-0 w-full h-full -z-10">
                    <img
                        src="https://png.pngtree.com/thumb_back/fh260/background/20230616/pngtree-mobile-based-delivery-service-a-3d-render-concept-with-order-tracking-image_3607142.jpg"
                        alt="Background Illustration"
                        className="w-full h-full object-cover opacity-40"
                    />
                </div>
                {/* Nội dung chính */}
                <div className="z-10 flex flex-col items-center gap-10">
                    <h3 className="text-xl font-extrabold text-gray-800 mb-10 tracking-wide drop-shadow-lg text-center uppercase">
                        Tìm kiếm đơn hàng của bạn
                    </h3>
                    <Formik
                        initialValues={{ orderCode: '' }}
                        validationSchema={validationSchema}
                        onSubmit={getDetailOrder}
                    >
                        {({ isSubmitting }) => (
                            <Form className="bg-white shadow-xl p-8 rounded-2xl max-w-lg w-full transform hover:scale-105 transition-transform">
                                <div className="mb-6">
                                    <Field name="orderCode">
                                        {({ field }) => (
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    size="large"
                                                    suffix={
                                                        <button
                                                            variant="plain"
                                                            type="submit"
                                                            disabled={isSubmitting}
                                                            className="text-white bg-indigo-500 hover:bg-indigo-600 transition-colors rounded-full p-3"
                                                        >
                                                            <HiSearch size={24} />
                                                        </button>
                                                    }
                                                    placeholder="Nhập mã đơn hàng của bạn"
                                                    className="w-full border-4 border-indigo-400 focus:ring focus:ring-indigo-400 rounded-xl transition-all text-xl font-semibold"
                                                />
                                            </div>
                                        )}
                                    </Field>
                                    <ErrorMessage name="orderCode" component="div" className="text-red-500 mt-2 text-lg" />
                                </div>
                                <div className="text-center">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-8 py-3 text-2xl text-white bg-indigo-500 hover:bg-indigo-600 rounded-full transition-all font-bold shadow-md"
                                    >
                                        Tra cứu
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </Fragment>
    )
}

export default CheckOrderView
