import React, { useState, useEffect } from 'react';
import { Snackbar } from '@mui/material';
import { Formik, Field, Form, FormikHelpers, FieldProps, FormikErrors } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { FormItem, FormContainer } from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import DatePicker from '@/components/ui/DatePicker';
import Radio from '@/components/ui/Radio';
import Select from '@/components/ui/Select';
import { toast } from 'react-toastify';
import { SingleValue } from 'react-select';
import { RxReset } from "react-icons/rx";
import { GrUpdate } from "react-icons/gr";

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
    deleted: false,
};

// const validationSchema = Yup.object().shape({
//   name: Yup.string()
//     .required('Họ tên khách hàng là bắt buộc')
//     .min(5, "Họ và tên khách hàng phải có ít nhất 5 ký tự")
//     .max(100, "Họ và tên khách hàng không vượt quá 100 ký tự")
//     .test('no-whitespace', 'Họ và tên không được chứa nhiều khoảng trắng', value => value?.trim() === value && !value.includes('  '))
//     .test('no-special-characters', 'Họ và tên không được chứa ký tự đặc biệt hoặc số', value =>
//       value ? /^[\p{L}\s]+$/u.test(value) : false),
//   citizenId: Yup.string()
//     .matches(/^[0-9]{12}$/, "Căn cước công dân phải có đúng 12 chữ số")
//     .required("Căn cước công dân là bắt buộc"),
//   email: Yup.string()
//     .email("Email không hợp lệ")
//     .required("Email là bắt buộc")
//     .test('no-whitespace', 'Email không được chứa khoảng trắng đầu và cuối', value => value?.trim() === value)

//     .test('email-unique', 'Email đã tồn tại', async (email) => {
//       if (email === initialContact.currentEmail) return true; // Nếu email không thay đổi, bỏ qua xác thực

//       // Gọi API kiểm tra email có trùng không
//       const response = await axios.get(`http://localhost:8080/api/v1/customer/check-email`, { params: { email } });
//       return !response.data.exists; // Nếu email đã tồn tại, trả về false
//     }),
//   birthDay: Yup.date()
//     .required("Ngày sinh là bắt buộc")
//     .max(new Date(), "Ngày sinh không được là tương lai")
//     .test("age-range", "Nhân viên phải trong độ tuổi từ 16 đến 40", value => {
//       const age = dayjs().diff(dayjs(value), 'year');
//       return age >= 16 && age <= 40;
//     }),
//   address: Yup.string().required("Số nhà là bắt buộc"),
//   phone: Yup.string()
//     .required("Số điện thoại là bắt buộc")
//     .matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"),
//   province: Yup.string().required("Tỉnh/Thành phố là bắt buộc"),
//   district: Yup.string().required("Quận/Huyện là bắt buộc"),
//   ward: Yup.string().required("Phường/Xã là bắt buộc"),
//   note: Yup.string(),
//   gender: Yup.boolean().required("Giới tính là bắt buộc"),
// });

