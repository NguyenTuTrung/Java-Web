import { combineReducers } from '@reduxjs/toolkit'
import reducers, { StatisticState, SLICE_NAME } from './slice'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { RootState } from '@/store'

// NHẬP VỀ 1 REDUCERS DUY NHẤT
const reducer = combineReducers({
    object: reducers
})
export const useAppSelector: TypedUseSelectorHook<
    RootState & {
    [SLICE_NAME] : {
        object: StatisticState
    }
}> = useSelector

export * from './slice'
export { useAppDispatch } from '@/store'
export default reducer
