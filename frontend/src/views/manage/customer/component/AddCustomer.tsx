import React, { useEffect, useState } from "react";
import axios from "axios";
import * as Yup from 'yup';
import { FormItem, FormContainer } from '@/components/ui/Form';
import { Field, FieldProps, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import Button from '@/components/ui/Button';
import { Input, Radio, Select } from "@/components/ui";
import DatePicker from '@/components/ui/DatePicker';
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { toast } from 'react-toastify';
import instance from "@/axios/CustomAxios";


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
};

type AddressDTO = {
  id: string;
  name: string;
  phone: string;
  provinceId: number;
  districtId: number;
  wardId: number;
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
  WardCode: number;
  DistrictID: number;
  WardName: string;
}

// Hàm Check validator
const validationSchema = Yup.object({

  name: Yup.string().required('Họ tên khách hàng là bắt buộc')
    .min(3, "Họ và tên khách hàng phải có ít nhất 3 ký tự")
    .max(50, "Họ và tên khách hàng không vượt quá 50 ký tự")
    .test('no-whitespace', 'Họ và tên không được chứa nhiều khoảng trắng', value => {
      // kiểm tra khoảng trắng thừa
      return value.trim() === value && !value.includes('  ')
    })
    .test('no-special-characters', 'Họ và tên không được chứa ký tự đặc biệt hoặc số', (value) => {
      // Kiểm tra ký tự đặc biệt và số
      return /^[\p{L}\s]+$/u.test(value); // sử dụng regex để kiểm tra
    }),

  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Email là bắt buộc")
    .test('no-whitespace', 'Email không được chứa khoảng trắng đầu và cuối', value => {
      return value.trim() === value
    })
    .test('no-leading-trailing-dot', 'Email không được chứa dấu chấm ở đầu hoặc cuối', value => {
      return value ? !/^\./.test(value) && !/\.$/.test(value) : true;
    })
    .test('no-consecutive-dots', 'Email không được chứa hai dấu chấm liên tiếp', value => {
      return value ? !/\.\./.test(value) : true;
    })
    .test("email-unique", "Email đã tồn tại", async (email: string) => {
      // Gọi API kiểm tra email có trùng hay không
      const response = await instance.get(`/customer/check-email`, { params: { email } });
      // Đảo ngược giá trị trả về: exists: true nghĩa là email tồn tại, nên bạn trả về false để không hợp lệ
      return !response.data.exists; // API trả về { exists: true: chưa tồn tại / false: chưa tồn tại }
    }),

  phone: Yup.string()
    .required("Số điện thoại là bắt buộc")
    .matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ")
    .test('valid-vietnam-phone', 'Số điện thoại phải bắt đầu bằng đầu số hợp lệ', value => {
      const vietnamesePrefixes = ["03", "05", "07", "08", "09", "012", "016", "018", "019"];
      return value ? vietnamesePrefixes.some(prefix => value.startsWith(prefix)) : false;
    })
    .test("phone-unique", "Số điện thoại đã tồn tại", async (phone: string) => {
      // Gọi API kiểm tra phone có trùng không
      const response = await instance.get(`/customer/check-phone`, { params: { phone } });
      return !response.data.exists; // API trả về { exists: true: Tồn tại / false: chưa tồn tại }
    }),

  birthDate: Yup.date()
    .required("Ngày sinh là bắt buộc")
    .max(new Date(), "Ngày sinh không được là tương lai")
    .test(
      "age-range",
      "Độ tuổi của bạn không đủ điều kiện để mua hàng",
      function (value) {
        const age = dayjs().diff(dayjs(value), 'year');
        return age >= 10 && age <= 100;
      }
    ),

  gender: Yup.string()
    .required('Vui lòng chọn giới tính')
    .oneOf(['Nam', 'Nữ'], 'Giới tính không hợp lệ'),

  addressDTOS: Yup.array().of(
    Yup.object().shape({
      province: Yup.string().required('Vui lòng chọn tỉnh/thành phố'),
      district: Yup.string().required('Vui lòng chọn quận/huyện'),
      ward: Yup.string().required('Vui lòng chọn xã/phường/thị trấn'),
      detail: Yup.string()
        .required('Vui lòng nhập địa chỉ cụ thể')
        .min(5, 'Địa chỉ cụ thể phải có ít nhất 5 ký tự')
        .max(200, 'Địa chỉ cụ thể không vượt quá 200 ký tự')
        .test('no-leading-trailing-whitespace', 'Không được có khoảng trắng đầu hoặc cuối', value => {
          return value ? value.trim() === value : false;
        })
        .test('no-consecutive-whitespace', 'Không được chứa nhiều khoảng trắng liên tiếp', value => {
          return value ? !/\s{2,}/.test(value) : false;
        })
        .test('valid-characters', 'Chỉ được chứa ký tự chữ, số và dấu phân cách thông dụng', value => {
          return value ? /^[\p{L}0-9\s,.-]+$/u.test(value) : false;
        })
    })
  ),
})

