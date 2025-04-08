import { useState, useEffect } from 'react'
import { Button, Input, Radio, Select, Switcher } from '@/components/ui'
import { Link, useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, FieldArray, FieldProps, Form, Formik, FormikHelpers, FormikProps } from 'formik'
import DatePicker from '@/components/ui/DatePicker'
import axios from 'axios'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { toast } from 'react-toastify'
import { Pagination } from 'antd'
import Dialog from '@/components/ui/Dialog'
import { SingleValue } from 'react-select'
import { AdaptableCard } from '@/components/shared'
import { useToastContext } from '@/context/ToastContext'


type CustomerDTO = {
    id: string;
    code: string;
    name: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: string;
    addressDTOS: AddressDTO[];
    status: string;
    totalAddresses: number;
};

type AddressDTO = {
    id: string;
    name: string;
    phone: string;
    provinceId: number;
    districtId: number;
    wardId: string;
    province: string | null;
    district: string | null;
    ward: string | null;
    detail: string;
    isDefault: boolean;
};

interface Province {
    ProvinceID: number;
    ProvinceName: string;
    NameExtension: string[];
}

interface District {
    DistrictID: number;
    ProvinceID: number;
    DistrictName: string;
}


interface Ward {
    WardCode: string;
    DistrictID: number;
    WardName: string;
}


