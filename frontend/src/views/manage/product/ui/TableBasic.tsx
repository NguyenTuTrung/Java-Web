import React, { useState, useEffect, useMemo, ReactNode, useRef, ChangeEvent } from 'react';
import Button from '@/components/ui/Button';
import DataTable from '@/components/shared/DataTable';
import axios from 'axios';
import debounce from 'lodash/debounce';
import Input from '@/components/ui/Input';
import type { ColumnDef, OnSortParam } from '@/components/shared/DataTable';
import { format } from 'date-fns';
import { DatePicker } from '@/components/ui';
import Switch from '@mui/material/Switch';
import instance from "@/axios/CustomAxios";

type Todo = {
    id: number;
    code: string;
    name: string;
    createdDate: string;
};

type Label = {
    header: string;
    accessorKey: string;
};

interface ChildComponentProps {
    label: Label[];
    url: string;
}

const TableBasic: React.FC<ChildComponentProps> = ({ label, url }) => {
    const [data, setData] = useState<Todo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [queryParam, setQueryParam] = useState<{
        createdFrom: string,
        createdTo: string
    }>({
        createdFrom: "",
        createdTo: ""
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
                    <span>{(tableData.pageIndex -1) * tableData.pageSize + (props.row.index + 1)}</span>
                )
            },
            ...label.map((item) => ({
                header: item.header,
                accessorKey: item.accessorKey,
            })),
            {
                header: '',
                id: 'action',
                cell: (props) => (
                  
                    <Switch
                        // name="loading"
                        sx={{
                            '&.Mui-checked': {
                                color: 'green', // Màu khi bật
                            },
                            '&.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: 'green', // Màu nền khi bật
                            },
                        }}
                        // color="primary"
                        onClick={(event) => event.stopPropagation()}
                    ></Switch>
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
                key: (key as string).replace("___", "."),
            },
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Set loading to true initially
            const response = await instance.post(url, tableData, {
                params: queryParam
            });
            if (response.data) {
                const filteredData = response.data.content
                    .filter(dataAttribute => !dataAttribute.deleted)
                    .sort((a, b) => b.id - a.id);

                if (filteredData.length === 0) {
                    setLoading(true); // Set loading to true if no rows
                } else {
                    setLoading(false); // Set loading to false if rows exist
                }
                setData(filteredData);
                setTableData((prevData) => ({
                    ...prevData,
                    total: response.data.totalElements,
                }));
            }
        };
        fetchData();
    }, [tableData.pageIndex, tableData.sort, tableData.pageSize, tableData.query, queryParam, url]);


    // Hàm xử lý khi click vào row
    const handleRowClick = (row: Todo) => {
        console.log('Row clicked:', row);
        window.location.href = `/admin/manage/product/ProductDetails/${row.id}`;
        // window.location.href = `/manage/product/ProductDetails`;
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
                        placeholder="chọn thời gian...."
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

export default TableBasic;