const AddCustomer = () => {
  const initialAddressDTO: AddressDTO = {
    id: '',
    name: '',
    phone: '',
    provinceId: 0,
    districtId: 0,
    wardId: 0,
    province: null,
    district: null,
    ward: null,
    detail: '',
    isDefault: true,
  };

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
  }

  const [newCustomer, setNewCustomer] = useState<CustomerDTO>(initialCustomerState);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (newCustomer.addressDTOS.length > 0) { // thêm điều kiện để tránh truy cập vào phần tử không tồn tại
      // Tách biến selectedProvince ra để tránh sử dụng biểu thức phức tạp trong dependencies
      const selectedAddress = newCustomer.addressDTOS[0];
      const selectedProvince = selectedAddress?.province;

      if (selectedProvince && provinces.length > 0) {
        const province = provinces.find((prov) => prov?.NameExtension[1] === selectedProvince);
        if (province) {
          fetchDistricts(province.ProvinceID);
        } else {
          setDistricts([]); // Xóa danh sách huyện nếu không tìm thấy tỉnh
        }
      } else {
        setDistricts([]); // Xóa danh sách huyện nếu không có tỉnh được chọn
      }
    }
  }, [newCustomer.addressDTOS, provinces]);

  useEffect(() => {
    if (newCustomer.addressDTOS.length > 0) {// thêm điều kiện để tránh truy cập vào phần tử không tồn tại
      // Tách biến selectedProvince ra để tránh sử dụng biểu thức phức tạp trong dependencies
      const selectedAddress = newCustomer.addressDTOS[0];
      const selectedDistrict = selectedAddress?.district;

      if (selectedDistrict && districts.length > 0) {
        const district = districts.find((dist) => dist.DistrictName === selectedDistrict);
        if (district) {
          fetchWards(district.DistrictID);
        } else {
          setWards([]);
        }
      } else {
        setWards([]); // Xóa danh sách xã/phường nếu không có huyện được chọn
      }
    }
  }, [newCustomer.addressDTOS, districts]);

  const fetchProvinces = async () => {
    setLoadingProvinces(true);
    try {
      const response = await axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", {
        headers: {
          'Content-Type': 'application/json',
          'Token': '718f2008-46b7-11ef-b4a4-2ec170e33d11'
        }
      });
      console.log('API Province Response: ', response)
      if (response.data.code === 200) {
        setProvinces(response.data.data);
      } else {
        console.log('Error fetching province: ', response.data.message) // Thông điệp lỗi từ API
        setProvinces([]);
        alert('Không thể tải danh sách tỉnh. Vui lòng thử lại sau.'); // Thông báo lỗi cho người dùng
      }
    } catch (error) {
      console.log('Error fetching province: ', error) // Log chi tiết lỗi
      setProvinces([]);
      alert('Đã xảy ra lỗi khi tải danh sách tỉnh. Vui lòng thử lại.'); // Thông báo lỗi cho người dùng
    } finally {
      setLoadingProvinces(false);
    }
  };

  const fetchDistricts = async (provinceId: number) => {
    setLoadingDistricts(true);
    try {
      const response = await axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district`, {
        headers: {
          'Content-Type': 'application/json',
          'Token': '718f2008-46b7-11ef-b4a4-2ec170e33d11'
        },
        params: { province_id: provinceId }
      });
      console.log('API District Response: ' + response)
      if (response.data.code === 200) {
        setDistricts(response.data.data);
      } else {
        console.log('Error fetching district: ', response.data.message) // Thông điệp lỗi từ API
        setDistricts([]);
        alert('Không thể tải danh sách huyện. Vui lòng thử lại sau.'); // Thông báo lỗi cho người dùng
      }
    } catch (error) {
      console.error('Error fetching districts:', error); // Log chi tiết lỗi
      setDistricts([]);
      alert('Đã xảy ra lỗi khi tải danh sách huyện. Vui lòng thử lại.'); // Thông báo lỗi cho người dùng
    } finally {
      setLoadingDistricts(false);
    }
  };

  const fetchWards = async (districtId: number) => {
    setLoadingWards(true);
    try {
      const response = await axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?${districtId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Token': '718f2008-46b7-11ef-b4a4-2ec170e33d11'
        },
        params: { district_id: districtId }
      })
      console.log('API Ward Response: ' + response)

      if (response.data.code === 200) {
        setWards(response.data.data);
      } else {
        console.log('Error fetching ward: ', response.data.message) // Thông điệp lỗi từ API
        setWards([]);
        alert('Không thể tải danh sách xã. Vui lòng thử lại sau.'); // Thông báo lỗi cho người dùng
      }
    } catch (error) {
      console.log('Error fetching ward: ', error) // Log chi tiết lỗi
      setWards([]);
      alert('Đã xảy ra lỗi khi tải danh sách xã. Vui lòng thử lại.'); // Thông báo lỗi cho người dùng
    } finally {
      setLoadingWards(false);
    }
  };

  const handleLocationChange = (
    type: 'province' | 'district' | 'ward',
    newValue: Province | District | Ward | null,
    form: FormikProps<CustomerDTO>,
  ) => {
    if (newValue) {
      setNewCustomer((prevCustomer) => {
        const updatedAddressDTOS = [...prevCustomer.addressDTOS];
        const selectedAddress = updatedAddressDTOS[0];

        if (type === 'province' && 'ProvinceID' && 'ProvinceName' in newValue) { // sử dụng câu lệnh kiểm tra kiểu (type guard) để xác định kiểu cụ thể của newValue
          // Cập nhật giá trị province
          selectedAddress.provinceId = newValue.ProvinceID;
          selectedAddress.province = newValue?.NameExtension[1];
          selectedAddress.districtId = 0;
          selectedAddress.district = null;
          selectedAddress.wardId = 0;
          selectedAddress.ward = null;

          // Cập nhật Formik và gọi fetchDistricts
          form.setFieldValue('addressDTOS[0].provinceId', selectedAddress.provinceId);
          form.setFieldValue('addressDTOS[0].province', selectedAddress.province);
          form.setFieldValue('addressDTOS[0].districtId', selectedAddress.districtId);
          form.setFieldValue('addressDTOS[0].district', selectedAddress.district);
          form.setFieldValue('addressDTOS[0].warId', selectedAddress.wardId);
          form.setFieldValue('addressDTOS[0].ward', selectedAddress.ward);

          fetchDistricts(newValue.ProvinceID);
        } else if (type === 'district' && 'DistrictID' && 'DistrictName' in newValue) {
          // Cập nhật giá trị district
          selectedAddress.districtId = newValue.DistrictID;
          selectedAddress.district = newValue.DistrictName;
          selectedAddress.wardId = 0;
          selectedAddress.ward = null;

          // Cập nhật Formik và gọi fetchWards
          form.setFieldValue('addressDTOS[0].districtId', selectedAddress.districtId);
          form.setFieldValue('addressDTOS[0].district', selectedAddress.district);
          form.setFieldValue('addressDTOS[0].wardId', selectedAddress.wardId);
          form.setFieldValue('addressDTOS[0].ward', selectedAddress.ward);

          fetchWards(newValue.DistrictID);
        } else if (type === 'ward' && 'WardCode' in newValue) {
          // Cập nhật giá trị ward
          selectedAddress.wardId = newValue.WardCode;
          selectedAddress.ward = newValue.WardName;

          // Cập nhật Formik
          form.setFieldValue('addressDTOS[0].wardId', selectedAddress.wardId);
          form.setFieldValue('addressDTOS[0].ward', selectedAddress.ward);
        }

        return {
          ...prevCustomer,
          addressDTOS: updatedAddressDTOS
        };
      });
    }
  };

  const handleSubmit = async (values: CustomerDTO, { resetForm, setSubmitting }: FormikHelpers<CustomerDTO>) => {
    try {
      const formattedValues = {
        ...values,
        birthDate: dayjs(values.birthDate).format('DD-MM-YYYY'), // Định dạng lại birthDate
      };

      console.log('Submitting formatted values:', formattedValues);

      const response = await instance.post('/customer/save', formattedValues);
      toast.success('Lưu thành công');
      resetForm();
      if (response.status === 201) {
        navigate('/admin/manage/customer');
      }
    } catch {

      setSubmitting(false);
    }

  };

  return (
    <Formik
      initialValues={initialCustomerState}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, resetForm, isSubmitting, values, errors, touched }) => (
        <Form>
          <div className="bg-white p-6 shadow-md rounded-lg mb-6 w-full">
            <h1 className="text-center font-semibold text-2xl mb-4 text-transform: uppercase">Thêm khách hàng</h1>
            <h4 className="font-medium text-xl mb-4">Thông tin khách hàng</h4>
            <div className="flex w-full">
              <div className="w-full lg:w-1/2 pr-4">
                <FormContainer>
                  <FormItem
                    asterisk
                    label="Họ tên khách hàng"
                    invalid={touched.name && Boolean(errors.name)}
                    errorMessage={errors.name}
                  >
                    <Field
                      type="text"
                      autoComplete="on"
                      name="name"
                      placeholder="Nhập họ tên khách hàng..."
                      style={{ height: '44px' }}
                      component={Input}
                    />
                  </FormItem>

                  <FormItem
                    asterisk
                    label="Email"
                    invalid={touched.email && Boolean(errors.email)}
                    errorMessage={errors.email}
                  >
                    <Field
                      type="text"
                      autoComplete="on"
                      name="email"
                      style={{ height: '44px' }}
                      placeholder="Nhập email..."
                      component={Input}
                    />
                  </FormItem>

                  <FormItem
                    asterisk
                    label="Số điện thoại"
                    invalid={touched.phone && Boolean(errors.phone)}
                    errorMessage={errors.phone}
                  >
                    <Field
                      type="tel"
                      autoComplete="on"
                      name="phone"
                      style={{ height: '44px' }}
                      placeholder="Nhập số điện thoại..."
                      component={Input}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value.replace(/\D/g, ''); // Chỉ cho phép nhập ký tự số
                        setFieldValue("phone", value); // Cập nhật giá trị trong Formik
                        setNewCustomer((prev) => ({ ...prev, phone: value })); // Cập nhật giá trị cho state newCustomer
                      }}
                    />
                  </FormItem>

                  <FormItem
                    asterisk
                    label="Ngày sinh"
                    invalid={touched.birthDate && Boolean(errors.birthDate)}
                    errorMessage={errors.birthDate}
                  >
                    <DatePicker
                      inputtable
                      inputtableBlurClose={false}
                      placeholder="Chọn ngày sinh..."
                      value={values.birthDate ? dayjs(values.birthDate, 'YYYY-MM-DD').toDate() : null}
                      disableDate={(current) => {
                        return dayjs(current).isAfter(dayjs().endOf('day'));
                      }}
                      // Prevents selection of future dates
                      onChange={(date) => {
                        const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
                        setFieldValue('birthDate', formattedDate);
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
                            checked={field.value === 'Nam'}
                            onChange={() => form.setFieldValue('gender', 'Nam')}
                            onBlur={() => form.setFieldTouched('gender', true)}
                          >
                            Nam
                          </Radio>
                          <Radio
                            value="Nữ"
                            checked={field.value === 'Nữ'}
                            onChange={() => form.setFieldValue('gender', 'Nữ')}
                            onBlur={() => form.setFieldTouched('gender', true)}
                          >
                            Nữ
                          </Radio>
                        </>
                      )}
                    </Field>
                  </FormItem>
                </FormContainer>
              </div>
              <div className="w-full lg:w-1/2 pl-4">
                <FormContainer>
                  <FormItem
                    asterisk
                    label="Tỉnh/thành phố"
                    invalid={touched.addressDTOS?.[0]?.province && Boolean(errors.addressDTOS?.[0]?.province)}
                    errorMessage={errors.addressDTOS?.[0]?.province}
                  >
                    <Field name="addressDTOS[0].province">
                      {({ field, form }: FieldProps<CustomerDTO>) => (
                        <Select
                          isDisabled={loadingProvinces}
                          value={provinces.find(prov => prov.NameExtension[1] === values.addressDTOS[0].province) || null}
                          placeholder="Chọn tỉnh/thành phố..."
                          style={{ height: '40px' }}
                          getOptionLabel={(option: Province) => option.NameExtension[1]}
                          getOptionValue={(option: Province) => String(option.ProvinceID)}
                          options={provinces}
                          onChange={(newValue: SingleValue<Province> | null) => {
                            handleLocationChange('province', newValue, form);
                            form.setFieldTouched(field.name, true, false); // Đánh dấu trường là đã được tương tác
                          }}
                          onBlur={() => form.setFieldTouched(field.name, true)}
                        />
                      )}
                    </Field>
                  </FormItem>

                  <FormItem
                    asterisk
                    label="Quận/huyện"
                    invalid={touched.addressDTOS?.[0]?.district && Boolean(errors.addressDTOS?.[0]?.district)}
                    errorMessage={errors.addressDTOS?.[0]?.district}
                  >
                    <Field name="addressDTOS[0].district">
                      {({ form }: FieldProps<CustomerDTO>) => (
                        <Select
                          isDisabled={loadingDistricts}
                          value={districts.find(district => district.DistrictName === values.addressDTOS[0].district) || null}
                          placeholder="Chọn quận/huyện..."
                          style={{ height: '40px' }}
                          getOptionLabel={(option: District) => option.DistrictName}
                          getOptionValue={(option: District) => String(option.DistrictID)}
                          options={districts}
                          onChange={(newValue: SingleValue<District> | null) => {
                            handleLocationChange('district', newValue, form);
                            // Đánh dấu trường là đã được tương tác và thiết lập giá trị mới
                            form.setFieldValue("addressDTOS[0].district", newValue ? newValue.DistrictName : '');
                            form.setFieldTouched("addressDTOS[0].district", true, false); // Đánh dấu trường đã tương tác
                          }}
                          onBlur={() => form.setFieldTouched("addressDTOS[0].district", true)} // Đánh dấu khi mất focus
                        />
                      )}
                    </Field>
                  </FormItem>

                  <FormItem
                    asterisk
                    label="Xã/phường/thị trấn"
                    invalid={touched.addressDTOS?.[0]?.ward && Boolean(errors.addressDTOS?.[0]?.ward)}
                    errorMessage={errors.addressDTOS?.[0]?.ward}
                  >
                    <Field name="addressDTOS[0].ward">
                      {({ form }: FieldProps<CustomerDTO>) => (
                        <Select
                          isDisabled={loadingWards}
                          value={wards.find(ward => ward.WardName === values.addressDTOS[0].ward) || null}
                          placeholder="Chọn xã/phường/thị trấn..."
                          style={{ height: '40px' }}
                          getOptionLabel={(option: Ward) => option.WardName}
                          getOptionValue={(option: Ward) => String(option.WardCode)}
                          options={wards}
                          onChange={(newValue: SingleValue<Ward> | null) => {
                            handleLocationChange('ward', newValue, form);
                            // Đánh dấu trường là đã được tương tác và thiết lập giá trị mới
                            form.setFieldValue("addressDTOS[0].ward", newValue ? newValue.WardName : '');
                            form.setFieldTouched("addressDTOS[0].ward", true, false); // Đánh dấu trường đã tương tác
                          }}
                          onBlur={() => form.setFieldTouched("addressDTOS[0].ward", true)} // Đánh dấu khi mấtfocus
                        />
                      )}
                    </Field>
                  </FormItem>

                  <FormItem
                    asterisk
                    label="Địa chỉ cụ thể"
                    invalid={touched.addressDTOS?.[0]?.detail && Boolean(errors.addressDTOS?.[0]?.detail)}
                    errorMessage={errors.addressDTOS?.[0]?.detail}
                  >
                    <Field
                      type="text"
                      autoComplete="on"
                      name="addressDTOS[0].detail"
                      style={{ height: '44px' }}
                      placeholder="Nhập địa chỉ cụ thể..."
                      component={Input}
                    />
                  </FormItem>
                  <FormItem>
                    <Button
                      type="reset"
                      style={{ backgroundColor: '#fff', height: '40px' }}
                      className="ltr:mr-2 rtl:ml-2"
                      disabled={isSubmitting}
                      onClick={() => {
                        // Reset form values to initial state
                        resetForm({ values: initialCustomerState });

                        // Reset the related state values for districts and wards
                        setDistricts([]);
                        setWards([]);

                        // Optionally, reset province selection as well if needed
                        setFieldValue('addressDTOS[0].province', null);
                      }}
                    >
                      Tải lại
                    </Button>
                    <Button variant="solid" style={{ backgroundColor: 'rgb(79, 70, 229)', height: '40px' }} type="submit" disabled={isSubmitting}>
                      Lưu
                    </Button>
                  </FormItem>
                </FormContainer>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default AddCustomer;