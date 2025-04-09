import { useRef } from 'react'
import Input from '@/components/ui/Input'
import { HiOutlineSearch } from 'react-icons/hi'
import {
    getAttributes,
    setTableData,
    useAppSelector,
    useAppDispatch,
} from '../store'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
import type { TableQueries } from '@/@types/common'
import type { ChangeEvent } from 'react'

type AttributeTableSearchProps = {
    apiFunc: any;
};

const AttributeTableSearch = ({ apiFunc }: AttributeTableSearchProps) => {
    const dispatch = useAppDispatch()

    const searchInput = useRef(null)

    const tableData = useAppSelector(
        (state) => state.salesAttributeList.data.tableData
    )

    const debounceFn = debounce(handleDebounceFn, 500)

    function handleDebounceFn(val: string) {
        const newTableData = cloneDeep(tableData)
        newTableData.query = val
        newTableData.pageIndex = 1
        if (typeof val === 'string' && val.length > 1) {
            fetchData(newTableData)
        }

        if (typeof val === 'string' && val.length === 0) {
            fetchData(newTableData)
        }
    }

    const fetchData = (data: TableQueries) => {
        dispatch(setTableData(data))
        const requestData = data
        dispatch(getAttributes({ apiFunc, requestData }));

    }


    const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    return (
        <Input
            ref={searchInput}
            className="max-w-md md:w-65 md:mb-0 mb-4 "
            size="sm"
            placeholder="TÌM KIẾM THEO MÃ, TÊN ..."
            prefix={<HiOutlineSearch className="text-lg" />}
            onChange={onEdit}
        />
    )
}

export default AttributeTableSearch
