import FormComponent from "./ui/FormComponent";
import React, { useState,  } from 'react';
import { useParams } from 'react-router-dom';
import Details from "./ui/Details";
import TableProductDetails from "./ui/TableProductDetails";
const ProductDetailsManage = () => {
    const labels = [
        { header: 'MÃ', accessorKey: 'code' },
        { header: 'Tên', accessorKey: 'name' },
        { header: 'Màu Sắc', accessorKey: 'color.name',  },
        { header: 'Kích cỡ', accessorKey: 'size.name' }, // Adjust based on your ChildObject structure
        { header: 'Giá', accessorKey: 'price' },
        { header: 'Số lượng tồn', accessorKey: 'quantity' },
    ];
    // const { id } = useParams();
    // console.log(id)
    return (
        <div>
            <FormComponent
                label="SẢN PHẨM CHI TIẾT"
                childrenArticle={<TableProductDetails
                    label={labels}
                    url="http://localhost:8080/api/v1/productDetails/details"
                    // onRowClick={(id) => {
                    //     // Chuyển hướng hoặc xử lý khi click vào hàng
                    //     console.log('Row clicked with ID:', id);
                    // }}
                />}
                childrenNav={<Details
                    label="SẢN PHẨM CHI TIẾT"
                    links={[
                        {
                            name: "ADD PRODUCT",
                            url: "/admin/manage/product"
                        },
                    ]}
                    
                />}
            />
        </div>
    );
}
// nham file hsy 

export default ProductDetailsManage;