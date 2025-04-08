import { combineReducers } from '@reduxjs/toolkit'
import reducers, { SLICE_NAME, SalesProductDetailListState } from './productDetailListSlice'
import detailedProductReducer, { UPDATE_PRODUCT_DETAIL, SalesProductDetailState } from './productDetailUpdate'
import attributeReducer, { DATA_NAME, AttributeState } from './dataAttribute'


 
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({
    data: reducers,
    updateProductDetailed: detailedProductReducer,
    DataProductDetailQuery: attributeReducer
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: SalesProductDetailListState
        }
        [UPDATE_PRODUCT_DETAIL]: {
            updateProductDetailed: SalesProductDetailState
        }
        [DATA_NAME]: {
            DataProductDetailQuery: AttributeState
        }
    } 
> = useSelector

export * from './productDetailListSlice'
export * from './productDetailUpdate'
export * from './dataAttribute'
export { useAppDispatch } from '@/store'
export default reducer
