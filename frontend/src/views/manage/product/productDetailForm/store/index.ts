import { combineReducers } from '@reduxjs/toolkit';
import optionReducer, { SLICE_NAME as optionName, OptionState } from './dataDetailedProductForm';
import attributeReducer, { NEW_ATTRIBUTE as newAttributeName, AddAttributeState } from './newAttibute';

import { useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '@/store';

const rootReducer = combineReducers({
    options: optionReducer,
    newAttribute: attributeReducer
});

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
      
        [optionName]: {
            options: OptionState
        }
        [newAttributeName]: {
            newAttribute: AddAttributeState
        }
    }
> = useSelector;

export * from './dataDetailedProductForm';
export * from './newAttibute';
export { useAppDispatch } from '@/store';
export default rootReducer;
