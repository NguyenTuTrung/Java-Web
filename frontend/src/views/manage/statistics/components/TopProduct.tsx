import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Avatar from '@/components/ui/Avatar'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper
} from '@tanstack/react-table'
import { FiPackage } from 'react-icons/fi'
import { TopProductDTO, useAppSelector } from '../store'
import { Select } from '@/components/ui'

type TopProductProps = {
    data?: TopProductDTO[]
    className?: string
}

const { Tr, Td, TBody, THead, Th } = Table

const ProductColumn = ({ row }: { row: TopProductDTO }) => {
    const avatar = row.img ? (
        <Avatar src={row.img} className={'w-[250px]'}/>
    ) : (
        <Avatar icon={<FiPackage />} />
    )

    return (
        <div className="flex items-center gap-2">
            {avatar}
            <span className="font-semibold">{row.name}</span>
        </div>
    )
}

const columnHelper = createColumnHelper<TopProductDTO>()

const columns = [
    columnHelper.accessor('name', {
        header: 'Product',
        cell: (props) => {
            const row = props.row.original
            return <ProductColumn row={row} />
        }
    }),
    columnHelper.accessor('sold', {
        header: 'Sold'
    })
]

const TopProduct = ({ data = [], className }: TopProductProps) => {

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    // const listOptions = [
    //     { value: 5, label: 5, color: '#00B8D9' },
    //     { value: 10, label: 10, color: '#0052CC' },
    //     { value: 20, label: 20, color: '#5243AA' },
    // ]
    // const topIndex = useAppSelector((state) => state.statistic.topProductParam.size);

    return (
        <Card className={className}>
            <div className="flex items-center justify-between mb-4">
                <h4>Top thịnh hành</h4>
                {/*<Button size="sm">View Products</Button>*/}
                {/*<div>*/}
                {/*    <Select*/}
                {/*        placeholder="Please Select"*/}
                {/*        options={listOptions}*/}
                {/*        value={listOptions.find((s) => s.value === topIndex)}*/}
                {/*    ></Select>*/}
                {/*</div>*/}
            </div>

            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <Th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </Th>
                                )
                            })}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row) => {
                        return (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <Td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </Td>
                                    )
                                })}
                            </Tr>
                        )
                    })}
                </TBody>
            </Table>
        </Card>
    )
}

export default TopProduct
