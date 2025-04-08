import { ColumnDef, DataTable, DataTableResetHandle, OnSortParam, Row } from "@/components/shared"
import { cloneDeep } from "lodash"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { addRowItem, getCustomers, removeRowItem, setSelectedRows, setTableData, useAppSelector, useAppDispatch } from "./store"

type Customer = {
    id: number
    phone: string
    email: string
    name: string
}

const TableCustomer = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const dispatch = useAppDispatch()

    const salesCustomerList = useAppSelector((state) => state.salesCustomerList)

    const {
        total = 0,
        pageIndex = 1,
        pageSize = 10,
        query = '',
        sort = { order: 'asc', key: '' }
    } = salesCustomerList?.data?.tableData || {}

    const loading = useAppSelector((state) => state.salesCustomerList?.data?.loading) ?? false

    const data = useAppSelector((state) => state.salesCustomerList?.data?.customerList) ?? []



    const fetchData = useCallback(() => {
        console.log(`{pageIndex, pageSize, sort, query}`, {
            pageIndex,
            pageSize,
            sort,
            query
        })
        dispatch(getCustomers({ pageIndex, pageSize, sort, query }))
    }, [dispatch, pageIndex, pageSize, sort, query])

    useEffect(() => {
        dispatch(setSelectedRows([]))
        fetchData()
    }, [dispatch, fetchData, pageIndex, pageSize, sort])

    useEffect(() => {
        if (tableRef.current) {
            tableRef.current.resetSelected()
        }
    }, [data])

    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total }),
        [pageIndex, pageSize, sort, query, total]
    )

    const columns: ColumnDef<Customer>[] = useMemo(
        () => [
            {
                header: 'Id',
                accessorKey: 'id',
            },
            {
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: 'Phone',
                accessorKey: 'phone',
            },
            {
                header: 'Email',
                accessorKey: 'email',
            },
        ],
        []
    )

    const onPaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        dispatch(setTableData(newTableData))
    }

    const onSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        dispatch(setTableData(newTableData))
    }

    const onSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        dispatch(setTableData(newTableData))
    }

    const onRowSelect = (checked: boolean, row: Customer) => {
        if (checked) {
            dispatch(addRowItem([row.id]))
        } else {
            dispatch(removeRowItem(row.id))
        }
    }

    const onAllRowSelect = useCallback(
        (checked: boolean, rows: Row<Customer>[]) => {
            if (checked) {
                const selectedIds = rows.map((row) => row.original.id)
                dispatch(setSelectedRows(selectedIds))
            } else {
                dispatch(setSelectedRows([]))
            }
        },
        [dispatch]
    )

    if (!salesCustomerList) {
        return <div>Loading...</div>; // Or any other placeholder you prefer
    }

    return (
        <DataTable
            ref={tableRef}
            selectable
            columns={columns}
            data={data}
            loading={loading}
            pagingData={{
                total,
                pageIndex,
                pageSize,
            }}
            onPaginationChange={onPaginationChange}
            onSelectChange={onSelectChange}
            onSort={onSort}
            onCheckBoxChange={onRowSelect}
            onIndeterminateCheckBoxChange={onAllRowSelect}
        />
    )
}

export default TableCustomer