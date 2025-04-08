import React, { useState, useEffect, useRef } from 'react' // Import các hook của React
import { Snackbar, Box } from '@mui/material' // Import các thành phần UI từ Material-UI
import {
    Formik,
    Field,
    Form,
    FormikHelpers,
    FormikProps,
    FieldProps,
    useFormikContext
} from 'formik' // Import các thành phần từ Formik
import * as Yup from 'yup' // Import Yup để xác thực
import axios from 'axios' // Import axios để gọi API
import emailjs from 'emailjs-com' // Import thư viện gửi email
import dayjs from 'dayjs' // Import thư viện xử lý ngày tháng
import { useNavigate } from 'react-router-dom' // Import hook để điều hướng
import {
    FormItem,
    FormContainer
} from '@/components/ui/Form' // Import các thành phần tùy chỉnh
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Radio from '@/components/ui/Radio'
import Select from '@/components/ui/Select'
import { toast } from 'react-toastify' // Import thư viện thông báo
import { Html5QrcodeScanner } from 'html5-qrcode' // Import thư viện quét mã QR
// eslint-disable-next-line import/named
import { SingleValue } from 'react-select' // Import kiểu dữ liệu từ react-select
import { CloseOutlined } from '@mui/icons-material' // Import biểu tượng đóng
import { IoPersonAdd } from 'react-icons/io5'
import { RxReset } from 'react-icons/rx'
import { BsQrCodeScan } from 'react-icons/bs'

// Định nghĩa kiểu dữ liệu cho nhân viên
interface Staff {
    id: string;
    code: string;
    name: string;
    email: string;
    phone: string;
    citizenId: string;
    address: string;
    province: string | null;
    district: string | null;
    ward: string | null;
    status: string;
    note: string;
    birthDay: string;
    gender?: boolean;
    deleted?: boolean;
    password: string;
}

// Định nghĩa kiểu dữ liệu cho tỉnh, huyện, xã
interface Province {
    id: string;
    name: string;
    full_name: string;
}

interface District {
    id: string;
    name: string;
    full_name: string;
}

interface Ward {
    id: string;
    name: string;
    full_name: string;
}

// Khởi tạo trạng thái ban đầu cho nhân viên
const initialStaffState: Staff = {
    id: '',
    code: '',
    name: '',
    email: '',
    phone: '',
    citizenId: '',
    address: '',
    province: null,
    district: null,
    ward: null,
    status: 'active',
    note: '',
    birthDay: '',
    gender: true,
    password: '',
    deleted: false
}

