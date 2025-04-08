import React from 'react';
import { useSelector } from 'react-redux';
import FormComponent from "./ui/FormComponent";
import { RootState } from '../../../store/rootReducer';
import TableRowSelection from './ui/TableRowSelection';
import { useAppContext } from '@/store/ProductContext';

const Test = () => {
    const selectedOptions = useSelector((state: RootState) => state.selectedOptions);

    type DataRow = {
        id: number;
        name: string;
        size: string;
        color: string;
        brand: string;      // Additional fields
        collar: string;
        elasticity: string;
        material: string;
        origin: string;
        sleeve: string;
        style: string;
        texture: string;
        thickness: string;
    };

 

    const { productDetails, setProductDetails } = useAppContext();
    console.log(productDetails)
    return (
        <div>
         <FormComponent
                label="ADD PRODUCT"
                childrenArticle={
                    <>
                        <TableRowSelection
                            label={[
                                { header: 'Name', accessorKey: 'name' },
                                { header: 'Color', accessorKey: 'color' },
                                { header: 'Size', accessorKey: 'size' },
                            ]}
                            data={productDetails} // Pass the full data
                        />
                    </>
                }
            />
        </div>
    );
}

export default Test;
