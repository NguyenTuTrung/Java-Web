import { combineReducers } from '@reduxjs/toolkit'
import reducers, { SLICE_NAME, SalesAttributeListState } from './AttributeFormSlice'
import attributeAddReducer, { SLICE_NAME_ADD_ATTRIBUTE as attributeSliceName, AddAttributeState } from './addAttribute';
import attributeUpdateReducer, { UPDATE_ATTRIBUTE as updateAttribute, UpdateAttributeState } from './updateAttribute';
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({
    attributeAdd: attributeAddReducer,
    data: reducers,
    attibuteUpdate: attributeUpdateReducer
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: SalesAttributeListState
        }
        [attributeSliceName]: {
            attributeAdd: AddAttributeState
        }
        [updateAttribute]: {
            attibuteUpdate: UpdateAttributeState
        }
    }
> = useSelector
export * from './addAttribute';
export * from './AttributeFormSlice'
export * from './updateAttribute'

export { useAppDispatch } from '@/store'
export default reducer
 