// Thành phần chính của trang thêm nhân viên
const AddStaffPage = () => {
    const [newStaff, setNewStaff] = useState<Staff>(initialStaffState) // Trạng thái cho nhân viên mới
    const [provinces, setProvinces] = useState<Province[]>([]) // Trạng thái cho danh sách tỉnh
    const [districts, setDistricts] = useState<District[]>([]) // Trạng thái cho danh sách huyện
    const [wards, setWards] = useState<Ward[]>([]) // Trạng thái cho danh sách xã
    const [loadingProvinces, setLoadingProvinces] = useState(false) // Trạng thái đang tải tỉnh
    const [loadingDistricts, setLoadingDistricts] = useState(false) // Trạng thái đang tải huyện
    const [loadingWards, setLoadingWards] = useState(false) // Trạng thái đang tải xã
    const [openDialog, setOpenDialog] = useState(false) // Trạng thái hiển thị hộp thoại quét mã
    const scannerRef = useRef<any>(null) // Tham chiếu cho scanner mã QR
    const [snackbarOpen, setSnackbarOpen] = useState(false) // Trạng thái hiển thị snackbar
    const [snackbarMessage, setSnackbarMessage] = useState('') // Thông điệp snackbar
    const navigate = useNavigate() // Khởi tạo hàm điều hướng
    const [isDisableAddressByScanner, setIsDisableAddressByScanner] = useState<boolean>(false)

    // Fetch tỉnh khi trang được tải
    useEffect(() => {
        fetchProvinces()
    }, [])

    // Fetch huyện khi tỉnh được chọn
    useEffect(() => {
        if (newStaff.province && provinces.length > 0) {
            const province = provinces.find((prov) => prov.full_name === newStaff.province)
            if (province) {
                fetchDistricts(province.id)
            } else {
                setDistricts([])
            }
        }
    }, [newStaff.province, provinces])

    // Fetch xã khi huyện được chọn
    useEffect(() => {
        if (newStaff.district && districts.length > 0) {
            const district = districts.find((dist) => dist.full_name === newStaff.district)
            if (district) {
                fetchWards(district.id)
            } else {
                setWards([])
            }
        }
    }, [newStaff.district, districts])

    // Hàm fetch tỉnh từ API
    const fetchProvinces = async () => {
        setLoadingProvinces(true)
        try {
            const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm')
            const data = response.data
            if (data.error === 0) {
                setProvinces(data.data) // Cập nhật danh sách tỉnh
            } else {
                // Xử lý lỗi nếu cần
            }
        } catch (error) {
            // Xử lý lỗi khi gọi API
        } finally {
            setLoadingProvinces(false)
        }
    }

    // Hàm fetch huyện từ API
    const fetchDistricts = async (provinceId: string) => {
        setLoadingDistricts(true)
        try {
            const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`)
            if (response.data.error === 0) {
                setDistricts(response.data.data) // Cập nhật danh sách huyện
            } else {
                setDistricts([])
            }
        } catch (error) {
            setDistricts([]) // Xử lý lỗi
        } finally {
            setLoadingDistricts(false)
        }
    }

    // Hàm fetch xã từ API
    const fetchWards = async (districtId: string) => {
        setLoadingWards(true)
        try {
            const response = await axios.get(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`)
            if (response.data.error === 0) {
                setWards(response.data.data) // Cập nhật danh sách xã
            } else {
                setWards([])
            }
        } catch (error) {
            setWards([]) // Xử lý lỗi
        } finally {
            setLoadingWards(false)
        }
    }

    // Hàm xử lý thay đổi địa điểm
    const handleLocationChange = (
        type: 'province' | 'district' | 'ward',
        newValue: Province | District | Ward | null,
        form: FormikProps<Staff>
    ) => {
        if (newValue) {
            if (type === 'province') {
                form.setFieldValue('province', newValue.full_name) // Cập nhật tỉnh
                form.setFieldValue('district', '') // Reset huyện
                form.setFieldValue('ward', '') // Reset xã
                setNewStaff((prev) => ({ ...prev, province: newValue.full_name, district: null, ward: null }))
                fetchDistricts(newValue.id) // Fetch huyện mới
            } else if (type === 'district') {
                form.setFieldValue('district', newValue.full_name) // Cập nhật huyện
                form.setFieldValue('ward', '') // Reset xã
                setNewStaff((prev) => ({ ...prev, district: newValue.full_name, ward: null }))
                fetchWards(newValue.id) // Fetch xã mới
            } else if (type === 'ward') {
                form.setFieldValue('ward', newValue.full_name) // Cập nhật xã
                setNewStaff((prev) => ({ ...prev, ward: newValue.full_name }))
            }
        }
    }

    // Xác thực dữ liệu nhập vào
    const validationSchema = Yup.object({
        name: Yup.string().required('Họ tên khách hàng là bắt buộc')
            .min(3, 'Họ và tên khách hàng phải có ít nhất 3 ký tự')
            .max(50, 'Họ và tên khách hàng không vượt quá 50 ký tự')
            .test('no-whitespace', 'Họ và tên không được chứa nhiều khoảng trắng', value => {
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
            .test('email-unique', 'Email đã tồn tại', async (email) => {
                const response = await axios.get(`http://localhost:8080/api/v1/staffs/check-email`, { params: { email } })
                return !response.data.exists
            }),

        phone: Yup.string()
            .required('Số điện thoại là bắt buộc')
            .matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ')
            .test('phone-unique', 'Số điện thoại đã tồn tại', async (phone) => {
                const response = await axios.get(`http://localhost:8080/api/v1/staffs/check-phone`, { params: { phone } })
                return !response.data.exists
            }),

        citizenId: Yup.string()
            .matches(/^[0-9]{12}$/, 'Căn cước công dân phải có đúng 12 chữ số')
            .required('Căn cước công dân là bắt buộc')
            .test('citizenId-unique', 'Căn cước công dân đã tồn tại', async (citizenId) => {
                const response = await axios.get(`http://localhost:8080/api/v1/staffs/check-citizenId`, { params: { citizenId } })
                return !response.data.exists
            }),

        birthDay: Yup.date()
            .required('Ngày sinh là bắt buộc')
            .max(new Date(), 'Ngày sinh không được là tương lai')
            .test('age-range', 'Nhân viên phải trong độ tuổi từ 16 đến 40', function (value) {
                const age = dayjs().diff(dayjs(value), 'year')
                return age >= 16 && age <= 40
            }),

        address: Yup.string().required('Số nhà là bắt buộc'),
        province: Yup.string().required('Tỉnh/Thành phố là bắt buộc'),
        district: Yup.string().required('Quận/Huyện là bắt buộc'),
        ward: Yup.string().required('Phường/Xã là bắt buộc'),
        note: Yup.string(),
        gender: Yup.boolean().required('Giới tính là bắt buộc')
    })


    // Hàm xử lý khi gửi biểu mẫu
    const handleSubmit = async (
        values: Staff,
        { resetForm, setSubmitting }: FormikHelpers<Staff>
    ) => {
        setSubmitting(true) // Đặt trạng thái gửi thành true

        try {
            const selectedProvince = provinces.find((p) => p.id === values.province)
            if (selectedProvince) values.province = selectedProvince.name

            const selectedDistrict = districts.find((d) => d.id === values.district)
            if (selectedDistrict) values.district = selectedDistrict.name

            const selectedWard = wards.find((w) => w.id === values.ward)
            if (selectedWard) values.ward = selectedWard.name

            const payload = {
                ...values,
                province: values.province,
                district: values.district,
                ward: values.ward
            }

            const response = await axios.post('http://localhost:8080/api/v1/staffs', payload)

            if (response.status === 201) {
                const { code, password } = response.data
                setNewStaff((prev) => ({ ...prev, code, password }))
                toast.success('Nhân viên đã thêm thành công! Thông tin đã gửi qua email.')
                resetForm() // Reset biểu mẫu
                navigate('/admin/manage/staff') // Điều hướng đến trang quản lý nhân viên
            }
        } catch (error) {
            toast.error(`Lỗi lưu nhân viên`) // Hiển thị lỗi
        } finally {
            setSubmitting(false) // Kết thúc trạng thái gửi
        }
    }


    // Hàm reset biểu mẫu
    // const handleReset = (resetForm: () => void) => {
    //     // Keep the state of `isDisableAddressByScanner` as it is
    //     resetForm();
    //     setNewStaff(initialStaffState); // Reset the staff state
    // }
    const handleFullReset = (resetForm: () => void) => {
        // This function resets the form and keeps the disable state if needed
        resetForm(); // Resets the form fields using Formik's reset function
        setNewStaff(initialStaffState); // Resets the staff data
        setIsDisableAddressByScanner(false); // Optionally reset the disable state or leave if intended to block non-scanned input

        // If there are any specific independent states that should persist or reset differently, manage them here
        // For example, handling loading states or specific UI flags
    };

    // Hàm đóng snackbar
    const handleSnackbarClose = () => {
        setSnackbarOpen(false)
    }

    // Hàm mở hộp thoại quét mã CCCD
    const handleQuetCCCDNhanVienClick = () => {
        setOpenDialog(true)
    }

    // Hàm đóng hộp thoại
    const handleCloseDialog = () => {
        setOpenDialog(false)
    }

    // Hàm định dạng ngày
    const parseDate = (dateString: string): string | null => {
        if (dateString.length === 8) {
            const day = dateString.slice(0, 2)
            const month = dateString.slice(2, 4)
            const year = dateString.slice(4, 8)
            const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            return formattedDate // Trả về định dạng ngày chuẩn
        }
        return null
    }

    // Hook để quét mã QR
    useEffect(() => {
        if (openDialog && scannerRef.current) {
            const html5QrCodeScanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 350 }, false)

            html5QrCodeScanner.render(
                async (data: string) => {
                    console.log('data: ', data)
                    const cccdParts = data.split('|')
                    if (cccdParts.length >= 6) {
                        const citizenId = cccdParts[0]
                        const name = cccdParts[2]
                        const birthDay = parseDate(cccdParts[3])
                        const gender = cccdParts[4] === 'Nam'
                        const diaChi = cccdParts[5]
                        const diaChiSplit = diaChi.split(',')

                        if (!birthDay) {
                            console.error('Invalid date format in QR code')
                            return
                        }

                        const soNha = diaChiSplit[0]
                        const tinhName = diaChiSplit[3] || '' // check to prevent undefined
                        let foundTinh: any = null
                        if (tinhName.toLowerCase() != '') {
                            foundTinh = provinces.find((province) =>
                                province.full_name.toLowerCase().includes(tinhName.toLowerCase())
                            )
                        }


                        if (foundTinh && foundTinh?.id) {
                            try {
                                const districtResponse = await axios.get(`https://esgoo.net/api-tinhthanh/2/${foundTinh.id}.htm`)
                                if (districtResponse.status === 200) {
                                    setDistricts(districtResponse.data.data)
                                    const foundQuanOBJ = districtResponse.data.data.find((district: District) =>
                                        district.full_name.toLowerCase().includes((diaChiSplit[2] || '').toLowerCase())
                                    )

                                    if (foundQuanOBJ && foundQuanOBJ.id) {
                                        const wardResponse = await axios.get(`https://esgoo.net/api-tinhthanh/3/${foundQuanOBJ.id}.htm`)
                                        if (wardResponse.status === 200) {
                                            setWards(wardResponse.data.data)
                                            const foundPhuongOBJ = wardResponse.data.data.find((ward: Ward) =>
                                                ward.full_name.toLowerCase().includes((diaChiSplit[1] || '').toLowerCase())
                                            )

                                            setNewStaff(prevState => ({
                                                ...prevState,
                                                citizenId,
                                                name,
                                                birthDay,
                                                address: soNha,
                                                province: foundTinh?.full_name || null,
                                                district: foundQuanOBJ?.full_name || null,
                                                ward: foundPhuongOBJ?.full_name || null,
                                                gender
                                            }))
                                            console.log(foundTinh.full_name)
                                            console.log(foundQuanOBJ.full_name)
                                            console.log(foundPhuongOBJ.full_name)

                                            // disable
                                            setIsDisableAddressByScanner(true)

                                            // form.setFieldValue('province', foundTinh.full_name || '')
                                            // form.setFieldValue('district', foundQuanOBJ.full_name || '')
                                            // form.setFieldValue('ward', foundPhuongOBJ?.full_name || '')
                                        }
                                    }
                                }
                            } catch (error) {
                                console.error(error) // Add proper error handling
                            }
                        } else {
                            console.error('Province not found')
                            setIsDisableAddressByScanner(false)
                            setNewStaff(prevState => ({
                                ...prevState,
                                citizenId,
                                name,
                                birthDay,
                                address: soNha,
                                province: '',
                                district: '',
                                ward: '',
                                gender
                            }))
                        }

                        setOpenDialog(false) // Close dialog after scanning
                        html5QrCodeScanner.clear() // Clear the scanner
                    } else {
                        console.error('Invalid QR code format')
                    }
                },
                (error: unknown) => {
                    console.error(error) // Handle scan error
                }
            )

            return () => {
                html5QrCodeScanner.clear() // Cleanup when the component is unmounted
            }
        }
    }, [openDialog, provinces])

    // Đồng bộ dữ liệu mới với Formik
    const SyncFormikWithNewStaff = () => {
        const formik = useFormikContext<Staff>()

        useEffect(() => {
            formik.setValues(newStaff) // Cập nhật giá trị Formik
        }, [newStaff])

        return null // Không trả về gì
    }

    return (
        <div>
            {/* <h1 className="text-center font-semibold text-2xl mb-4 text-transform: uppercase">Thêm nhân viên</h1> */}

            <div className="bg-white p-6 shadow-md rounded-lg mb-6 w-full">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                }}>
                    {/* Left-aligned Heading */}
                    <p className="text-left text-xl font-bold">THÊM NHÂN VIÊN</p>

                    {/* Right-aligned Button */}
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            color="primary"
                            className="btn-outline-info"
                            onClick={handleQuetCCCDNhanVienClick}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <BsQrCodeScan className="mr-2" style={{ fontSize: '24px' }} />
                            Quét CCCD
                        </Button>
                    </Box>
                </div>

                <div
                    className={`shadow-xl px-8 z-10 bg-white py-2 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/6 ${openDialog ? '' : 'hidden'}`}>
                    <div className="flex flex-col">
                        <div className="flex justify-between">
                            <label>Quét thẻ căn cước công dân</label>
                            <button onClick={handleCloseDialog}><CloseOutlined /></button>
                        </div>
                        <div>
                            <div id="reader" ref={scannerRef}></div>
                        </div>
                    </div>
                </div>
                <Formik
                    initialValues={newStaff}
                    validationSchema={validationSchema}
                    validateOnChange={true} // Xác thực khi thay đổi
                    validateOnBlur={true} // Xác thực khi mất tiêu điểm
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                >
                    {({ errors, touched, resetForm, setFieldValue, values, isSubmitting }) => (
                        <Form>
                            <SyncFormikWithNewStaff />
                            <FormContainer>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                                    <div style={{ flex: '1 1 300px', minWidth: '200px' }}>
                                        <FormItem asterisk label="Họ tên nhân viên">
                                            <Field
                                                type="text"
                                                autoComplete="on"
                                                name="name"
                                                placeholder="Nhập họ tên nhân viên..."
                                                component={Input}
                                                disabled={isDisableAddressByScanner}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setFieldValue('name', e.target.value);
                                                    setNewStaff((prev) => ({ ...prev, name: e.target.value }));
                                                }}
                                                value={newStaff.name}
                                            />
                                            {touched.name && errors.name && (
                                                <div style={{
                                                    color: 'red',
                                                    fontSize: '0.875rem',
                                                    marginTop: '0.25rem',
                                                    minHeight: '20px'
                                                }}>
                                                    {errors.name}
                                                </div>
                                            )}
                                        </FormItem>

                                        <FormItem asterisk label="Căn cước công dân">
                                            <Field
                                                type="text"
                                                autoComplete="on"
                                                name="citizenId"
                                                placeholder="Nhập căn cước công dân..."
                                                component={Input}
                                                disabled={isDisableAddressByScanner}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                                    setFieldValue('citizenId', value);
                                                    setNewStaff((prev) => ({ ...prev, citizenId: value }));
                                                }}
                                                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                    if (!/[0-9]/.test(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                value={newStaff.citizenId || ''}
                                            />
                                            {touched.citizenId && errors.citizenId && (
                                                <div style={{
                                                    color: 'red',
                                                    fontSize: '0.875rem',
                                                    marginTop: '0.25rem',
                                                    minHeight: '20px'
                                                }}>
                                                    {errors.citizenId}
                                                </div>
                                            )}
                                        </FormItem>

                                        <FormItem
                                            asterisk
                                            label="Ngày sinh"
                                            invalid={errors.birthDay && touched.birthDay}
                                            errorMessage={errors.birthDay}
                                        >
                                            <DatePicker
                                                inputtable
                                                inputtableBlurClose={false}
                                                placeholder="Chọn ngày sinh..."
                                                value={newStaff.birthDay ? dayjs(newStaff.birthDay, 'YYYY-MM-DD').toDate() : null}
                                                disabled={isDisableAddressByScanner}
                                                onChange={(date) => {
                                                    if (date) {
                                                        const formattedDate = dayjs(date).format('YYYY-MM-DD');
                                                        setFieldValue('birthDay', formattedDate);
                                                        setNewStaff((prev) => ({
                                                            ...prev,
                                                            birthDay: formattedDate
                                                        }));
                                                    } else {
                                                        setFieldValue('birthDay', '');
                                                        setNewStaff((prev) => ({
                                                            ...prev,
                                                            birthDay: ''
                                                        }));
                                                    }
                                                }}
                                                disableDate={(current) => {
                                                    const dayjsCurrent = dayjs(current);
                                                    return dayjsCurrent.isAfter(dayjs().endOf('day'));
                                                }}
                                            />
                                        </FormItem>

                                        <FormItem asterisk label="Giới tính">
                                            <Field name="gender">
                                                {({ field, form }: FieldProps) => (
                                                    <>
                                                        <Radio
                                                            className="mr-4"
                                                            value="Nam"
                                                            checked={newStaff.gender === true}
                                                            onChange={() => {
                                                                form.setFieldValue('gender', true);
                                                                setNewStaff((prev) => ({ ...prev, gender: true }));
                                                            }}
                                                            disabled={isDisableAddressByScanner}
                                                        >
                                                            Nam
                                                        </Radio>
                                                        <Radio
                                                            value="Nữ"
                                                            checked={newStaff.gender === false}
                                                            onChange={() => {
                                                                form.setFieldValue('gender', false);
                                                                setNewStaff((prev) => ({ ...prev, gender: false }));
                                                            }}
                                                            disabled={isDisableAddressByScanner}
                                                        >
                                                            Nữ
                                                        </Radio>
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>
                                    </div>
                                    <div style={{ flex: '1 1 300px', minWidth: '200px' }}>
                                        <FormItem
                                            asterisk
                                            label="Tỉnh/Thành phố"
                                            invalid={errors.province && touched.province}
                                            errorMessage={errors.province}
                                        >
                                            <Field name="province">
                                                {({ form }: FieldProps<Staff>) => (
                                                    <Select
                                                        isDisabled={loadingProvinces || isDisableAddressByScanner}
                                                        value={provinces.find(s => s.full_name === newStaff.province) || null}
                                                        placeholder="Chọn tỉnh/thành phố..."
                                                        getOptionLabel={(option) => option.full_name}
                                                        getOptionValue={(option) => option.full_name}
                                                        options={provinces}
                                                        onChange={(newValue: SingleValue<Province> | null) => {
                                                            handleLocationChange('province', newValue, form)
                                                            form.setFieldValue('province', newValue ? newValue.full_name : '')
                                                            setNewStaff((prev) => ({
                                                                ...prev,
                                                                province: newValue ? newValue.full_name : ''
                                                            }))
                                                        }}
                                                        onBlur={() => form.setFieldTouched('province', true)}
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>
                                        <FormItem
                                            asterisk
                                            label="Quận/huyện"
                                            invalid={errors.district && touched.district}
                                            errorMessage={errors.district}
                                        >
                                            <Field name="district">
                                                {({ form }: FieldProps<Staff>) => (
                                                    <Select
                                                        isDisabled={isDisableAddressByScanner}
                                                        value={districts.find(s => s.full_name === newStaff.district) || null}
                                                        placeholder="Chọn quận/huyện..."
                                                        getOptionLabel={(option) => option.full_name}
                                                        getOptionValue={(option) => option.full_name}
                                                        options={districts}
                                                        onChange={(newValue: SingleValue<District> | null) => {
                                                            handleLocationChange('district', newValue, form)
                                                            form.setFieldValue('district', newValue ? newValue.full_name : '')
                                                            setNewStaff((prev) => ({
                                                                ...prev,
                                                                district: newValue ? newValue.full_name : ''
                                                            }))
                                                        }}
                                                        onBlur={() => form.setFieldTouched('district', true)}
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>
                                        <FormItem
                                            asterisk
                                            label="Xã/phường/thị trấn"
                                            invalid={errors.ward && touched.ward}
                                            errorMessage={errors.ward}
                                        >
                                            <Field name="ward">
                                                {({ form }: FieldProps<Staff>) => (
                                                    <Select
                                                        isDisabled={isDisableAddressByScanner}
                                                        value={wards.find(s => s.full_name === newStaff.ward) || null}
                                                        placeholder="Chọn xã/phường/thị trấn..."
                                                        getOptionLabel={(option) => option.full_name}
                                                        getOptionValue={(option) => option.full_name}
                                                        options={wards}
                                                        onChange={(newValue: SingleValue<Ward> | null) => {
                                                            handleLocationChange('ward', newValue, form)
                                                            form.setFieldValue('ward', newValue ? newValue.full_name : '')
                                                            setNewStaff((prev) => ({
                                                                ...prev,
                                                                ward: newValue ? newValue.full_name : ''
                                                            }))
                                                        }}
                                                        onBlur={() => form.setFieldTouched('ward', true)}
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>
                                        <FormItem
                                            asterisk
                                            label="Số đường/số nhà"
                                            invalid={!!errors.address && touched.address}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="on"
                                                name="address"
                                                placeholder="Nhập số đường/số nhà..."
                                                component={Input}
                                                disabled={isDisableAddressByScanner && newStaff.address !== 'null' && newStaff.address !== 'null null'}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setFieldValue('address', e.target.value);
                                                    setNewStaff((prev) => ({ ...prev, address: e.target.value }));
                                                }}
                                                value={newStaff.address}
                                            />
                                            {touched.address && errors.address && (
                                                <div style={{
                                                    color: 'red',
                                                    fontSize: '0.875rem',
                                                    marginTop: '0.25rem',
                                                    minHeight: '20px'
                                                }}>
                                                    {errors.address}
                                                </div>
                                            )}
                                        </FormItem>
                                    </div>
                                    <div style={{ flex: '1 1 300px', minWidth: '200px' }}>
                                        <FormItem asterisk label="Số điện thoại">
                                            <Field
                                                type="text"
                                                autoComplete="on"
                                                name="phone"
                                                placeholder="Nhập số điện thoại..."
                                                component={Input}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    // Giữ lại chỉ các ký tự số
                                                    const value = e.target.value.replace(/[^0-9]/g, '')
                                                    setFieldValue('phone', value)
                                                    setNewStaff((prev) => ({ ...prev, phone: value }))
                                                }}
                                                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                    // Ngăn nhập ký tự không phải số
                                                    if (!/[0-9]/.test(e.key)) {
                                                        e.preventDefault()
                                                    }
                                                }}
                                                value={newStaff.phone || ''} // Đảm bảo giá trị là chuỗi, không phải undefined
                                            />
                                            {touched.phone && errors.phone && (
                                                <div style={{
                                                    color: 'red',
                                                    fontSize: '0.875rem',
                                                    marginTop: '0.25rem',
                                                    minHeight: '20px'
                                                }}>
                                                    {errors.phone}
                                                </div>
                                            )}
                                        </FormItem>

                                        <FormItem asterisk label="Email">
                                            <Field
                                                type="text"
                                                autoComplete="on"
                                                name="email"
                                                placeholder="Nhập email..."
                                                component={Input}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setFieldValue('email', e.target.value)
                                                    setNewStaff((prev) => ({ ...prev, email: e.target.value }))
                                                }}
                                                value={newStaff.email}
                                            />
                                            {touched.email && errors.email && (
                                                <div style={{
                                                    color: 'red',
                                                    fontSize: '0.875rem',
                                                    marginTop: '0.25rem',
                                                    minHeight: '20px'
                                                }}>
                                                    {errors.email}
                                                </div>
                                            )}
                                        </FormItem>
                                        <FormItem label="Ghi chú">
                                            <Field
                                                as={Input}
                                                name="note"
                                                placeholder="Nhập ghi chú"
                                                textArea
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setFieldValue('note', e.target.value)
                                                    setNewStaff((prev) => ({ ...prev, note: e.target.value }))
                                                }}
                                                value={newStaff.note}
                                                style={{ height: '150px' }} // Điều chỉnh chiều cao
                                            />
                                        </FormItem>

                                    </div>
                                </div>

                                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center' }}>
                                    <Button
                                        type="submit"
                                        className="flex items-center justify-center"
                                        variant="solid"
                                        color="blue-600"
                                        disabled={isSubmitting}
                                    >
                                        <IoPersonAdd className="mr-2" style={{ fontSize: '20px' }} />
                                        Lưu
                                    </Button>

                                    <Button
                                        type="button"
                                        onClick={() => handleFullReset(resetForm)} // Replace this onClick handler
                                        className="flex items-center justify-center"
                                        style={{
                                            height: '40px',
                                            width: '110px',
                                            lineHeight: '40px',
                                            padding: '0',
                                            fontSize: '15px',
                                            marginLeft: '1rem'
                                        }}
                                    >
                                        <RxReset className="mr-2" style={{ fontSize: '18px' }} />
                                        Đặt lại
                                    </Button>
                                </div>


                            </FormContainer>
                        </Form>
                    )}
                </Formik>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    message={snackbarMessage}
                />
            </div>
        </div>
    )
}

export default AddStaffPage