const UpdateCustomer = () => {
    const initialAddressDTO: AddressDTO = {
        id: '',
        name: '',
        phone: '',
        provinceId: 0,
        province: '',
        districtId: 0,
        district: '',
        wardId: '',
        ward: '',
        detail: '',
        isDefault: false
    }

    const initialCustomerState: CustomerDTO = {
        id: '',
        code: '',
        name: '',
        email: '',
        phone: '',
        birthDate: '',
        gender: 'Nữ',
        addressDTOS: [initialAddressDTO],
        status: 'Active',
        totalAddresses: 0
    }

    const [updateCustomer, setUpdateCustomer] = useState<CustomerDTO>(initialCustomerState)
    const [provinces, setProvinces] = useState<Province[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [wards, setWards] = useState<Ward[]>([])
    const [loadingProvinces, setLoadingProvinces] = useState(false)
    const [loadingDistricts, setLoadingDistricts] = useState(false)
    const [loadingWards, setLoadingWards] = useState(false)
    const [page, setPage] = useState<number>(0)
    const [totalPages, setTotalPages] = useState<number>(0)
    const [totalAddresses, setTotalAddresses] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize: number = 2
    const navigate = useNavigate()
    const { id } = useParams()
    const [formModes, setFormModes] = useState<string[]>([])
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
    const [addresses, setAddresses] = useState<AddressDTO[]>([])

    const { openNotification } = useToastContext()
    // State riêng để lưu email và phone ban đầu
    const [initialContact, setInitialContact] = useState({
        currentEmail: '',
        currentPhone: ''
    })

    useEffect(() => {
        console.log('Effect running')
        if (id) {
            fetchCustomer(id, page)
        }
        loadProvinces()
    }, [id, page])

    useEffect(() => {
        if (updateCustomer.addressDTOS.length > 0) {
            const newDistricts: District[] = []
            const newWards: Ward[] = [] // Lưu trữ các phường được lấy cho mỗi địa chỉ

            // Lấy các quận và phường cho mỗi địa chỉ
            const fetchAddressesData = async () => {
                await Promise.all(
                    updateCustomer.addressDTOS.map(async (address) => {
                        // Lấy các quận dựa vào provinceId
                        if (address.provinceId) {
                            const districtsData = await fetchDistricts(address.provinceId)
                            newDistricts.push(...districtsData)
                        }

                        // Lấy các phường dựa vào districtId
                        if (address.districtId) {
                            const wardsData = await fetchWards(address.districtId)
                            newWards.push(...wardsData) // Lưu các phường đã lấy
                        }
                    })
                )
                // Cập nhật trạng thái sau khi tất cả các lần truy xuất hoàn tất
                setDistricts(newDistricts)
                setWards(newWards)
            }

            fetchAddressesData()
        }
    }, [updateCustomer])

    // Hàm Check validator
    const validationSchema = Yup.object({

        name: Yup.string().required('Họ tên khách hàng là bắt buộc')
            .min(3, 'Họ và tên khách hàng phải có ít nhất 3 ký tự')
            .max(50, 'Họ và tên khách hàng không vượt quá 50 ký tự')
            .test('no-whitespace', 'Họ tên không được chứa nhiều khoảng trắng', value => {
                // kiểm tra khoảng trắng thừa
                return value.trim() === value && !value.includes('  ')
            })
            .test('no-special-characters', 'Họ và tên không được chứa ký tự đặc biệt hoặc số', (value) => {
                // Kiểm tra ký tự đặc biệt và số
                return /^[\p{L}\s]+$/u.test(value) // sử dụng regex để kiểm tra
            }),

        email: Yup.string()
            .email('Email không hợp lệ')
            .required('Email là bắt buộc')
            .test('no-whitespace', 'Email không được chứa khoảng trắng đầu và cuối', value => {
                return value.trim() === value
            })
            .test('email-gmail', 'Email phải kết thúc bằng @gmail.com', value => {
                return value ? value.endsWith('@gmail.com') : true // Chỉ kiểm tra nếu có giá trị
            })
            .test('email-unique', 'Email đã tồn tại', async (email) => {
                if (email === initialContact.currentEmail) return true // Nếu email không thay đổi, bỏ qua xác thực

                // Gọi API kiểm tra email có trùng không
                const response = await axios.get(`http://localhost:8080/api/v1/customer/check-email`, { params: { email } })
                return !response.data.exists // Nếu email đã tồn tại, trả về false
            }),

        phone: Yup.string()
            .required('Số điện thoại là bắt buộc')
            .matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ')
            .test('phone-unique', 'Số điện thoại đã tồn tại', async (phone) => {
                if (phone === initialContact.currentPhone) return true // Nếu phone không thay đổi, bỏ qua xác thực

                // Gọi API kiểm tra số điện thoại có trùng không
                const response = await axios.get(`http://localhost:8080/api/v1/customer/check-phone`, { params: { phone } })
                return !response.data.exists // Nếu phone đã tồn tại, trả về false
            }),

        birthDate: Yup.date()
            .required('Ngày sinh là bắt buộc')
            .max(new Date(), 'Ngày sinh không được là tương lai')
            .test(
                'age-range',
                'Độ tuổi của bạn không đủ điều kiện để mua hàng',
                function(value) {
                    const age = dayjs().diff(dayjs(value), 'year')
                    return age >= 5 && age <= 100
                }
            ),

        gender: Yup.string()
            .required('Vui lòng chọn giới tính')
            .oneOf(['Nam', 'Nữ'], 'Giới tính không hợp lệ'),

        addressDTOS: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().required('Họ và tên khách hàng là bắt buộc')
                    .min(3, 'Họ tên khách hàng phải có ít nhất 5 ký tự')
                    .max(50, 'Họ tên khách hàng không vượt quá 100 ký tự')
                    .test('no-whitespace', 'Họ và tên không được chứa nhiều khoảng trắng', value => {
                        // kiểm tra khoảng trắng thừa
                        return value.trim() === value && !value.includes('  ')
                    })
                    .test('no-special-characters', 'Họ và tên không được chứa ký tự đặc biệt hoặc số', (value) => {
                        // Kiểm tra ký tự đặc biệt và số
                        return /^[\p{L}\s]+$/u.test(value) // sử dụng regex để kiểm tra
                    }),

                phone: Yup.string()
                    .required('Số điện thoại là bắt buộc')
                    .matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ'),

                province: Yup.string().required('Vui lòng chọn tỉnh/thành phố'),
                district: Yup.string().required('Vui lòng chọn quận/huyện'),
                ward: Yup.string().required('Vui lòng chọn xã/phường/thị trấn'),
                detail: Yup.string().required('Vui lòng nhập địa chỉ cụ thể')
            })
        )
    })


    // Hàm lấy dữ liệu tỉnh
    const fetchProvinces = async (): Promise<Province[]> => {
        console.log('Fetching provinces...') // Log thêm
        setLoadingProvinces(true)

        try {
            const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
                headers: {
                    'Content-Type': 'application/json',
                    'Token': '718f2008-46b7-11ef-b4a4-2ec170e33d11'
                }
            })
            console.log('API Province Response: ', response)
            if (response.data.code === 200) {
                return response.data.data // Trả về dữ liệu tỉnh
            } else {
                console.log('Error fetching province: ', response.data.message)
                alert('Không thể tải danh sách tỉnh. Vui lòng thử lại sau.')
                return []
            }
        } catch (error) {
            console.error('Error fetching province:', error)
            alert('Đã xảy ra lỗi khi tải danh sách tỉnh. Vui lòng thử lại.')
            return []
        } finally {
            setLoadingProvinces(false)
        }
    }


    // Hàm lấy thông tin quận
    const fetchDistricts = async (provinceId: number): Promise<District[]> => {
        setLoadingDistricts(true)
        try {
            const response = await axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Token': '718f2008-46b7-11ef-b4a4-2ec170e33d11'
                },
                params: { province_id: provinceId }
            })
            console.log('API District Response: ', response)
            if (response.data.code === 200) {
                return response.data.data // Trả về dữ liệu quận
            } else {
                console.log('Error fetching district: ', response.data.message)
                alert('Không thể tải danh sách huyện. Vui lòng thử lại sau.')
                return []
            }
        } catch (error) {
            console.error('Error fetching districts:', error)
            alert('Đã xảy ra lỗi khi tải danh sách huyện. Vui lòng thử lại.')
            return []
        } finally {
            setLoadingDistricts(false)
        }
    }


    // Hàm lấy thông tin xã
    const fetchWards = async (districtId: number): Promise<Ward[]> => {
        setLoadingWards(true)
        try {
            const response = await axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Token': '718f2008-46b7-11ef-b4a4-2ec170e33d11'
                },
                params: { district_id: districtId }
            })
            console.log('API Ward Response: ', response)
            if (response.data.code === 200) {
                return response.data.data // Trả về dữ liệu phường
            } else {
                console.log('Error fetching ward: ', response.data.message)
                alert('Không thể tải danh sách xã. Vui lòng thử lại sau.')
                return []
            }
        } catch (error) {
            console.error('Error fetching wards:', error)
            alert('Đã xảy ra lỗi khi tải danh sách xã. Vui lòng thử lại.')
            return []
        } finally {
            setLoadingWards(false)
        }
    }


    // Hàm sử lý người dùng khi thay đổi tỉnh quận xã
    const handleLocationChange = async (
        type: 'province' | 'district' | 'ward',
        newValue: Province | District | Ward | null,
        form: FormikProps<CustomerDTO>,
        index: number
    ) => {
        if (newValue) {
            if (type === 'province' && 'ProvinceID' in newValue && 'ProvinceName' in newValue) {
                // Cập nhật giá trị cho tỉnh
                form.setFieldValue(`addressDTOS[${index}].province`, newValue.NameExtension[1] || '')
                form.setFieldValue(`addressDTOS[${index}].provinceId`, newValue.ProvinceID) // Cập nhật ID tỉnh

                // Lấy danh sách quận dựa trên tỉnh được chọn
                const districtsData = await fetchDistricts(newValue.ProvinceID)
                setDistricts(districtsData)
                form.setFieldValue(`addressDTOS[${index}].district`, '') // Reset district
                form.setFieldValue(`addressDTOS[${index}].districtId`, 0) // Reset ID district
                form.setFieldValue(`addressDTOS[${index}].ward`, '')     // Reset ward
                form.setFieldValue(`addressDTOS[${index}].wardId`, '')   // Reset ID ward
                setWards([]) // Reset wards
            } else if (type === 'district' && 'DistrictID' in newValue && 'DistrictName' in newValue) {
                // Cập nhật giá trị cho quận
                form.setFieldValue(`addressDTOS[${index}].district`, newValue.DistrictName || '')
                form.setFieldValue(`addressDTOS[${index}].districtId`, newValue.DistrictID) // Cập nhật ID district

                // Lấy danh sách xã dựa trên quận được chọn
                const wardsData = await fetchWards(newValue.DistrictID)
                setWards(wardsData)
                form.setFieldValue(`addressDTOS[${index}].ward`, '')     // Reset ward
                form.setFieldValue(`addressDTOS[${index}].wardId`, '')   // Reset ID ward
            } else if (type === 'ward' && 'WardName' in newValue) {
                // Cập nhật giá trị cho xã
                form.setFieldValue(`addressDTOS[${index}].ward`, newValue.WardName || '')
                form.setFieldValue(`addressDTOS[${index}].wardId`, newValue.WardCode) // Cập nhật ID ward
            }
        } else {
            // Nếu newValue là null, thiết lập giá trị mặc định
            form.setFieldValue(`addressDTOS[${index}].${type}`, '')
            form.setFieldValue(`addressDTOS[${index}].${type}Id`, 0) // Reset ID tương ứng
        }
    }


    const loadProvinces = async () => {
        console.log('Loading provinces...') // Log để kiểm tra loadProvinces
        const cachedProvinces = localStorage.getItem('provinces')
        if (cachedProvinces) {
            console.log('Using cached provinces.') // Log nếu có cached
            setProvinces(JSON.parse(cachedProvinces))
        } else {
            console.log('Fetching provinces from API...') // Log thêm
            const data = await fetchProvinces()
            console.log('Fetched provinces:', data) // Log để kiểm tra dữ liệu
            setProvinces(data)
            localStorage.setItem('provinces', JSON.stringify(data))
        }
    }

    dayjs.extend(customParseFormat)

    // Fetch all addresses
    const fetchAddresses = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/address`)
            setAddresses(response.data)
        } catch (error) {
            console.error('Error fetching addresses:', error)
        }
    }

    const fetchCustomer = async (id: string, currentPage: number) => {
        try {

            const response = await axios.get(`http://localhost:8080/api/v1/customer/${id}/detail`, {
                params: {
                    page: currentPage > 0 ? currentPage - 1 : 0, // Chuyển đổi currentPage về định dạng 0
                    size: pageSize
                }
            })
            if (response.status === 200) {

                const customerData = response.data

                // Cập nhật tổng số địa chỉ và số trang
                console.log('Tổng số địa chỉ: ', customerData.totalAddresses)
                console.log('Tổng số trang: ', customerData.totalAddresses / pageSize)
                if (customerData.totalAddresses) {
                    setTotalAddresses(customerData.totalAddresses)
                    setTotalPages(Math.ceil(customerData.totalAddresses / pageSize))
                }

                // Cập nhật thông tin email và phone của khách hàng
                setInitialContact({
                    currentEmail: customerData.email,
                    currentPhone: customerData.phone
                })
                // Log giá trị birthDate từ backend
                console.log('Giá trị birthDate từ backend:', customerData.birthDate)

                // Chuyển đổi ngày sinh từ 'DD-MM-YYYY' sang 'YYYY-MM-DD' cho frontend
                if (customerData.birthDate) {
                    // Phân tích ngày với định dạng 'DD-MM-YYYY'
                    const parsedDate = dayjs(customerData.birthDate, 'DD-MM-YYYY')

                    // Log ngày đã phân tích để kiểm tra
                    console.log('Parsed Date:', parsedDate.format())

                    if (parsedDate.isValid()) {
                        // Định dạng lại ngày cho frontend
                        customerData.birthDate = parsedDate.format('YYYY-MM-DD')
                        console.log('Formatted birthDate:', customerData.birthDate) // Log để kiểm tra xem ngày đã định dạng chưa
                    } else {
                        console.error('Ngày sinh không hợp lệ:', customerData.birthDate)
                    }
                }

                setUpdateCustomer(customerData)
                console.log('Customer data:', customerData)
                setFormModes(response.data.addressDTOS.map(() => 'edit'))
            } else {
                console.error('Failed to fetch customer data:', response.statusText)
            }
        } catch (error) {
            console.error('Error fetching customer data:', error)
        }
    }

    // mở dialog xác nhận xóa
    const openDialog = (addressId: string) => {
        setSelectedAddressId(addressId)
        setIsOpen(true)
    }

    // Đóng dialog mà không xóa
    const onDialogClose = () => {
        setIsOpen(false)
        setSelectedAddressId(null)
    }

    // Delete Address
    const handleDelete = async (id: string, index: number, remove: (index: number) => void, address: AddressDTO) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/v1/address/delete/${id}`)
            if (response.status === 200) {
                toast.success('Xóa thành công')
                remove(index)
                setFormModes(prev => prev.filter((_, i) => i !== index))
                setIsOpen(false)
            } else {
                console.error('Lỗi khi xóa địa chỉ:', response.statusText)
                toast.success('Xóa thất bại')
            }
        } catch (error) {
            if (error?.response?.data?.error) {
                openNotification(error?.response?.data?.error, 'Thông báo', 'warning', 5000)
            }
        }
        setIsOpen(false)
    }


    const handlePageChange = (newPage: number) => {
        if (newPage < 1) {
            console.warn('Số trang phải lớn hơn hoặc bằng 1')
            return // không gọi api nếu trang nhỏ hơn 1
        }
        if (id) { // Kiểm tra xem id có phải là undefined không
            setCurrentPage(newPage)
            fetchCustomer(id, newPage) // Gọi lại fetchCustomer với trang mới
        } else {
            console.error('ID is undefined')
        }
    }

    const handleUpdate = async (values: CustomerDTO, { setSubmitting }: FormikHelpers<CustomerDTO>) => {
        try {
            // Kiểm tra ngày sinh trước khi định dạng
            if (!dayjs(values.birthDate, 'YYYY-MM-DD', true).isValid()) {
                alert('Ngày sinh không hợp lệ. Vui lòng kiểm tra lại.')
                setSubmitting(false)
                return
            }

            // Định dạng ngày sinh trước khi gửi
            const formattedBirthDate = dayjs(values.birthDate, 'YYYY-MM-DD').format('DD-MM-YYYY')
            const response = await axios.put(`http://localhost:8080/api/v1/customer/update/${values.id}`, {
                ...values,
                birthDate: formattedBirthDate // Gửi ngày đã định dạng
            })

            if (response.status === 200) {
                toast.success('Cập nhật thành công')
                navigate('/admin/manage/customer')
            } else {
                alert('Failed to update customer. Please try again.')
            }
        } catch (error) {
            console.error('Error updating customer:', error)
            alert('Error updating customer. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }


    // hàm thêm mới địa chỉ cho 1 khách hàng
    const handleAddressSubmit = async (
        mode: 'add' | 'edit',
        address: AddressDTO,
        addressId: string,
        customerId: string,
        addressIndex: number,
        setFieldTouched: (field: string, touched?: boolean) => void,
        setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
        values: { addressDTOS: AddressDTO[] } // Thêm values để có thể truy cập danh sách addressDTOS hiện tại
    ) => {
        try {
            // Kiểm tra tính hợp lệ của form trước khi gửi yêu cầu
            if (!address.name || !address.phone || !address.province || !address.district || !address.ward || !address.detail) {
                // Đánh dấu tất cả các trường là đã được "touched" để hiển thị lỗi
                setFieldTouched(`addressDTOS[${addressIndex}].name`, true)
                setFieldTouched(`addressDTOS[${addressIndex}].phone`, true)
                setFieldTouched(`addressDTOS[${addressIndex}].province`, true)
                setFieldTouched(`addressDTOS[${addressIndex}].district`, true)
                setFieldTouched(`addressDTOS[${addressIndex}].ward`, true)
                setFieldTouched(`addressDTOS[${addressIndex}].detail`, true)
                return // Dừng hàm nếu form không hợp lệ
            }

            let response
            if (mode === 'add') {
                response = await axios.post(`http://localhost:8080/api/v1/customer/${customerId}/address`, address)
                console.log('Dữ liệu địa chỉ vừa thêm:', response.data)
                if (response.status === 201) {
                    // Thêm địa chỉ mới vào đầu danh sách sau khi thành công
                    setFieldValue('addressDTOS', [response.data, ...values.addressDTOS])

                    setFormModes((prev) => ['edit', ...prev]) // Cập nhật formModes
                }
                openNotification('Thêm địa chỉ mới thành công')
            } else {
                // Gửi yêu cầu cập nhật với các trường ID quận và xã
                response = await axios.put(`http://localhost:8080/api/v1/address/update/${addressId}`, {
                    ...address, // Bao gồm cả districtId và wardId
                    districtId: address.districtId, // Đảm bảo ID quận được gửi
                    wardId: address.wardId // Đảm bảo ID xã được gửi
                })
                const updatedAddressDTOS = [...values.addressDTOS]
                updatedAddressDTOS[addressIndex] = response.data
                // setFieldValue('addressDTOS', updatedAddressDTOS); // Cập nhật lại danh sách sau khi chỉnh sửa
                console.log('dữ liệu cập nhật lại địa chỉ: ', updatedAddressDTOS)
                openNotification('Cập nhật địa chỉ thành công')
            }
            fetchCustomer(customerId, currentPage)
        } catch (error) {
            console.error('Error submitting address:', error)
            alert('Error submitting address. Please try again.')
        }
    }


    // Hàm cập nhật địa chỉ mặc định
    const updateDefaultAddress = async (addressId: string, isDefault: boolean) => {
        try {
            console.log('Updating address ID:', addressId, 'to default:', isDefault)
            const response = await axios.put(
                `http://localhost:8080/api/v1/customer/${addressId}/default`,
                null,
                {
                    params: {
                        customerId: updateCustomer.id,
                        isDefault: isDefault
                    }
                }
            )
            if (response.status === 200) {
                console.log('Địa chỉ đã được cập nhật thành công:', response.data)
                fetchAddresses()
            } else {
                console.error('Cập nhật địa chỉ không thành công:', response.statusText)
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật địa chỉ:', error)
        }
    }


    // Hàm xử lý thay đổi của Switcher
    const handleSwitcherChange = async (index: number, checked: boolean) => {
        try {
            // Đặt địa chỉ được chọn làm mặc định
            const updatedAddresses = updateCustomer.addressDTOS.map((address, i) => ({
                ...address,
                isDefault: i === index ? true : false // Chỉ có địa chỉ tại index được đặt mặc định
            }))

            // Cập nhật địa chỉ trong state (tạm thời)
            setUpdateCustomer({ ...updateCustomer, addressDTOS: updatedAddresses })
            openNotification('Cập nhật địa chỉ mặc định thành công')
            // Gọi API chỉ một lần để cập nhật địa chỉ mặc định và các địa chỉ khác
            await updateDefaultAddress(updateCustomer.addressDTOS[index].id, true)

        } catch (error) {
            console.error('Lỗi khi cập nhật địa chỉ mặc định:', error)
        }
    }

    const resetProvincesDistrictsWards = async (customer: CustomerDTO) => {
        if (customer.addressDTOS[0].provinceId) {
            // Load lại danh sách quận từ provinceId ban đầu
            const districts = await fetchDistricts(customer.addressDTOS[0].provinceId)
            setDistricts(districts)

            if (customer.addressDTOS[0].districtId) {
                // Load lại danh sách xã từ districtId ban đầu
                const wards = await fetchWards(customer.addressDTOS[0].districtId)
                setWards(wards)
            }
        }
    }

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            {/* Breadcrumb */}
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
                                <span className="text-gray-500">Khách hàng</span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>
            <div>
                <Formik
                    initialValues={updateCustomer}
                    validationSchema={validationSchema}
                    enableReinitialize={true}
                    onSubmit={handleUpdate}
                >
                    {({ values, setFieldValue, touched, errors, resetForm, isSubmitting, setFieldTouched }) => (
                        <Form>
                            <div className="w-full bg-white rounded-lg h-full">
                                <h1 className=" font-semibold text-2xl mb-4 uppercase">Cập nhật khách hàng</h1>
                                <div className="grid grid-cols-1 xl:grid-cols-12 gap-20">
                                    <div className="w-full bg-white  xl:col-span-4">
                                        <h4 className="font-medium text-xl mb-4">Thông tin khách hàng</h4>
                                        <FormContainer>
                                            <FormItem
                                                asterisk
                                                label="Tên khách hàng"
                                                invalid={errors.name && touched.name}
                                                errorMessage={errors.name}
                                            >
                                                <Field type="text" autoComplete="off" name="name"
                                                       style={{ height: '44px' }}
                                                       placeholder="Tên khách hàng..." component={Input}
                                                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                           const value = e.target.value
                                                           setFieldValue('name', value)
                                                           setUpdateCustomer((prev) => ({ ...prev, name: value }))
                                                       }}
                                                />
                                            </FormItem>

                                            <FormItem
                                                asterisk
                                                label="Email"
                                                invalid={errors.email && touched.email}
                                                errorMessage={errors.email}
                                            >
                                                <Field type="text" autoComplete="off" name="email"
                                                       style={{ height: '44px' }}
                                                       placeholder="Email..." component={Input}
                                                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                           const value = e.target.value
                                                           setFieldValue('email', value)
                                                           setUpdateCustomer((prev) => ({ ...prev, email: value }))
                                                       }}
                                                />
                                            </FormItem>

                                            <FormItem
                                                asterisk
                                                label="Số điện thoại"
                                                invalid={errors.phone && touched.phone}
                                                errorMessage={errors.phone}
                                            >
                                                <Field type="text" autoComplete="off" name="phone"
                                                       style={{ height: '44px' }}
                                                       placeholder="Số điện thoại..." component={Input}
                                                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                           const value = e.target.value.replace(/\D/g, '') // Chỉ cho phép nhập ký tự số
                                                           setFieldValue('phone', value) // Cập nhật giá trị trong Formik
                                                           setUpdateCustomer((prev) => ({ ...prev, phone: value })) // Cập nhật giá trị cho state updateCustomer
                                                       }} />
                                            </FormItem>

                                            <FormItem
                                                asterisk
                                                label="Ngày sinh"
                                                invalid={errors.birthDate && touched.birthDate}
                                                errorMessage={errors.birthDate}
                                            >

                                                <DatePicker
                                                    inputtable
                                                    inputtableBlurClose={false}
                                                    placeholder="Chọn ngày sinh..."
                                                    value={updateCustomer.birthDate ? dayjs(updateCustomer.birthDate, 'YYYY-MM-DD').toDate() : null}
                                                    disableDate={(current) => {
                                                        return dayjs(current).isAfter(dayjs().endOf('day'))
                                                    }}
                                                    className="custom-datepicker"
                                                    onChange={(date) => {
                                                        if (date) {
                                                            const formattedDate = dayjs(date).format('YYYY-MM-DD')
                                                            setFieldValue('birthDate', formattedDate)
                                                            setUpdateCustomer((prev) => ({
                                                                ...prev,
                                                                birthDate: formattedDate
                                                            }))
                                                        } else {
                                                            setFieldValue('birthDate', '')
                                                            setUpdateCustomer((prev) => ({
                                                                ...prev,
                                                                birthDate: ''
                                                            }))
                                                        }
                                                    }}
                                                />

                                            </FormItem>

                                            <FormItem asterisk label="Giới tính">
                                                <Field name="gender">
                                                    {({
                                                          field,
                                                          form
                                                      }: FieldProps<string, FormikProps<CustomerDTO>>) => (
                                                        <>
                                                            <Radio className="mr-4" value="Nam"
                                                                   checked={field.value === 'Nam'}
                                                                   onChange={() => {
                                                                       form.setFieldValue('gender', 'Nam')
                                                                       setUpdateCustomer((prev) => ({
                                                                           ...prev,
                                                                           gender: 'Nam'
                                                                       }))
                                                                   }}>
                                                                Nam
                                                            </Radio>
                                                            <Radio value="Nữ" checked={field.value === 'Nữ'}
                                                                   onChange={() => {
                                                                       form.setFieldValue('gender', 'Nữ')
                                                                       setUpdateCustomer((prev) => ({
                                                                           ...prev,
                                                                           gender: 'Nữ'
                                                                       }))
                                                                   }}>
                                                                Nữ
                                                            </Radio>
                                                        </>
                                                    )}
                                                </Field>
                                            </FormItem>

                                            <FormItem>
                                                <Button type="reset" className="ltr:mr-2 rtl:ml-2"
                                                        style={{ backgroundColor: '#fff', height: '40px' }}
                                                        disabled={isSubmitting} onClick={() => {
                                                    resetForm()
                                                    resetProvincesDistrictsWards(updateCustomer)  // Gọi hàm để load lại dữ liệu tỉnh, quận, xã
                                                }}>
                                                    Tải lại
                                                </Button>
                                                <Button variant="solid" type="submit"
                                                        style={{ backgroundColor: 'rgb(79, 70, 229)', height: '40px' }}
                                                        disabled={isSubmitting}>
                                                    Cập nhật
                                                </Button>
                                            </FormItem>
                                        </FormContainer>
                                    </div>

                                    <div className="w-full bg-white rounded-lg  xl:col-span-8">
                                        <FieldArray name="addressDTOS">
                                            {({ remove, unshift }) => (
                                                <div>
                                                    <div className={'flex justify-between items-center'}>
                                                        <h4 className="font-medium text-xl">Thông tin địa chỉ</h4>
                                                        <Button
                                                            type="button"
                                                            onClick={() => {
                                                                // Thêm một địa chỉ mới vào đầu mảng
                                                                unshift(initialAddressDTO) // Gọi unshift với initialAddressDTO

                                                                // Cập nhật trạng thái formModes
                                                                setFormModes(['add', ...formModes])

                                                            }}
                                                        >
                                                            Thêm địa chỉ mới
                                                        </Button>
                                                    </div>
                                                    {values.addressDTOS.map((address, index) => (
                                                        <div key={index}
                                                             className="bg-white rounded-lg">
                                                            <FormContainer>
                                                                <h4 className="text-lg font-medium mb-2">
                                                                    Địa
                                                                    chỉ {(currentPage - 1) * pageSize + index + 1}
                                                                </h4>
                                                                <div className="flex w-full flex-wrap">
                                                                    <div className="w-1/2 pr-4">
                                                                        <FormItem
                                                                            asterisk
                                                                            label="Tên"
                                                                            invalid={errors.addressDTOS?.[index]?.name && touched.addressDTOS?.[index]?.name}
                                                                            errorMessage={errors.addressDTOS?.[index]?.name}
                                                                        >
                                                                            <Field
                                                                                type="text"
                                                                                name={`addressDTOS[${index}].name`}
                                                                                style={{ height: '44px' }}
                                                                                placeholder="Nhập tên..."
                                                                                component={Input}
                                                                            />
                                                                        </FormItem>
                                                                    </div>
                                                                    <div className="w-1/2">
                                                                        <FormItem
                                                                            asterisk
                                                                            label="Số điện thoại"
                                                                            invalid={errors.addressDTOS?.[index]?.phone && touched.addressDTOS?.[index]?.phone}
                                                                            errorMessage={errors.addressDTOS?.[index]?.phone}
                                                                        >
                                                                            <Field
                                                                                type="text"
                                                                                name={`addressDTOS[${index}].phone`}
                                                                                style={{ height: '44px' }}
                                                                                placeholder="Nhập số điện thoại..."
                                                                                component={Input}
                                                                            />
                                                                        </FormItem>
                                                                    </div>
                                                                </div>

                                                                <div className="flex w-full flex-wrap">
                                                                    <div className="w-1/3 pr-4">
                                                                        <FormItem
                                                                            asterisk
                                                                            label="Tỉnh/Thành phố"
                                                                            invalid={touched.addressDTOS?.[index]?.province && Boolean(errors.addressDTOS?.[index]?.province)}
                                                                            errorMessage={errors.addressDTOS?.[index]?.province}
                                                                        >
                                                                            <Field
                                                                                name={`addressDTOS[${index}].province`}>
                                                                                {({
                                                                                      field,
                                                                                      form
                                                                                  }: FieldProps<string, FormikProps<CustomerDTO>>) => {
                                                                                    // Log giá trị tỉnh/thành phố hiện tại
                                                                                    console.log('Dữ liệu tỉnh:', field.value)

                                                                                    return (
                                                                                        <Select
                                                                                            value={provinces.find(prov => prov.NameExtension[1] === field.value)}
                                                                                            placeholder="Chọn tỉnh/thành phố..."
                                                                                            getOptionLabel={(option: Province) => option.NameExtension[1]}
                                                                                            getOptionValue={(option: Province) => String(option.ProvinceID)}
                                                                                            options={provinces}
                                                                                            onChange={(newValue: SingleValue<Province> | null) => {
                                                                                                handleLocationChange('province', newValue, form, index)
                                                                                            }}
                                                                                            onBlur={() => form.setFieldTouched(field.value, true)}
                                                                                        />
                                                                                    )
                                                                                }}
                                                                            </Field>
                                                                        </FormItem>
                                                                    </div>


                                                                    <div className="w-1/3 pr-4">
                                                                        <FormItem
                                                                            asterisk
                                                                            label="Quận/huyện"
                                                                            invalid={touched.addressDTOS?.[index]?.district && Boolean(errors.addressDTOS?.[index]?.district)}
                                                                            errorMessage={errors.addressDTOS?.[index]?.district}
                                                                        >
                                                                            <Field
                                                                                name={`addressDTOS[${index}].district`}>
                                                                                {({
                                                                                      field,
                                                                                      form
                                                                                  }: FieldProps<string, FormikProps<CustomerDTO>>) => {
                                                                                    console.log('Dữ liệu quận:', field.value)
                                                                                    return (
                                                                                        <Select
                                                                                            isDisabled={!address.province}
                                                                                            value={districts.find(prov => prov.DistrictName === field.value)}
                                                                                            placeholder="Chọn quận/huyện..."
                                                                                            getOptionLabel={(option: District) => option.DistrictName}
                                                                                            getOptionValue={(option: District) => String(option.DistrictID)}
                                                                                            options={districts}
                                                                                            onChange={(newValue: SingleValue<District> | null) => {
                                                                                                handleLocationChange('district', newValue, form, index)
                                                                                            }}
                                                                                            onBlur={() => form.setFieldTouched(field.value, true)}
                                                                                        />
                                                                                    )
                                                                                }}
                                                                            </Field>
                                                                        </FormItem>
                                                                    </div>

                                                                    <div className="w-1/3">
                                                                        <FormItem
                                                                            asterisk
                                                                            label="Xã/phường/thị trấn"
                                                                            invalid={touched.addressDTOS?.[index]?.ward && Boolean(errors.addressDTOS?.[index]?.ward)}
                                                                            errorMessage={errors.addressDTOS?.[index]?.ward}
                                                                        >
                                                                            <Field
                                                                                name={`addressDTOS[${index}].ward`}>
                                                                                {({
                                                                                      field,
                                                                                      form
                                                                                  }: FieldProps<string, FormikProps<CustomerDTO>>) => {
                                                                                    console.log('Dữ liệu xã:', field.value)

                                                                                    return (

                                                                                        <Select
                                                                                            isDisabled={!address.district}
                                                                                            value={wards.find(prov => prov.WardName === field.value)}
                                                                                            placeholder="Chọn xã/phường/thị trấn..."
                                                                                            getOptionLabel={(option: Ward) => option.WardName}
                                                                                            getOptionValue={(option: Ward) => String(option.WardCode)}
                                                                                            options={wards}
                                                                                            onChange={(newValue: SingleValue<Ward> | null) => {
                                                                                                handleLocationChange('ward', newValue, form, index)
                                                                                            }}
                                                                                            onBlur={() => form.setFieldTouched(field.value, true)}
                                                                                        />
                                                                                    )

                                                                                }}
                                                                            </Field>
                                                                        </FormItem>
                                                                    </div>
                                                                </div>

                                                                <FormItem
                                                                    asterisk
                                                                    label="Địa chỉ chi tiết"
                                                                    invalid={errors.addressDTOS?.[index]?.detail && touched.addressDTOS?.[index]?.detail}
                                                                    errorMessage={errors.addressDTOS?.[index]?.detail}
                                                                >
                                                                    <Field type="text"
                                                                           name={`addressDTOS[${index}].detail`}
                                                                           style={{ height: '44px' }}
                                                                           placeholder="Nhập địa chỉ chi tiết"
                                                                           component={Input} />
                                                                </FormItem>
                                                                <div hidden={formModes[index] === 'add'}>
                                                                    <FormItem label="Địa chỉ mặc định">
                                                                        <Field name={`addressDTOS[${index}].isDefault`}>
                                                                            {({ field }) => (
                                                                                <Switcher
                                                                                    color="blue-600"
                                                                                    checked={field.value}
                                                                                    onChange={(checked) => {
                                                                                        setFieldValue(`addressDTOS[${index}].isDefault`, checked)
                                                                                        handleSwitcherChange(index, checked) // Gọi hàm để cập nhật địa chỉ mặc định
                                                                                    }}
                                                                                />

                                                                            )}
                                                                        </Field>
                                                                    </FormItem>
                                                                </div>

                                                                <div className="flex justify-end">
                                                                    <Button
                                                                        type="button"
                                                                        className="mr-4"
                                                                        variant="solid"
                                                                        style={{
                                                                            backgroundColor: 'rgb(79, 70, 229)',
                                                                            height: '40px'
                                                                        }}
                                                                        onClick={() => handleAddressSubmit(formModes[index] as 'add' | 'edit', values.addressDTOS[index], address.id, values.id, index, setFieldTouched, setFieldValue, values)}
                                                                    >
                                                                        {formModes[index] === 'add' ? 'Thêm' : 'Cập nhật'}
                                                                    </Button>


                                                                    <Button
                                                                        type="button"
                                                                        variant="default"
                                                                        style={{
                                                                            backgroundColor: '#fff',
                                                                            height: '40px'
                                                                        }}
                                                                        onClick={() => openDialog(address.id)}
                                                                    >
                                                                        Xóa
                                                                    </Button>
                                                                </div>
                                                            </FormContainer>
                                                            {/* Dialog xác nhận xóa */}
                                                            <Dialog isOpen={dialogIsOpen} closable={false}
                                                                    onClose={onDialogClose}>
                                                                <h5 className="mb-4">Xác nhận xóa địa chỉ</h5>
                                                                <p>Bạn có chắc chắn muốn xóa địa chỉ này không?</p>
                                                                <div className="text-right mt-6">
                                                                    <Button className="ltr:mr-2 rtl:ml-2"
                                                                            variant="plain" onClick={onDialogClose}>
                                                                        Hủy
                                                                    </Button>
                                                                    <Button variant="solid" style={{
                                                                        backgroundColor: 'rgb(79, 70, 229)',
                                                                        height: '40px'
                                                                    }} type="submit"
                                                                            onClick={() => handleDelete(selectedAddressId, index, remove, address)}>
                                                                        Xác nhận
                                                                    </Button>
                                                                </div>
                                                            </Dialog>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                        </FieldArray>
                                        <div>
                                            <Pagination
                                                current={currentPage}
                                                pageSize={pageSize}
                                                total={totalAddresses}
                                                onChange={handlePageChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </AdaptableCard>


    )
}

export default UpdateCustomer