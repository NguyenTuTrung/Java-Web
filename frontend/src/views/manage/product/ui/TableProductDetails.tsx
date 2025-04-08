import React, { useState, useEffect, useMemo, ReactNode, useRef, ChangeEvent } from 'react';
import DataTable from '@/components/shared/DataTable';
import axios from 'axios';
import debounce from 'lodash/debounce';
import Input from '@/components/ui/Input';
import type { ColumnDef, OnSortParam } from '@/components/shared/DataTable';
import { format } from 'date-fns';
import { DatePicker } from '@/components/ui';
import Switch from '@mui/material/Switch';
import { useParams } from 'react-router-dom';
import instance from "@/axios/CustomAxios";

type ChildObject = {
    code: string;
    createdDate: string;
    deleted: boolean;
    id: number;
    name: string;
};
type Todo = {
    id: number;
    code: string;
    name: string;
    createdDate: string;
    size: ChildObject;
    color: ChildObject;
    brand?: ChildObject;
    collar?: ChildObject;
    elasticity?: ChildObject;
    material?: ChildObject;
    origin?: ChildObject;
    sleeve?: ChildObject;
    style?: ChildObject;
    texture?: ChildObject;
    thickness?: ChildObject;
    price?: number;
    quantity?: number;
};

type Label = {
    header: string;
    accessorKey: string;
    cell?: ReactNode;
};

interface ChildComponentProps {
    label: Label[];
    url: string;
}

const TableProductDetails: React.FC<ChildComponentProps> = ({ label, url }) => {
    const [data, setData] = useState<Todo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    // const productId = parseInt(useParams().id, 10);
    const [queryParam, setQueryParam] = useState<{
        createdFrom: string,
        createdTo: string,
        productId:number,
    }>({
        createdFrom: "",
        createdTo: "",
        productId: parseInt(useParams().id, 10)
    });

    const setFromDateParam = (p: string) => {
        setQueryParam(prevState => ({
            ...prevState,
            createdFrom: p
        }));
    };

    const setToDateParam = (p: string) => {
        setQueryParam(prevState => ({
            ...prevState,
            createdTo: p
        }));
    };

    const [tableData, setTableData] = useState<{
        pageIndex: number,
        pageSize: number,
        sort: {
            order: '' | 'asc' | 'desc',
            key: string | number;
        },
        query: string,
        total: number
    }>({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: {
            order: '',
            key: '',
        },
    });

    const inputRef = useRef(null);
    const debounceFn = debounce(handleDebounceFn, 500);

    function handleDebounceFn(val: string) {
        if (typeof val === 'string' && (val.length > 1 || val.length === 0)) {
            setTableData((prevData) => ({
                ...prevData,
                query: val,
                pageIndex: 1,
            }));
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value);
    };

    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

    const handleRangePickerChange = (date: [Date | null, Date | null]) => {
        if (date[0]) {
            setFromDateParam(format(date[0], 'dd-MM-yyyy'));
        } else {
            setFromDateParam("");
        }
        if (date[1]) {
            setToDateParam(format(date[1], 'dd-MM-yyyy'));
        } else {
            setToDateParam("");
        }
        setDateRange(date);
    };

    const columns: ColumnDef<Todo>[] = useMemo(() => {
        return [
            {
                header: '#',
                id: 'index',
                cell: (props) => (
                    <span>{(tableData.pageIndex - 1) * tableData.pageSize + (props.row.index + 1)}</span>
                )
            },
            ...label.map((item) => {
                if (item.accessorKey === 'color.name') {
                    return {
                        header: item.header,
                        accessorKey: item.accessorKey,
                        cell: (info) => {
                            const colorName = info.getValue();
                            return (
                                <div 
                                    className='w-20 h-4'
                                    style={{
                                        backgroundColor: colorName || 'transparent', // Màu nền dựa trên tên màu
                                        display: 'inline-block',
                                        filter: 'brightness(1.1)',
                                    }}
                                />
                            );
                        },
                    };
                }
                return {
                    header: item.header,
                    accessorKey: item.accessorKey,
                };
            }),
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <Switch
                        sx={{
                            '&.Mui-checked': {
                                color: 'green', // Màu khi bật
                            },
                            '&.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: 'green', // Màu nền khi bật
                            },
                        }}
                        onClick={(event) => event.stopPropagation()}
                    />
                ),
            },
        ];
    }, [label, tableData.pageIndex, tableData.pageSize]);


    const handlePaginationChange = (pageIndex: number) => {
        setTableData((prevData) => ({ ...prevData, pageIndex }));
    };

    const handleSelectChange = (pageSize: number) => {
        setTableData((prevData) => ({
            ...prevData,
            pageSize: pageSize,
            pageIndex: 1
        }));
    };

    const handleSort = ({ order, key }: OnSortParam) => {
        setTableData((prevData) => ({
            ...prevData,
            sort: {
                order,
                key: (key as string).replace("_", "."),
            },
        }));
    };
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Set loading to true initially

            try {
                const response = await instance.post(url, {
                     // Truyền productId
                    // productId: productId, 
                    ...tableData // Truyền tất cả dữ liệu trong tableData
                }, {
                    params: queryParam
                },{});

                if (response.data) {
                    const filteredData = response.data.content
                        .filter(dataAttribute => !dataAttribute.deleted)
                        .sort((a, b) => b.id - a.id);

                    setData(filteredData);
                    setTableData((prevData) => ({
                        ...prevData,
                        total: response.data.totalElements,
                    }));

                    // Đặt loading thành false nếu có dữ liệu
                    setLoading(filteredData.length === 0); // Nếu không có hàng, giữ loading true
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false); // Đảm bảo set loading thành false nếu có lỗi
            }
        };
        fetchData();
    }, [tableData.pageIndex, tableData.sort, tableData.pageSize, tableData.query, queryParam, url]);



    // Hàm xử lý khi click vào row
    const handleRowClick = (row: Todo) => {
        console.log('Row clicked:', row.id);
        // Bạn có thể thêm các logic khác tại đây như điều hướng, mở modal, v.v.
    };

    return (
        <>
            <div className='grid grid-cols-2 gap-5 bg-[#f3f4f6] py-5'>
                <div>
                    <Input
                        ref={inputRef}
                        placeholder="Search..."
                        size="sm"
                        className="lg:w-full"
                        onChange={handleChange}
                    />
                </div>
                <div className='flex justify-between gap-5'>
                    <DatePicker.DatePickerRange
                        placeholder="Chọn thời gian...."
                        value={dateRange}
                        dateViewCount={2}
                        onChange={handleRangePickerChange}
                    />
                </div>
            </div>
            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                pagingData={tableData}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
                onRowClick={handleRowClick} // Gửi hàm xử lý click vào DataTable
            />
        </>
    );
};

export default TableProductDetails;