const UpdateStaffPage = () => {
    const [staff, setStaff] = useState<Staff>(initialStaffState);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [initialContact, setInitialContact] = useState({
        currentEmail: '',
        currentPhone: '',
        email: '', // Khởi tạo email
        phone: '', // Khởi tạo phone
    });

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Họ tên khách hàng là bắt buộc')
            .min(5, "Họ và tên khách hàng phải có ít nhất 5 ký tự")
            .max(100, "Họ và tên khách hàng không vượt quá 100 ký tự")
            .test('no-whitespace', 'Họ và tên không được chứa nhiều khoảng trắng', value => value?.trim() === value && !value.includes('  '))
            .test('no-special-characters', 'Họ và tên không được chứa ký tự đặc biệt hoặc số', value =>
                value ? /^[\p{L}\s]+$/u.test(value) : false),
        citizenId: Yup.string()
            .matches(/^[0-9]{12}$/, "Căn cước công dân phải có đúng 12 chữ số")
            .required("Căn cước công dân là bắt buộc"),
        email: Yup.string()
            .email("Email không hợp lệ")
            .required("Email là bắt buộc")
            .test('no-whitespace', 'Email không được chứa khoảng trắng đầu và cuối', value => value?.trim() === value)

            .test('email-unique', 'Email đã tồn tại', async (email) => {
                if (email === initialContact.currentEmail) return true; // Nếu email không thay đổi, bỏ qua xác thực

                // Gọi API kiểm tra email có trùng không
                const response = await axios.get(`http://localhost:8080/api/v1/staffs/check-email`, { params: { email } });
                return !response.data.exists; // Nếu email đã tồn tại, trả về false
            }),
        birthDay: Yup.date()
            .required("Ngày sinh là bắt buộc")
            .max(new Date(), "Ngày sinh không được là tương lai")
            .test("age-range", "Nhân viên phải trong độ tuổi từ 16 đến 40", value => {
                const age = dayjs().diff(dayjs(value), 'year');
                return age >= 16 && age <= 40;
            }),
        address: Yup.string().required("Số nhà là bắt buộc"),
        phone: Yup.string()
            .required("Số điện thoại là bắt buộc")
            .matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ")
            .test('phone-unique', 'Số điện thoại đã tồn tại', async (phone) => {
                if (phone === initialContact.currentPhone) return true; // Nếu phone không thay đổi, bỏ qua xác thực

                // Gọi API kiểm tra số điện thoại có trùng không
                const response = await axios.get(`http://localhost:8080/api/v1/staffs/check-phone`, { params: { phone } });
                return !response.data.exists; // Nếu phone đã tồn tại, trả về false
            }),
        province: Yup.string().required("Tỉnh/Thành phố là bắt buộc"),
        district: Yup.string().required("Quận/Huyện là bắt buộc"),
        ward: Yup.string().required("Phường/Xã là bắt buộc"),
        note: Yup.string(),
        gender: Yup.boolean().required("Giới tính là bắt buộc"),
    });

    useEffect(() => {
        if (id) {
            fetchStaff(id);
        }
        fetchProvinces();
    }, [id]);

    useEffect(() => {
        if (staff.province && provinces.length > 0) {
            const province = provinces.find((prov) => prov.full_name === staff.province);
            if (province) {
                fetchDistricts(province.id);
            } else {
                setDistricts([]);
            }
        }
    }, [staff.province, provinces]);

    useEffect(() => {
        if (staff.district && districts.length > 0) {
            const district = districts.find((dist) => dist.full_name === staff.district);
            if (district) {
                fetchWards(district.id);
            } else {
                setWards([]);
            }
        }
    }, [staff.district, districts]);

    const fetchProvinces = async () => {
        setLoadingProvinces(true);
        try {
            const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
            if (response.data.error === 0) {
                setProvinces(response.data.data);
            } else {
                toast.error(`Error loading provinces: ${response.data.message}`);
            }
        } catch (error) {
            toast.error('Failed to load provinces.');
        } finally {
            setLoadingProvinces(false);
        }
    };

    const fetchDistricts = async (provinceId: string) => {
        setLoadingDistricts(true);
        try {
            const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`);
            if (response.data.error === 0) {
                setDistricts(response.data.data);
            } else {
                setDistricts([]);
            }
        } catch (error) {
            setDistricts([]);
        } finally {
            setLoadingDistricts(false);
        }
    };

    const fetchWards = async (districtId: string) => {
        setLoadingWards(true);
        try {
            const response = await axios.get(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`);
            if (response.data.error === 0) {
                setWards(response.data.data);
            } else {
                setWards([]);
            }
        } catch (error) {
            setWards([]);
        } finally {
            setLoadingWards(false);
        }
    };

    const fetchStaff = async (id: string): Promise<Staff | undefined> => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/staffs/${id}`);
            console.log('Data: ', response)
            const fetchedStaff = response.data;
            const formattedStaff = {
                ...fetchedStaff,
                birthDay: dayjs(fetchedStaff.birthDay, 'DD-MM-YYYY').format('YYYY-MM-DD')
            };
            setStaff(formattedStaff);
            setInitialContact({
                currentEmail: fetchedStaff.email,
                currentPhone: fetchedStaff.phone,
                email: fetchedStaff.email, // Cập nhật email từ fetchedStaff
                phone: fetchedStaff.phone,   // Cập nhật phone từ fetchedStaff
            });
            return formattedStaff; // Return the formatted data
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    };

    const handleLocationChange = (
        type: 'province' | 'district' | 'ward',
        newValue: Province | District | Ward | null,
        form: FormikHelpers<Staff>
    ) => {
        if (newValue) {
            if (type === 'province') {
                form.setFieldValue('province', newValue.full_name);
                form.setFieldValue('district', '');
                form.setFieldValue('ward', '');
                setStaff((prev) => ({ ...prev, province: newValue.full_name, district: null, ward: null }));
                fetchDistricts(newValue.id);
            } else if (type === 'district') {
                form.setFieldValue('district', newValue.full_name);
                form.setFieldValue('ward', '');
                setStaff((prev) => ({ ...prev, district: newValue.full_name, ward: null }));
                fetchWards(newValue.id);
            } else if (type === 'ward') {
                form.setFieldValue('ward', newValue.full_name);
                setStaff((prev) => ({ ...prev, ward: newValue.full_name }));
            }
        }
    };

    const handleSubmit = async (values: Staff, { resetForm, setSubmitting }: FormikHelpers<Staff>) => {
        try {
            const formattedValues = {
                ...values,
                birthDay: values.birthDay ? dayjs(values.birthDay).format('YYYY-MM-DD') : '',
            };

            await axios.put(`http://localhost:8080/api/v1/staffs/${id}`, formattedValues);
            resetForm();
            toast.success('Nhân viên đã được cập nhật thành công.');
            navigate("/admin/manage/staff");
        } catch (error) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.message || error.message
                : error instanceof Error ? error.message : 'Có lỗi xảy ra';
            toast.error(`Lỗi cập nhật nhân viên. ${errorMessage}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReset = async (setValues: (values: Staff, shouldValidate?: boolean) => Promise<void | FormikErrors<Staff>>) => {
        if (id) {
            try {
                const fetchedStaff = await fetchStaff(id);
                if (fetchedStaff) {
                    setValues(fetchedStaff); // Repopulate the form with fetched data
                }
            } catch (error) {
                console.error('Failed to reset form:', error);
            }
        }
    };

    return (
        <div>
            <div className="bg-white p-6 shadow-md rounded-lg mb-6 w-full">
                <p className="text-left text-xl font-bold mx-auto mb-2">CẬP NHẬT NHÂN VIÊN</p>
                <Formik
                    initialValues={staff}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                >
                    {({ errors, touched, resetForm, setFieldValue, values, setValues, isSubmitting }) => (
                        <Form>
                            <FormContainer>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                                    <div style={{ flex: '1 1 300px', minWidth: '200px' }}>
                                        <FormItem asterisk label="Họ tên nhân viên">
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="name"
                                                placeholder="Nhập họ tên nhân viên..."
                                                component={Input}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setFieldValue('name', e.target.value);
                                                    setStaff((prev) => ({ ...prev, name: e.target.value }));
                                                }}
                                            />
                                            {touched.name && errors.name && (
                                                <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem', minHeight: '20px' }}>
                                                    {errors.name}
                                                </div>
                                            )}
                                        </FormItem>

                                        <FormItem asterisk label="Căn cước công dân">
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="citizenId"
                                                placeholder="Nhập căn cước công dân..."
                                                component={Input}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                                    setFieldValue('citizenId', value);
                                                    setStaff((prev) => ({ ...prev, citizenId: value }));
                                                }}
                                                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                    if (!/[0-9]/.test(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                value={staff.citizenId || ''}
                                            />
                                            {touched.citizenId && errors.citizenId && (
                                                <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem', minHeight: '20px' }}>
                                                    {errors.citizenId}
                                                </div>
                                            )}
                                        </FormItem>

                                        <FormItem
                                            asterisk
                                            label="Ngày sinh"
                                            invalid={!!errors.birthDay && touched.birthDay}
                                            errorMessage={errors.birthDay}
                                        >
                                            <DatePicker
                                                inputtable
                                                inputtableBlurClose={false}
                                                placeholder="Chọn ngày sinh..."
                                                value={values.birthDay ? dayjs(values.birthDay, 'YYYY-MM-DD').toDate() : null}
                                                onChange={(date) => {
                                                    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
                                                    setFieldValue('birthDay', formattedDate);
                                                }}
                                                disableDate={(current) => dayjs(current).isAfter(dayjs().endOf('day'))}
                                            />
                                        </FormItem>

                                        <FormItem
                                            asterisk
                                            label="Giới tính"
                                        >
                                            <Field name="gender">
                                                {({ field, form }: FieldProps) => (
                                                    <>
                                                        <Radio
                                                            className="mr-4"
                                                            value="Nam"
                                                            checked={staff.gender === true}
                                                            onChange={() => {
                                                                form.setFieldValue('gender', true);
                                                                setStaff((prev) => ({ ...prev, gender: true }));
                                                            }}
                                                        >
                                                            Nam
                                                        </Radio>
                                                        <Radio
                                                            value="Nữ"
                                                            checked={staff.gender === false}
                                                            onChange={() => {
                                                                form.setFieldValue('gender', false);
                                                                setStaff((prev) => ({ ...prev, gender: false }));
                                                            }}
                                                        >
                                                            Nữ
                                                        </Radio>
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>
                                    </div>
                                    <div style={{ flex: '1 1 300px', minWidth: '200px' }}>
                                        <FormItem asterisk label="Tỉnh/Thành phố">
                                            <Field name="province">
                                                {({ field, form }: FieldProps<string>) => (
                                                    <Select
                                                        isDisabled={loadingProvinces}
                                                        value={provinces.find((prov) => prov.full_name === field.value) || null}
                                                        placeholder="Chọn tỉnh/thành phố..."
                                                        getOptionLabel={(option) => option.full_name}
                                                        getOptionValue={(option) => option.full_name}
                                                        options={provinces}
                                                        onChange={(newValue: SingleValue<Province> | null) => {
                                                            handleLocationChange('province', newValue, form);
                                                        }}
                                                        onBlur={() => form.setFieldTouched('province', true)}
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>

                                        <FormItem asterisk label="Quận/huyện">
                                            <Field name="district">
                                                {({ field, form }: FieldProps<string>) => (
                                                    <Select
                                                        isDisabled={loadingDistricts || !staff.province}
                                                        value={districts.find((dist) => dist.full_name === field.value) || null}
                                                        placeholder="Chọn quận/huyện..."
                                                        getOptionLabel={(option) => option.full_name}
                                                        getOptionValue={(option) => option.id}
                                                        options={districts}
                                                        onChange={(newValue: SingleValue<District> | null) => {
                                                            handleLocationChange('district', newValue, form);
                                                        }}
                                                        onBlur={() => form.setFieldTouched('district', true)}
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>

                                        <FormItem asterisk label="Xã/phường/thị trấn">
                                            <Field name="ward">
                                                {({ field, form }: FieldProps<string>// Continuing from where you left off
                                                ) => (
                                                    <Select
                                                        isDisabled={loadingWards || !staff.district}
                                                        value={wards.find((ward) => ward.full_name === field.value) || null}
                                                        placeholder="Chọn xã/phường/thị trấn..."
                                                        getOptionLabel={(option) => option.full_name}
                                                        getOptionValue={(option) => option.full_name}
                                                        options={wards}
                                                        onChange={(newValue: SingleValue<Ward> | null) => {
                                                            handleLocationChange('ward', newValue, form);
                                                        }}
                                                        onBlur={() => form.setFieldTouched('ward', true)}
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>

                                        <FormItem
                                            asterisk
                                            label="Địa chỉ"
                                            invalid={!!errors.address && touched.address}
                                            errorMessage={errors.address}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="address"
                                                placeholder="Nhập địa chỉ..."
                                                component={Input}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setFieldValue('address', e.target.value);
                                                    setStaff((prev) => ({ ...prev, address: e.target.value }));
                                                }}
                                            />
                                        </FormItem>
                                    </div>
                                    <div style={{ flex: '1 1 300px', minWidth: '200px' }}>
                                        <FormItem asterisk label="Số điện thoại">
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="phone"
                                                placeholder="Nhập số điện thoại..."
                                                component={Input}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                                    setFieldValue('phone', value);
                                                    setStaff((prev) => ({ ...prev, phone: value }));
                                                }}
                                                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                    if (!/[0-9]/.test(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                value={staff.phone || ''}
                                            />
                                            {touched.phone && errors.phone && (
                                                <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem', minHeight: '20px' }}>
                                                    {errors.phone}
                                                </div>
                                            )}
                                        </FormItem>

                                        <FormItem asterisk label="Email">
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="email"
                                                placeholder="Nhập email..."
                                                component={Input}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setFieldValue('email', e.target.value);
                                                    setStaff((prev) => ({ ...prev, email: e.target.value }));
                                                }}
                                            />
                                            {touched.email && errors.email && (
                                                <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem', minHeight: '20px' }}>
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
                                                    setFieldValue('note', e.target.value);
                                                    setStaff((prev) => ({ ...prev, note: e.target.value }));
                                                }}
                                                style={{ height: '150px' }}
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
                                        style={{
                                            height: '40px',
                                            width: '200px',
                                            marginRight: '15px',
                                            lineHeight: '40px',
                                            padding: '0',
                                        }}
                                    >
                                        <GrUpdate className="mr-2" style={{ fontSize: '20px' }} />
                                        Cập Nhật
                                    </Button>

                                    <Button
                                        type="button"
                                        onClick={() => handleReset(setValues)}
                                        className="flex items-center justify-center"
                                        style={{
                                            height: '40px',
                                            width: '110px',
                                            lineHeight: '40px',
                                            padding: '0',
                                            fontSize: '15px'
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
            </div>
        </div>
    );
};

export default UpdateStaffPage;