import { useState, useEffect, useRef, ChangeEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import debounce from 'lodash/debounce';
import { Modal } from 'antd';
import { FaPen, FaFileDownload, FaFileUpload } from 'react-icons/fa';
import { RiMoonClearLine, RiSunLine } from 'react-icons/ri';
import { MdOutlineAddCircle } from 'react-icons/md';
import { IoIosSearch } from 'react-icons/io';
import DataTable from '@/components/shared/DataTable';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Switcher from '@/components/ui/Switcher';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import emailjs from "emailjs-com";
import { Tooltip } from 'antd';
import type { ColumnDef, OnSortParam, CellContext } from '@/components/shared/DataTable';

type IStaff = {
  id: number;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  province: string;
  status: 'Active' | 'Inactive';
  birthDay: string;
  gender: string;
  createdDate: string;
  role: any;
  deleted: false;
  citizenId: string;
  note: string;
  password: string;
};

interface StaffResponseItem {
  name: string;
  email: string;
  code: string;
  password: string;
  error?: string; // Thêm thuộc tính lỗi nếu cần
  type?: 'email' | 'phone' | 'citizenId'; // Để phân loại lỗi
}


const StaffTableStaff = () => {
  const [data, setData] = useState<IStaff[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState({
    pageIndex: 1,
    pageSize: 10,
    sort: {
      order: '' as '' | 'asc' | 'desc',
      key: '' as string | number,
    },
    query: '',
    total: 0,
    statusFilter: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isPreviewConfirmed, setIsPreviewConfirmed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    fetchData();
  }, [tableData.pageIndex, tableData.sort, tableData.pageSize, tableData.query, tableData.statusFilter]);

  useEffect(() => {
    if (isPreviewConfirmed && file) {
      uploadExcel();
    }
  }, [isPreviewConfirmed, file]);

  const debounceFn = useRef(
      debounce((val: string) => {
        setTableData((prevData) => ({
          ...prevData,
          query: val,
          pageIndex: 1,
        }));
      }, 500),
  ).current;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    debounceFn(e.target.value);
  };

  const handleUpdateClick = (id: number) => {
    navigate(`/admin/manage/staff/update/${id}`);
  };

  const handlePaginationChange = (pageIndex: number) => {
    setTableData((prevData) => ({ ...prevData, pageIndex }));
  };

  const handleSelectChange = (pageSize: number) => {
    setTableData((prevData) => ({ ...prevData, pageSize, pageIndex: 1 }));
  };

  const handleSort = ({ order, key }: OnSortParam) => {
    setTableData((prevData) => ({
      ...prevData,
      sort: { order, key },
      pageIndex: 1,
    }));
  };

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTableData((prevData) => ({
      ...prevData,
      statusFilter: e.target.value,
      pageIndex: 1,
    }));
  };

  const columns: ColumnDef<IStaff>[] = [
    {
      header: 'STT',
      id: 'serialNumber',
      cell: ({ row }: CellContext<IStaff, unknown>) => {
        const { pageIndex, pageSize } = tableData;
        return (pageIndex - 1) * pageSize + row.index + 1;
      },
    },
    { header: 'MaNV', accessorKey: 'code' },
    { header: 'HọTên', accessorKey: 'name' },
    {
      header: 'Giới Tính',
      accessorKey: 'gender',
      cell: ({ getValue }) => (getValue() ? 'Nam' : 'Nữ'),
      size: 100,
    },
    { header: 'Ngày Sinh', accessorKey: 'birthDay' },
    { header: 'SDT', accessorKey: 'phone' },
    {
      header: 'Địa chỉ',
      accessorKey: 'address',
      cell: ({ row }: CellContext<IStaff, unknown>) => {
        const { address, ward, district, province } = row.original;
        return `${address}, ${ward}, ${district}, ${province}`;
      },
    },
    {
      header: 'Trạng thái',
      accessorKey: 'status',
      cell: ({ row }: CellContext<IStaff, unknown>) => {
        const { status } = row.original;
        const isActive = status === 'Active';

        return (
            <span className={`flex items-center font-bold ${isActive ? 'text-green-600' : 'text-red-600'}`}>
            <span
                className={`inline-block w-2 h-2 rounded-full mr-2 ${isActive ? 'bg-green-600' : 'bg-red-600'
                }`}
            ></span>
              {status === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
          </span>
        );
      },
      size: 100,
    },
    {
      header: 'Hành động',
      id: 'action',
      cell: ({ row }: CellContext<IStaff, unknown>) => {
        const { id, status } = row.original;
        const isActive = status === 'Active';

        return (
            <div className="flex items-center space-x-1">
              <Tooltip title="Cập nhật trạng thái">
                <Switcher
                    color="green-500"
                    checked={isActive}
                    onChange={() => updateStatus(id, !isActive)}
                    unCheckedContent={<RiMoonClearLine />}
                    checkedContent={<RiSunLine />}
                    className="text-sm"
                />
              </Tooltip>

              <Tooltip title="Cập nhật">
                <Button size="xs" onClick={() => handleUpdateClick(id)}>
                  <FaPen />
                </Button>
              </Tooltip>
            </div>
        ); 
      },
      size: 100,
    },

  ];

  const updateStatus = async (id: number, newStatus: boolean) => {
    try {
      await axios.patch(`http://localhost:8080/api/v1/staffs/status/${id}`, {
        status: newStatus ? 'Active' : 'Inactive',
      });
      toast.success('Cập nhật trạng thái thành công');
      fetchData();
    } catch (error) {
      toast.error('Lỗi cập nhật trạng thái. Vui lòng thử lại.');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { pageIndex, pageSize, query, sort, statusFilter } = tableData;
      let params: any = {
        page: pageIndex - 1,
        size: pageSize,
        search: query,
        sort: sort.key,
        order: sort.order,
        keyword: searchTerm,
      };

      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await axios.get('http://localhost:8080/api/v1/staffs/page', { params });

      if (response.data) {
        setData(response.data.content);
        setTableData((prevData) => ({
          ...prevData,
          total: response.data.totalElements,
        }));
      } else {
        setData([]);
      }
    } catch (error) {
      toast.error('Lỗi tải dữ liệu. Vui lòng thử lại.');
      // console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    debounceFn(event.target.value);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      toast.error('Không có tệp nào được chọn.');
      return;
    }

    if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      toast.error('Định dạng tệp không hợp lệ. Vui lòng chọn tệp Excel.');
      return;
    }

    setFile(selectedFile);
    previewExcel(selectedFile);
  };

  const previewExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryString = e.target?.result;
      const workbook = XLSX.read(binaryString, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      setPreviewData(data);
      setIsPreviewVisible(true);
    };
    reader.readAsBinaryString(file);
  };

  const handleOk = () => {
    setIsPreviewVisible(false);
    setIsPreviewConfirmed(true);
  };

  const handleCancel = () => {
    setIsPreviewVisible(false);
    setFile(null); // Reset file
    if (inputRef.current) inputRef.current.value = ''; // Reset input file
  };

  const uploadExcel = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post<StaffResponseItem[]>('http://localhost:8080/api/v1/staffs/upload-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Kiểm tra phản hồi có chứa thông báo lỗi hay không
      if (!Array.isArray(response.data) || response.data.length === 0) {
        toast.error('Không có dữ liệu để gửi email.');
        return;
      }

      // Kiểm tra nếu có thông báo lỗi từ server
      const errorMessages = response.data.filter(item => item.error);
      if (errorMessages.length > 0) {
        errorMessages.forEach((item: StaffResponseItem) => {
          // Hiển thị lỗi cụ thể
          toast.error(item.error); // Hiển thị lỗi cụ thể từ server
        });
        return; // Dừng lại nếu có lỗi
      }

      // Nếu không có lỗi, thông báo tải thành công
      toast.success('Tải tệp thành công.');

      // Gửi email
      const emailPromises = response.data.map(async (item: StaffResponseItem, index: number) => {
        const { name, email: toEmail, code, password } = item;
        if (!toEmail || !name || !code || !password) {
          toast.warn(`Thông tin không hợp lệ cho nhân viên ${index + 1}.`);
          return;
        }

        const templateParams = {
          from_name: 'Fashion Canth Shop',
          from_email: 'no-reply@fashioncanthshop.com',
          to_name: name,
          to_email: toEmail,
          message: `Tài khoản của bạn:\nMã nhân viên: ${code}\nMật khẩu: ${password}`,
        };

        try {
          await emailjs.send(
              'service_kp8m1z8',
              'template_lad6zvl',
              templateParams,
              '2TdUStOWX9A6vm7Ex',
          );
          // console.log(`Email đã được gửi thành công cho ${name}`);
        } catch (emailError) {
          // console.error(`Không thể gửi email cho ${name}:`, emailError);
          toast.error(`Lỗi khi gửi email cho ${name}`);
        }
      });

      await Promise.all(emailPromises);

      // Nếu đã gửi email thành công cho tất cả, có thể thông báo
      toast.success('Đã gửi thông tin qua email cho các nhân viên.');

      // Tải lại dữ liệu
      fetchData(); // Tải lại dữ liệu
      setFile(null); // Reset file
      setIsPreviewConfirmed(false); // Reset trạng thái
      if (inputRef.current) inputRef.current.value = ''; // Reset input file

    } catch (error) {
      // Chỉ hiển thị thông báo nếu server phản hồi có lỗi
      if (axios.isAxiosError(error) && error.response) {
        const errorMessages = error.response.data; // Lấy tất cả thông báo lỗi
        errorMessages.forEach((errorItem: { error: string }) => {
          toast.error(errorItem.error); // Hiển thị thông báo lỗi từ server
        });
      } else {
        toast.error('Đã xảy ra lỗi không xác định. Vui lòng thử lại.');
      }
      // console.error('Error uploading file:', error);
    }
  };




  const exportToExcel = () => {
    if (data.length === 0) {
      toast.info('Không có dữ liệu để xuất.');
      return;
    }

    const formattedData = data.map((item, index) => ({
      Stt: index + 1,                                   // Số thứ tự
      'Tên': item.name,                                // Tên
      'Email': item.email,                              // Email
      'Số điện thoại': item.phone,                     // Số điện thoại
      'Giới tính': item.gender ? 'Nam' : 'Nữ',        // Giới tính
      'Ngày sinh': item.birthDay,                      // Ngày sinh
      'CCCD': item.citizenId,                          // CCCD
      'Địa chỉ': `${item.address}, ${item.ward}, ${item.district}, ${item.province}`, // Địa chỉ gộp
      'Ghi chú': item.note,                            // Ghi chú
      'Trạng thái': item.status === 'Active' ? 'Hoạt động' : 'Không hoạt động', // Trạng thái
      // 'ID vai trò': item.role,                         // ID vai trò
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    // Đặt tiêu đề cho worksheet
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách nhân viên');

    // Tạo hàng tiêu đề (header) cho worksheet
    const headers = ['Stt', 'Tên', 'Email', 'Số điện thoại', 'Giới tính', 'Ngày sinh', 'CCCD', 'Địa chỉ', 'Ghi chú', 'Trạng thái'];

    // Thêm hàng tiêu đề vào worksheet
    const headerRow = XLSX.utils.aoa_to_sheet([headers]);
    XLSX.utils.sheet_add_json(worksheet, formattedData, { skipHeader: true, origin: 'A2' }); // Bỏ qua header mặc định
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' }); // Thêm header

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'danh_sach_nhan_vien.xlsx'); // Tên file hiển thị tiếng Việt
  };


  return (
      <>
        <div className="bg-white w-full">
          <div className="mb-4">
            <p className="text-left text-xl text-black font-bold mx-auto mb-2 uppercase">
              QUẢN LÝ NHÂN VIÊN
            </p>
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
              <div className="flex space-x-2 flex-wrap items-center mb-2">
                <div className="relative w-96">
                  <IoIosSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg pointer-events-none" />
                  <Input
                      placeholder="Tìm Kiếm Theo Mã, Họ Và Tên, SDT, CCCD, Email"
                      style={{ paddingLeft: '35px', height: '35px' }}
                      className="w-full"
                      value={searchTerm}
                      onChange={handleSearchChange}
                  />
                </div>

                <select
                    className="w-40 pl-2 pr-2 border border-gray-300 rounded focus:outline-none"
                    value={tableData.statusFilter || ''}
                    onChange={handleFilterChange}
                    style={{ height: '37px' }}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="Active">Hoạt động</option>
                  <option value="Inactive">Không hoạt động</option>
                </select>
              </div>
              <div className="flex space-x-2 flex-wrap items-center">
                <Button
                    size="sm"
                    className="h-10 flex items-center justify-center"
                    onClick={exportToExcel}
                    style={{ marginBottom: '8px' }}
                >
                  <FaFileDownload className="mr-2" /> Xuất Excel
                </Button>

                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileInput"
                    ref={inputRef}
                />
                <Button
                    size="sm"
                    className="h-10 flex items-center justify-center"
                    onClick={() => inputRef.current?.click()}
                    style={{ marginBottom: '8px' }}
                >
                  <FaFileUpload className="mr-2" /> Tải lên tệp Excel
                </Button>

                <Button
                    className="h-10 flex items-center justify-center"
                    variant="solid"
                    color="blue-600"
                    onClick={() => navigate('/admin/manage/staff/add')}
                    style={{ height: '38px', width: '155px', marginBottom: '8px' }}
                >
                  <MdOutlineAddCircle className="mr-2" />
                  Thêm Mới
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                  <p>Đang tải...</p>
              ) : data.length === 0 ? (
                  <p>Không có dữ liệu nhân viên.</p>
              ) : (
                  <DataTable
                      columns={columns}
                      data={data}
                      loading={loading}
                      pagingData={tableData}
                      onPaginationChange={handlePaginationChange}
                      onSelectChange={handleSelectChange}
                      onSort={handleSort}
                  />
              )}
            </div>
          </div>
        </div>

        <Modal
            title="Xem trước dữ liệu Excel"
            open={isPreviewVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width="75vw"
            styles={{ body: { padding: 0 } }}
        >
          <div className="overflow-auto max-w-none">
            <table className="w-[1200px] min-w-full border-collapse">
              <thead>
              <tr className="bg-blue-100 text-left">
                <th className="px-6 py-4 font-semibold text-gray-700">STT</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Tên</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Điện thoại</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Địa chỉ</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Phường</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Quận</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Tỉnh</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Số CCCD</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Ngày sinh</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Giới tính</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Ghi chú</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Đã xóa</th>
              </tr>
              </thead>
              <tbody>
              {previewData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-t">
                    <td className="px-4 py-2">{rowIndex + 1}</td>
                    {Object.values(row).map((value, valueIndex) => (
                        <td key={valueIndex} className="px-4 py-2">
                          {String(value)}
                        </td>
                    ))}
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </Modal>


      </>
  );
};

export default StaffTableStaff;