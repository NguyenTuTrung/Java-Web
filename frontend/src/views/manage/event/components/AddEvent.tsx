import { FormContainer, FormItem, Input } from '@/components/ui'
import DateTimepicker from '@/components/ui/DatePicker/DateTimepicker'
import Button from '@/components/ui/Button'
import dayjs from 'dayjs'
import { Field, Formik, Form, FormikHelpers } from 'formik'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import instance from '@/axios/CustomAxios'
import { useToastContext } from '@/context/ToastContext'

type EventDTO = {
    id: string;
    discountCode: string;
    name: string;
    discountPercent: number;
    startDate: string | null;
    endDate: string | null;
    quantityDiscount: number;
    status: string;
    productDTOS: ProductDTO[];
}

type ProductDTO = {
    id: string;
    code: string;
    name: string;
}

const AddEvent = () => {
    const initialProductDTOState: ProductDTO = {
        id: '',
        code: '',
        name: '',
    }

    const initialEventState: EventDTO = {
        id: '',
        discountCode: '',
        name: '',
        discountPercent: 0,
        startDate: null,
        endDate: null,
        quantityDiscount: 0,
        status: '',
        productDTOS: [initialProductDTOState],
    }

    const navigate = useNavigate();
    const [product, setProduct] = useState<ProductDTO[]>([]); // Ensure product is an array
    const [total, setTotal] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Tên đợt giảm giá là bắt buộc')
            .min(3, 'Tên phải có ít nhất 3 ký tự')
            .test("phone-unique", "Tên sự kiện đã tồn tại", async (name: string) => {
                // Gọi API kiểm tra name có trùng không
                const response = await instance.get(`/event/check-name`, { params: { name } });
                return !response.data.exists; // API trả về { exists: true: Tồn tại / false: chưa tồn tại }
            }),
        discountPercent: Yup.number()
            .required('Giá trị giảm là bắt buộc')
            .min(1, 'Giá trị giảm phải lớn hơn hoặc bằng 1')
            .max(100, 'Giá trị giảm không được vượt quá 100'),
        startDate: Yup.string().required('Ngày bắt đầu là bắt buộc'),
        endDate: Yup.string().required('Ngày kết thúc là bắt buộc')
    });


    useEffect(() => {
        fetchProductDTO(pageIndex, pageSize);
    }, [pageIndex, pageSize]);

    // api Product
    const fetchProductDTO = async (pageIndex: number, pageSize: number) => {
        try {
            const response = await instance.get(`/event/product-list`, {
                params: {
                    page: pageIndex,
                    size: pageSize
                }
            });
            // Ensure product is an array
            if (Array.isArray(response.data.content)) {
                setProduct(response.data.content);
                setTotal(response.data.totalElements);
            } else {
                setProduct([]); // Set empty array if not an array
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }
    const { openNotification } = useToastContext()

    const handleSubmit = async (values: EventDTO, { resetForm, setSubmitting }: FormikHelpers<EventDTO>) => {
        try {
            const productIds = selectedProducts;

            // Log giá trị startDate và endDate trước khi chuyển đổi
            console.log('Ngày bắt đầu (trước khi chuyển đổi):', values.startDate);
            console.log('Ngày kết thúc (trước khi chuyển đổi):', values.endDate);

            if (values.startDate && values.endDate) {
                if (dayjs(values.startDate, "HH:mm DD-MM-YYYY").toDate() > dayjs(values.endDate, "HH:mm DD-MM-YYYY").toDate() ) {
                    openNotification("Ngày bắt đầu phải trước ngày kết thúc", 'Thông báo', 'warning', 5000)
                    return;
                }
            }


            const formattedPayload = {
                name: values.name,
                discountPercent: values.discountPercent,
                startDate: values.startDate,
                endDate: values.endDate,
                productDTOS: productIds.map((id) => ({ id })) // Chỉ gửi ID của các sản phẩm được chọn
            }

            // **Log trước khi gửi dữ liệu lên backend**
            console.log('Dữ liệu đang gửi lên backend: ', formattedPayload)

            // Gửi yêu cầu POST với payload đã format
            const response = await instance.post('/event/save', formattedPayload)

            if (response.status === 200) {
                openNotification('Lưu thành công')
                resetForm()
                navigate('/admin/manage/event')
            }
        } catch (error) {
            console.error('Lỗi khi lưu sự kiện:', error)  // Log toàn bộ lỗi

            if (error.response) {
                console.error('Lỗi từ server:', error.response)
                console.error('Lỗi từ server:', error.response.data)
                openNotification(`Lỗi khi lưu sự kiện: ${error.response.data.error || error.response.data.message || error.response.data}`, 'Thông báo', 'warning', 5000)
            } else {
                toast.error('Lỗi khi kết nối với server')
            }
        } finally {
            setSubmitting(false) // Kết thúc trạng thái submitting
        }
    };



    // Thay đổi handleSelectProduct để chỉ lưu ID
    const handleSelectProduct = (product: ProductDTO, isSelected: boolean) => {
        setSelectedProducts((prev) =>
            isSelected
                ? [...prev, product.id] // Chỉ lưu id
                : prev.filter((id) => id !== product.id) // Loại bỏ id nếu không được chọn
        );
    };


    // Kiểm tra sản phẩm đã được chọn chưa:
    const isSelected = (id: string) => selectedProducts.includes(id);

    const handlePreviousPage = () => {
        if (pageIndex > 1) {
            setPageIndex((prev) => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (pageIndex < Math.ceil(total / pageSize)) {
            setPageIndex((prev) => prev + 1);
        }
    };

    return (
        <div className={'h-full'}>
            <Formik
                initialValues={initialEventState}
                validationSchema={validationSchema}
                enableReinitialize={true}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, resetForm, isSubmitting, values, errors, touched }) => (
                    <Form className={'h-full'}>
                        <h1 className="font-semibold text-xl mb-4 uppercase">Thêm đợt giảm giá</h1>
                        <div className="w-full bg-white p-6 shadow-md rounded-lg h-full">
                            <div className="lg:flex items-center justify-between mb-4">
                                <nav className="flex" aria-label="Breadcrumb">
                                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                        <li>
                                            <div className="flex items-center">
                                                <Link to="/" className="text-gray-700 hover:text-blue-600">
                                                    Trang Chủ
                                                </Link>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="flex items-center">
                                                <span className="mx-2">/</span>
                                                <Link to="/manage" className="text-gray-700 hover:text-blue-600">
                                                    Quản Lý
                                                </Link>
                                            </div>
                                        </li>
                                        <li aria-current="page">
                                            <div className="flex items-center">
                                                <span className="mx-2">/</span>
                                                <span className="text-gray-500">Thêm đợt giảm giá</span>
                                            </div>
                                        </li>
                                    </ol>
                                </nav>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="w-full lg:w-1/3 bg-white rounded-lg">
                                    <h4 className="font-medium text-xl mb-4">Thông tin đợt giảm giá</h4>
                                    <FormContainer>
                                        <FormItem
                                            asterisk label="Tên đợt giảm giá" invalid={!!errors.name && touched.name}
                                            errorMessage={errors.name}
                                        >
                                            <Field type="text" autoComplete="on" name="name" style={{ height: '44px' }}
                                                placeholder="Tên đợt giảm giá..." component={Input} />
                                        </FormItem>

                                        <FormItem
                                            asterisk label="Giá trị giảm(%)"
                                            invalid={!!errors.discountPercent && touched.discountPercent}
                                            errorMessage={errors.discountPercent}
                                        >
                                            <Field type="number" autoComplete="off" name="discountPercent"
                                                style={{ height: '44px' }}
                                                placeholder="Giá trị giảm(%)..." component={Input} />
                                        </FormItem>


                                        <FormItem
                                            asterisk
                                            label="Ngày bắt đầu"
                                            invalid={!!errors.startDate && touched.startDate}
                                            errorMessage={errors.startDate}
                                        >
                                            <Field name="startDate">
                                                {({ field, form }: any) => {
                                                    return (
                                                        <DateTimepicker onChange={(el) => {
                                                            console.log(el)
                                                            const date = dayjs(el)
                                                            const formattedDate = date.format('HH:mm DD-MM-YYYY')
                                                            console.log(formattedDate)
                                                            setFieldValue('startDate', formattedDate)
                                                        }} />

                                                    )
                                                }}
                                            </Field>
                                        </FormItem>

                                        <FormItem
                                            asterisk
                                            label="Ngày kết thúc"
                                            invalid={!!errors.endDate && touched.endDate}
                                            errorMessage={errors.endDate}
                                        >
                                            <Field name="endDate">
                                                {({ field, form }: any) => {
                                                    return (
                                                        <DateTimepicker onChange={(el) => {
                                                            console.log(el)
                                                            const date = dayjs(el)
                                                            const formattedDate = date.format('HH:mm DD-MM-YYYY')
                                                            console.log(formattedDate)
                                                            setFieldValue('endDate', formattedDate)

                                                        }} />
                                                    )
                                                }}
                                            </Field>
                                        </FormItem>

                                        <FormItem>
                                            <Button className="ltr:mr-2 rtl:ml-2"
                                                type="submit"
                                                style={{ backgroundColor: '#fff', height: '40px' }}
                                                disabled={isSubmitting} onClick={() => resetForm()}>
                                                Tải lại
                                            </Button>
                                            <Button variant="solid"
                                                type="submit"
                                                style={{ backgroundColor: 'rgb(79, 70, 229)', height: '40px' }}
                                                disabled={isSubmitting}>
                                                Thêm mới
                                            </Button>
                                        </FormItem>
                                    </FormContainer>
                                </div>

                                {/* Product List Table */}
                                <div className="w-full lg:w-2/3 bg-white rounded-lg">
                                    <h4 className="font-medium text-xl mb-4">Danh sách sản phẩm</h4>
                                    <table className="table-auto w-full border border-collapse border-gray-300">
                                        <thead>
                                            <tr>
                                                <th className="border px-4 py-2">Chọn</th>
                                                <th className="border px-4 py-2">Mã sản phẩm</th>
                                                <th className="border px-4 py-2">Tên sản phẩm</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {product.map((product) => (
                                                <tr key={product.id}>
                                                    <td className="border px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected(product.id)}
                                                            onChange={(e) =>
                                                                handleSelectProduct(product, e.target.checked)
                                                            }
                                                        />
                                                    </td>
                                                    <td className="border px-4 py-2">{product.code}</td>
                                                    <td className="border px-4 py-2">{product.name}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="flex items-center justify-between mt-4">
                                        <Button
                                            type="button"
                                            disabled={pageIndex === 1}
                                            onClick={handlePreviousPage}
                                        >
                                            Trang trước
                                        </Button>
                                        <span>
                                            Trang {pageIndex} / {Math.ceil(total / pageSize)}
                                        </span>
                                        <Button
                                            type="button"
                                            disabled={pageIndex >= Math.ceil(total / pageSize)}
                                            onClick={handleNextPage}
                                        >
                                            Trang sau
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>

    )
}

export default AddEvent
