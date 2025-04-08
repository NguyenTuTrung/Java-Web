import { useState, useEffect, useMemo, ChangeEvent } from 'react'
import { CellContext, ColumnDef, DataTable, OnSortParam } from '@/components/shared'
import { Button, Input, Switcher } from '@/components/ui'
import axios from 'axios'
import { toast } from 'react-toastify'
import { debounce } from 'lodash'
import { IoIosSearch } from 'react-icons/io'
import VoucherTableTool from './VoucherTableTool'
import { Tooltip } from 'antd'
import { FaPen } from 'react-icons/fa'
import { RiMoonClearLine, RiSunLine } from 'react-icons/ri';
import instance from "@/axios/CustomAxios";
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useToastContext } from '@/context/ToastContext'

type IVoucher = {
    id: number
    code: string
    name: string
    typeTicket: string
    quantity: number
    maxPercent: number
    minAmount: number
    startDate: Date
    endDate: Date
    status: string
    deleted: false
}

const VoucherTable = () => {
    const [data, setData] = useState<IVoucher[]>([])
    const [loading, setLoading] = useState(false)
    const [searchKeyword, setSearchKeyword] = useState('')
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const {openNotification} = useToastContext()
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
        typeTicketFilter: '',
    });
    const [pagination, setPagination] = useState({
        totalPages: 0,
        currentPage: 0,
        totalItems: 0,
        pageSize: 10,
    });



    useEffect(() => {
        fetchData();
    }, [pagination.currentPage, searchTerm]);



    const exportToExcel = () => {
        if (data.length === 0) {
            toast.info('Không có dữ liệu để xuất.');
            return;
        }

        const formattedData = data.map((item, index) => ({
            Stt: index + 1,                                     // Số thứ tự
            'Tên': item.name,                                   // Tên
            'Loại Phiếu': item.typeTicket === 'Individual' ? 'Cá nhân' : 'Mọi người', // Loại phiếu
            'Số Lượng': item.quantity,                          // Số lượng
            'Phần Trăm Tối Đa': `${item.maxPercent}%`,          // Phần trăm tối đa
            'Giá Tối Thiểu': `${item.minAmount.toLocaleString('vi-VN')} ₫`, // Giá tối thiểu
            'Ngày Bắt Đầu': item.startDate,                     // Ngày bắt đầu
            'Ngày Kết Thúc': item.endDate,                      // Ngày kết thúc
            'Trạng Thái': (() => {                              // Trạng thái
                if (item.status === 'In progress') return 'Đang diễn ra';
                if (item.status === 'Not started yet') return 'Chưa bắt đầu';
                if (item.status === 'Expired') return 'Đã kết thúc';
                return 'Không xác định';
            })(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();

        // Thêm worksheet vào workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách Phiếu Giảm Giá');

        // Ghi file Excel
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

        saveAs(blob, 'Danh_sach_Phieu_Giam_Gia.xlsx'); // Tên file hiển thị tiếng Việt
    };

    // Debounce function for search input
    const debounceFn = debounce((val: string) => {
        setTableData(prevData => ({
            ...prevData,
            query: val,
            pageIndex: 1,
        }));
    }, 500);

    const handlePaginationChange = (pageIndex: number) => {
        setTableData(prevData => ({ ...prevData, pageIndex }));
    };

    const handleSelectChange = (pageSize: number) => {
        setTableData(prevData => ({ ...prevData, pageSize, pageIndex: 1 }));
    };

    const handleSort = ({ order, key }: OnSortParam) => {
        setTableData(prevData => {
            const newOrder = (prevData.sort.key === key && prevData.sort.order === 'asc') ? 'desc' : 'asc';
            return {
                ...prevData,
                sort: { order: newOrder, key },
                pageIndex: 1,
            };
        });
    };

    const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setTableData(prevData => ({
            ...prevData,
            statusFilter: e.target.value,
            typeTicketFilter: e.target.value,
            pageIndex: 1,
        }));
    };

    const handleFilterChange2 = (e: ChangeEvent<HTMLSelectElement>) => {
        setTableData(prevData => ({
            ...prevData,
            typeTicketFilter: e.target.value,
            pageIndex: 1,
        }));
    };

    const columns: ColumnDef<IVoucher>[] = useMemo(
        () => [
            {
                header: 'Mã',
                accessorKey: 'code',
            },
            {
                header: 'Tên ',
                accessorKey: 'name',
            },
            {
                header: 'Loại Phiếu',
                accessorKey: 'typeTicket',
                cell: ({ row }) => {
                    const type = row.original.typeTicket;
                    return (
                        <span>
                            {type === 'Individual' ? 'Cá nhân' : 'Mọi người'}
                        </span>
                    );
                },
            },
            {
                header: 'Số Lượng',
                accessorKey: 'quantity',
            },
            {
                header: 'Phần Trăm Tối Đa',
                accessorKey: 'maxPercent',
                cell: ({ getValue }) => {
                    const value = getValue() as number;
                    return `${value}%`;
                },
            },
            {
                header: 'Giá Tối Thiểu',
                accessorKey: 'minAmount',
                cell: ({ getValue }) => {
                    const value = getValue() as number;
                    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                },
            },
            {
                header: 'Ngày Bắt Đầu',
                accessorKey: 'startDate',
            },
            {
                header: 'Ngày Kết Thúc',
                accessorKey: 'endDate',
            },
            {
                header: 'Trạng Thái',
                accessorKey: 'status',
                cell: ({ row }) => {
                    const status = row.original.status;

                    let statusColor, textColor, statusText;

                    if (status === 'In progress') {
                        statusColor = 'bg-green-600';
                        textColor = 'text-green-600';
                        statusText = 'Đang diễn ra';
                    } else if (status === 'Not started yet') {
                        statusColor = 'bg-red-600';
                        textColor = 'text-red-600';
                        statusText = 'Chưa bắt đầu';
                    } else if (status === 'Expired') {
                        statusColor = 'bg-yellow-600';
                        textColor = 'text-yellow-600';
                        statusText = 'Đã kết thúc';
                    } else {
                        statusColor = 'bg-gray-500';
                        textColor = 'text-gray-500';
                        statusText = 'Không xác định';
                    }

                    return (
                        <span className={`flex items-center font-bold ${textColor}`}>
                            <span
                                className={`inline-block w-2 h-2 rounded-full mr-2 ${statusColor}`}
                            ></span>
                            {statusText}
                        </span>
                    );
                },
                size: 100,
            },

            {
                header: 'Hành động',
                id: 'action',
                cell: ({ row }: CellContext<IVoucher, unknown>) => {
                    const { id, deleted } = row.original;

                    return (
                        <div className="flex items-center space-x-1">
                            <Tooltip title={deleted ? 'Kích hoạt lại' : 'Xoá Phiếu Giảm Giá'}>
                                <Switcher
                                    color="green-500"
                                    checked={!deleted}
                                    unCheckedContent={<RiMoonClearLine />}
                                    checkedContent={<RiSunLine />}
                                    className="text-sm"
                                    onChange={() => softDelete(id, !deleted)}
                                />
                            </Tooltip>

                            <Tooltip title="Cập nhật">
                                <Button size="xs" onClick={() => handleUpdate(id)}>
                                    <FaPen />
                                </Button>
                            </Tooltip>
                        </div>
                    );
                },
                size: 100,
            }

        ],
        [],
    )

    const softDelete = async (id: number, softDelete: boolean) => {
        try {
            const response = await instance.put(`/voucher/delete/${id}`, {
                softDelete
            });

            if (response.status === 200) {
                if (!softDelete) {
                    openNotification('Kích hoạt lại phiếu giảm giá thành công');
                } else {
                    openNotification('Xoá phiếu giảm giá thành công');
                }
                fetchData();
            } else {
                // toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
                openNotification('Có lỗi xảy ra. Vui lòng thử lại.', 'Thông báo', 'warning', 5000)
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // toast.error(`Có lỗi xảy ra: ${error.response.data.message || 'Vui lòng thử lại.'}`);
                openNotification(`Có lỗi xảy ra: ${error.response.data.message || 'Vui lòng thử lại.'}`, 'Thông báo', 'warning', 5000)

            } else {
                // toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
                openNotification('Có lỗi xảy ra. Vui lòng thử lại.', 'Thông báo', 'warning', 5000)
            }
            console.error('Error deleting voucher:', error);
        }
    };

    useEffect(() => {
        setTableData((prevData) => ({
            ...prevData,
            query: searchKeyword,
            pageIndex: 1, // Reset lại page khi tìm kiếm mới
        }))
    }, [searchKeyword])


    const fetchData = async () => {
        setLoading(true);
        try {
            const { pageIndex, pageSize, query, sort, statusFilter, typeTicketFilter } = tableData;
            const params: any = {
                page: pageIndex - 1,
                size: pageSize,
                search: query,
                sort: sort.key,
                order: sort.order,
                keyword: searchTerm || "",
            };

            if (statusFilter) {
                params.status = statusFilter;
            } else if (typeTicketFilter) {
                params.typeTicket = typeTicketFilter;
            }

            console.log('Fetching data with params:', params);

            const response = await instance.get('/voucher/page', { params });

            if (response.data) {
                setData(response.data.content);
                setTableData(prevData => ({
                    ...prevData,
                    total: response.data.totalElements,
                }));
            } else {
                setData([]);
            }
        } catch (error) {
            // toast.error('Lỗi tải dữ liệu. Vui lòng thử lại.');
            openNotification('Có lỗi xảy ra. Vui lòng thử lại.', 'Thông báo', 'warning', 5000)
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = (id: number) => {
        navigate(`/admin/manage/voucher/update/${id}`)
    };


    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        fetchData();
    }, [tableData.pageIndex, tableData.sort, tableData.pageSize, tableData.query, tableData.statusFilter, tableData.typeTicketFilter]);



    return (
        <>
            <div className="bg-white mb-6 w-full">
                <div className="mb-4">
                    <p className="text-xl font-bold mx-auto mb-5 text-black uppercase">Quản Lý Phiếu Giảm Giá</p>
                    <div
                        className="flex flex-col lg:flex-row justify-between items-center mb-4"
                        style={{
                            marginBottom: '20px',
                            overflow: 'hidden',
                            maxWidth: '100%',
                        }}
                    >
                        <div className="flex items-center w-full justify-between flex-wrap">
                            {/* Bên trái: Input tìm kiếm */}
                            <div className="flex items-center space-x-2">
                                <div style={{ position: 'relative', width: '500px' }}>
                                    <IoIosSearch
                                        style={{
                                            position: 'absolute',
                                            left: '5px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            fontSize: '20px',
                                            pointerEvents: 'none'
                                        }}
                                    />
                                    <Input
                                        placeholder="Tìm kiếm theo tên, mã"
                                        style={{
                                            width: '100%',
                                            height: '37px',
                                            paddingLeft: '30px',
                                            boxSizing: 'border-box',
                                        }}
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                                {/* Bộ lọc trạng thái */}
                                <select
                                    className='border border-gray-300 rounded focus:outline-none'
                                    value={tableData.statusFilter || ''}
                                    onChange={handleFilterChange}
                                    style={{
                                        height: '37px',
                                        marginLeft: '8px',
                                        padding: '0 12px',
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="In progress">Đang diễn ra</option>
                                    <option value="Expired">Đã kết thúc</option>
                                    <option value="Not started yet">Chưa bắt đầu</option>
                                </select>

                                <select
                                    className='border border-gray-300 rounded focus:outline-none'
                                    value={tableData.typeTicketFilter || ''}
                                    onChange={handleFilterChange2}
                                    style={{
                                        height: '37px',
                                        marginLeft: '8px',
                                        padding: '0 12px',
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="Individual">Cá Nhân</option>
                                    <option value="Everybody">Mọi Người</option>
                                </select>
                            </div>

                            <div className="flex items-center space-x-2 justify-end">
                                <VoucherTableTool exportToExcel={exportToExcel} />
                            </div>
                        </div>
                    </div>


                    <div className="overflow-x-auto">
                        {loading ? (
                            <p>Đang tải...</p>
                        ) : data.length === 0 ? (
                            <p>Không tìm thấy phiếu giảm giá phù hợp</p>
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
        </>
    )
}

export default VoucherTable
