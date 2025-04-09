import { useEffect, useMemo, useRef, ReactNode, ChangeEvent } from 'react'
import Badge from '@/components/ui/Badge'
import DataTable from '@/components/shared/DataTable'
import { RiMoonClearLine, RiSunLine } from 'react-icons/ri'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { HiOutlinePencil } from 'react-icons/hi'
import Switcher from '@/components/ui/Switcher'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import {
    Attribute,
    getAttributeByID,
    getAttributes,
    setTableData,
    setSelectedAttribute,
    toggleDeleteConfirmation,
    toggleUpdateConfirmation,
    useAppDispatch,
    useAppSelector,
} from '../store'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import type {
    DataTableResetHandle,
    OnSortParam,
    ColumnDef,
} from '@/components/shared/DataTable'
import DeleteConfirmation from './AttributeDeleteConfirmation'
import UpdateConfirmation from './AttributeUpdateConfirmation'
type AttributeTableProps = {
    apiFunc: any;
    apiDelete:any;
    apiGetByID:any;
    lablel:string;
    apiUpdate:any;
};





const withIcon = (component: ReactNode) => {
    return <div className="text-lg">{component}</div>
}

const AttributeColumn = ({ row }: { row: Attribute }) => {


    return (
        <div className="flex items-center">
            <span className={`ml-2 rtl:mr-2 font-semibold`}>{row.name}</span>
        </div>
    )
}

const getDeletedStatus = (deleted: boolean) => {
    if (deleted) {
        return {
            label: 'Dừng hoạt động',
            dotClass: 'bg-red-500',
            textClass: 'text-red-500',
        };
    } else {
        return {
            label: 'Đang hoạt động',
            dotClass: 'bg-emerald-500',
            textClass: 'text-emerald-500',
        };
    }
};



const AttributeTable = ({ apiFunc, apiDelete, lablel, apiGetByID, apiUpdate }: AttributeTableProps) => {
    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.salesAttributeList.data.tableData
    )


    const loading = useAppSelector(
        (state) => state.salesAttributeList.data.loading
    )

    const data = useAppSelector(
        (state) => state.salesAttributeList.data.AttributeList
    )

    useEffect(() => {
        fetchData()
    }, [pageIndex, pageSize, sort])




    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total }),
        [pageIndex, pageSize, sort, query, total]
    )



    const fetchData = () => {
        const requestData = { pageIndex, pageSize, sort, query };
        dispatch(getAttributes({ apiFunc, requestData }));
    };


    const ActionColumn = ({ row }: { row: Attribute }) => {
        const dispatch = useAppDispatch()
        const { textTheme } = useThemeClass()
        const onDelete = () => {
            dispatch(toggleDeleteConfirmation(true)) 
            dispatch(setSelectedAttribute(row.id))
         

        }
        const onUpdate = () => {
            dispatch(toggleUpdateConfirmation(true)) 
             dispatch(
                getAttributeByID({
                    apiFunc: apiGetByID,
                    params: { id: row.id },
                })
            ).unwrap();
        }

        const onSwitcherToggle = (val: boolean, e: ChangeEvent) => {
             onDelete()
        } 
        return (
            <div className="flex w-full justify-start gap-2 items-center">

                <HiOutlinePencil
                    onClick={onUpdate}
                    size={20}
                    className="mr-3 text-2xl"
                    style={{ cursor: 'pointer' }}
                />
                <Switcher
                    className='text-sm'
                    unCheckedContent={withIcon(<RiMoonClearLine />)}
                    checkedContent={withIcon(<RiSunLine />)}
                    color="green-500"
                    checked={!row.deleted}
                    onChange={onSwitcherToggle} />
            </div>
        );
    };

    const columns: ColumnDef<Attribute>[] = useMemo(
        () => [
            {
                header: '#',
                id: 'index',
                cell: (props: any) => {
                    const { pageIndex, pageSize } = useAppSelector(
                        (state) => state.salesAttributeList.data.tableData
                    );
                    const safePageIndex = pageIndex ?? 0;
                    const safePageSize = pageSize ?? 10;
                    const index = (safePageIndex - 1) * safePageSize + (props.row.index + 1); // Tính số thứ tự
                    return index;
                }
            },
            {
                header: 'Mã',
                accessorKey: 'code',
                cell: (props: any) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.code}</span>
                },
            },
 

            {
                header: 'Tên',
                accessorKey: 'name',
                cell: (props: any) => {
                    const row = props.row.original
                    return <AttributeColumn row={row} />
                },
            },
            {
                header: 'Ngày tạo', 
                accessorKey: 'createdDate',
            },
            {
                header: 'Trạng thái',
                accessorKey: 'deleted', 
                cell: (props) => {
                    const { deleted } = props.row.original;
                    const status = getDeletedStatus(deleted);

                    return (
                        <div className="flex items-center gap-2">
                            <Badge className={status.dotClass} />
                            <span className={`capitalize font-semibold ${status.textClass}`}>
                                {status.label}
                            </span>
                        </div>
                    );
                },
            },

            {
                header: 'Hành động',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row.original} />,
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

    return (
        <>
            {data.length > 0 ? (
            <DataTable
                ref={tableRef}
                columns={columns}
                data={data}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                loading={loading}
                pagingData={{
                    total: tableData.total as number,
                    pageIndex: tableData.pageIndex as number,
                    pageSize: tableData.pageSize as number,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                onSort={onSort}
            />
            ) : (
                <div className="flex flex-col justify-center items-center h-full">
                    <DoubleSidedImage
                        className="max-w-[200px]"
                        src="/img/others/image-removebg-preview-order-empty.png"
                        darkModeSrc="/img/others/image-removebg-preview-order-empty.png"
                    />
                    <div className="mt-4 text-2xl font-semibold">
                        Không có {lablel} nào!!!
                    </div>
                </div>
            )
            } 
            <DeleteConfirmation apiDelete={apiDelete} apiFunc={apiFunc} lablel={lablel} />
            <UpdateConfirmation apiFunc={apiFunc} label={lablel} apiUpdate={apiUpdate} />
        </>
    )
}

export default AttributeTable
