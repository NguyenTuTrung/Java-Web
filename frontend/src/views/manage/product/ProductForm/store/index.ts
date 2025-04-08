import { combineReducers } from '@reduxjs/toolkit';
import attributeAddReducer, { SLICE_NAME_ADD_ATTRIBUTE as attributeSliceName, AddAttributeState } from './addAttribute';
import productAddReducer, { SLICE_NAME_ADD_PRODUCT as productSliceName, AddProductState } from './addAttribute'; // Đảm bảo import từ file đúng
import optionSliceReducer, { SLICE_NAME as optionSliceName, OptionState } from './productFormSlice';
import detailedProductReducer, { SLICE_NAME_DETAILED_PRODUCT as detailedProductSliceName, AddDetailedProductState } from './dataDetailedProduct'; // Import reducer cho sản phẩm chi tiết
import { useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '@/store';

const rootReducer = combineReducers({
    attributeAdd: attributeAddReducer.attributeReducer,
    productAdd: productAddReducer.productReducer,
    options: optionSliceReducer,
    detailedProduct: detailedProductReducer,
});

export const useAppSelector: TypedUseSelectorHook<
    RootState & { 
        [attributeSliceName]: {
            attributeAdd: AddAttributeState
        }
        [optionSliceName]: {
            options: OptionState
        }
        [productSliceName]: {
            productAdd: AddProductState 
        }
        [detailedProductSliceName]: { 
            detailedProduct: AddDetailedProductState
        }
    }
> = useSelector;

export * from './addAttribute';
export * from './productFormSlice';
export * from './dataDetailedProduct'; // Xuất các action từ slice sản phẩm chi tiết
export { useAppDispatch } from '@/store';
export default rootReducer;
