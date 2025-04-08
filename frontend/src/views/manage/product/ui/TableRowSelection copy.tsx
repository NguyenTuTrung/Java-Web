import { useRef, useEffect, useMemo, useState } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import Table from '@/components/ui/Table';
import Checkbox from '@/components/ui/Checkbox';
import type { ChangeEvent } from 'react';
import type { CheckboxProps } from '@/components/ui/Checkbox';
import type { ColumnDef } from '@tanstack/react-table';
import { useAppContext } from '@/store/ProductContext';
import { MdDeleteForever } from "react-icons/md";

const { Tr, Th, Td, THead, TBody } = Table;

type CheckBoxChangeEvent = ChangeEvent<HTMLInputElement>;

interface IndeterminateCheckboxProps extends Omit<CheckboxProps, 'onChange'> {
    onChange: (event: CheckBoxChangeEvent) => void;
    indeterminate: boolean;
}

function IndeterminateCheckbox({
    indeterminate,
    onChange,
    ...rest
}: IndeterminateCheckboxProps) {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.indeterminate = !rest.checked && indeterminate;
        }
    }, [indeterminate, rest.checked]);

    return <Checkbox ref={ref} onChange={(_, e) => onChange(e)} {...rest} />;
}

type ChildObject = {
    code: string;
    createdDate: string;
    deleted: boolean;
    id: number;
    name: string;
};

type ProductDetail = {
    id: number;
    name: string;
    size: ChildObject;
    color: ChildObject;
    price?: number;
    quantity?: number;
};

const TableRowSelection: React.FC = () => {
    const { productDetails, setProductDetails } = useAppContext();
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
    const [tableData, setTableData] = useState<ProductDetail[]>([]);
    console.log("----------------------")
    console.log(tableData)
    useEffect(() => {
        if (JSON.stringify(productDetails) !== JSON.stringify(tableData)) {
            setTableData(productDetails);
        }
    }, [productDetails]);

    useEffect(() => {
        setProductDetails(tableData)
    }, [tableData])


    const deleteSelectedRows = () => {
        setTableData(prevData => prevData.filter((_, index) => !rowSelection[index]));
        setRowSelection({});
    };

    const deleteRow = (rowId: number) => {
        setTableData(prevData => prevData.filter(row => row.id !== rowId));
    };

    const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>, rowId: number, field: keyof ProductDetail) => {
        const value = e.target.value.replace(/,/g, '');

        if (/^\d*\.?\d*$/.test(value) || value === '') {
            setTableData(prevData =>
                prevData.map(row => {
                    return row.id === rowId ? { ...row, [field]: value === '' ? undefined : Number(value) } : row;
                })
            );
        }
    };

    const columns = useMemo<ColumnDef<ProductDetail>[]>(() => [
        {
            id: 'select',
            header: ({ table }) => (
                <IndeterminateCheckbox
                    {...{
                        checked: table.getIsAllRowsSelected(),
                        indeterminate: table.getIsSomeRowsSelected(),
                        onChange: table.getToggleAllRowsSelectedHandler(),
                        'aria-label': 'Select all rows',
                    }}
                />
            ),
            cell: ({ row }) => (
                <IndeterminateCheckbox
                    {...{
                        checked: row.getIsSelected(),
                        disabled: !row.getCanSelect(),
                        indeterminate: row.getIsSomeSelected(),
                        onChange: row.getToggleSelectedHandler(),
                        'aria-label': `Select row ${row.index + 1}`,
                    }}
                />
            ),
        },
        {
            id: 'name',
            header: 'Name',
            cell: ({ row }) => row.original.name,
        },
        {
            id: 'color',
            header: 'Color',
            cell: ({ row }) => (
                <div style={{ backgroundColor: row.original.color.code, width: '50px', height: '20px' }} />
            ),
        },
        {
            id: 'size',
            header: 'Size',
            cell: ({ row }) => row.original.size.name,
        },
        {
            id: 'price',
            header: 'Price',
            cell: ({ row }) => (
                <input
                    type="number"
                    value={row.original.price !== undefined ? row.original.price : ''}
                    onChange={(e) => handleNumericInputChange(e, row.original.id, 'price')}
                    style={{ width: '60%' }}
                    className="border rounded py-1"
                />
            ),
        },
        {
            id: 'quantity',
            header: 'Quantity',
            cell: ({ row }) => (
                <input
                    type="text"
                    value={row.original.quantity !== undefined ? row.original.quantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''}
                    onChange={(e) => handleNumericInputChange(e, row.original.id, 'quantity')}
                    style={{ width: '60%' }}
                    className="border rounded py-1"
                />
            ),
        },
        {
            id: 'delete',
            header: 'Delete',
            cell: ({ row }) => (
                <button
                    onClick={() => deleteRow(row.original.id)}
                    className="bg-red-500 text-white py-1 px-2 rounded"
                >
                    <MdDeleteForever size={20} />
                </button>
            ),
        },
    ], []);

    const table = useReactTable({
        data: tableData,
        columns,
        state: {
            rowSelection,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div>
            <div className='px-5'>
                <button onClick={deleteSelectedRows} className="mb-2 bg-red-500 text-white py-1 px-1 rounded">
                    <MdDeleteForever size={30} />
                </button>
            </div>
            <Table>
                <THead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {tableData.length === 0 ? (
                        <Tr>
                            <Td colSpan={columns.length} className="text-center text-gray-500">
                                No data available
                            </Td>
                        </Tr>
                    ) : (
                        table.getRowModel().rows.map(row => (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <Td key={cell.id} className='px-1'>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </Td>
                                ))}
                            </Tr>
                        ))
                    )}
                </TBody>
            </Table>
        </div>
    );
}

export default TableRowSelection;
