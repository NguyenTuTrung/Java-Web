import React, { useState } from 'react';
import FormComponent from "./ui/FormComponent";
import Details from "./ui/Details";
import SelectAttribute from "./ui/SelectAttribute";
import Input from '@/components/ui/Input';
import ColourSelect from './ui/SelectColor';
import AddAttribute from './ui/AddAttribute';
import SizeSelect from './ui/SizeSelect';
import ProductImage from './ui/ProductImage';
import { RequestsData, useAppContext } from '../../../store/ProductContext';
import SetProductDetailsManage from './ui/SetProductDetailsManage';
const AddProductDetailsManage = () => {

    const attributeGroups = [
        [
            { lableAddAttribute: 'brand', label: 'brand', labelBTN: 'Add', url: 'http://localhost:8080/api/v1/brand/brand', placeholder: 'Chọn ...', linksAddAttribute: 'http://localhost:8080/api/v1/brand/save', },
            { lableAddAttribute: 'collar', label: 'collar', labelBTN: 'Add', url: 'http://localhost:8080/api/v1/collar/collar', placeholder: 'Chọn ...', linksAddAttribute: 'http://localhost:8080/api/v1/collar/save', },
            { lableAddAttribute: 'elasticity', label: 'elasticity', labelBTN: 'Add', url: 'http://localhost:8080/api/v1/elasticity/elasticity', placeholder: 'Chọn ...', linksAddAttribute: 'http://localhost:8080/api/v1/elasticity/save', },
            { lableAddAttribute: 'material', label: 'material', labelBTN: 'Add', url: 'http://localhost:8080/api/v1/material/material', placeholder: 'Chọn ...', linksAddAttribute: 'http://localhost:8080/api/v1/material/save', },
            { lableAddAttribute: 'origin', label: 'origin', labelBTN: 'Add', url: 'http://localhost:8080/api/v1/origin/origin', placeholder: 'Chọn ...', linksAddAttribute: 'http://localhost:8080/api/v1/origin/save', },
            { lableAddAttribute: 'sleeve', label: 'sleeve', labelBTN: 'Add', url: 'http://localhost:8080/api/v1/sleeve/sleeve', placeholder: 'Chọn ...', linksAddAttribute: 'http://localhost:8080/api/v1/sleeve/save', },
            { lableAddAttribute: 'style', label: 'style', labelBTN: 'Add', url: 'http://localhost:8080/api/v1/style/style', placeholder: 'Chọn ...', linksAddAttribute: 'http://localhost:8080/api/v1/style/save', },
            { lableAddAttribute: 'texture', label: 'texture', labelBTN: 'Add', url: 'http://localhost:8080/api/v1/texture/texture', placeholder: 'Chọn ...', linksAddAttribute: 'http://localhost:8080/api/v1/texture/save', },
            { lableAddAttribute: 'thickness', label: 'thickness', labelBTN: 'Add', url: 'http://localhost:8080/api/v1/thickness/thickness', placeholder: 'Chọn ...', linksAddAttribute: 'http://localhost:8080/api/v1/thickness/save', },


        ],
    ];

    // // Lấy các item đã chọn từ Redux index
    // const selectedOptions = useSelector((state: RootState) => state.selectedOptions);
    // // console.log('Selected Options:', selectedOptions); // Kiểm tra cấu trúc

    const { properties, setProperties } = useAppContext();
    const { productDetails, setProductDetails } = useAppContext();
    // console.log(productDetails)

    return (
        <div>
            <FormComponent
                label="ADD PRODUCT"
                childrenArticle={
                    <div>
                        <div className="md:flex mb-4">
                            <div className="md:flex-1 md:pr-4 p-2">
                                {/* {properties.name} */}
                                <Input
                                    className="w-full"
                                    placeholder="NAME"
                                    value={properties.name}
                                    onChange={(e) =>
                                        setProperties((prevState) => ({
                                            ...prevState,
                                            name: e.target.value, // Đảm bảo đúng field name
                                        }))
                                    }
                                />
                            </div>
                        </div>
                        {attributeGroups.map((attributeGroup, index) => (
                            <SelectAttribute
                                key={index}
                                attribute={attributeGroup}
                            />
                        ))}
                        <div className='flex flex-wrap mb-4'>

                            <div
                                className="w-full md:w-1/2 p-2"
                            >
                                <label htmlFor="" className="block text-lg font-medium text-gray-700    ">
                                    Màu sắc
                                </label>
                                <div className="grid grid-flow-row-dense grid-cols-10 items-center">
                                    <div className="col-span-9">
                                        <ColourSelect url='http://localhost:8080/api/v1/color/color' />
                                    </div>
                                    <div>
                                        <AddAttribute labelAddAttribute={"Thêm màu sắc"} linksAddAttribute={"http://localhost:8080/api/v1/color/save"} />
                                    </div>
                                </div>
                            </div>
                            <div
                                className="w-full md:w-1/2 p-2"
                            >
                                <label htmlFor="" className="block text-base font-medium text-gray-700">
                                    Kích thước
                                </label>
                                <div className="grid grid-flow-row-dense grid-cols-10 items-center">
                                    <div className="col-span-9">
                                        <SizeSelect urlSize='http://localhost:8080/api/v1/size/size' />
                                    </div>
                                    <div>
                                        <AddAttribute labelAddAttribute={"Thêm kích thước"} linksAddAttribute={"http://localhost:8080/api/v1/size/save"} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <ProductImage />
                        </div>


                        <div>
 
                            <SetProductDetailsManage />
                        </div>

                    </div>
                }

                childrenNav={
                    <Details
                        label="ADD PRODUCT"
                        links={[
                            { name: "PRODUCT", url: "/admin/manage/product" },
                        ]}
                    />
                }
            />
        </div>
    );

}

export default AddProductDetailsManage;