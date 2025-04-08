import { useEffect, useMemo, useState } from "react";
import TableRowSelection from './TableRowSelection';
import { useAppContext } from '@/store/ProductContext';
import MyComponent from "./MyComponent";

interface ChildComponentProps {
    label?: string;
}

const SetProductDetailsManage: React.FC<ChildComponentProps> = ({ label }) => {
    const { productDetails } = useAppContext();
    const [updatedProductDetails, setUpdatedProductDetails] = useState(productDetails);
    const { product, setProperties } = useAppContext();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [productData, setProductData] = useState(null);
    const [isProductFound, setIsProductFound] = useState(false);
console.log(productDetails)
    const hasValidProductDetails = useMemo(() => {
        return updatedProductDetails.length > 0 && updatedProductDetails.every(detail => {
            return Object.values(detail).every(value => value !== undefined && value !== null);
        });
    }, [updatedProductDetails]);

    useEffect(() => {
        if (updatedProductDetails.length === 0) {
            setUpdatedProductDetails(productDetails);
        }
    }, [productDetails]);

    const handleProductSearch = async () => {
        if (!product?.name) {
            console.error('Tên sản phẩm không hợp lệ.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/v1/product/search/${product.name}`);
            if (response.ok) {
                const data = await response.json();
                setProductData(data);
                setIsProductFound(true);
                setModalIsOpen(true); // Hiển thị modal xác nhận
            } else {
                await addNewProduct(); // Thêm sản phẩm mới nếu không tìm thấy
            }
        } catch (error) {
            console.error('Lỗi trong quá trình tìm kiếm sản phẩm:', error);
        }
    };

    const addNewProduct = async () => {
        if (!product?.name || !product?.code) {
            console.error('Tên hoặc mã sản phẩm không hợp lệ.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/v1/product/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: product.name, code: product.code }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Lỗi khi thêm sản phẩm:', errorData);
                throw new Error('Lỗi khi thêm sản phẩm');
            }

            await refetchProduct();
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
        }
    };

    const refetchProduct = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/product/search/${product.name}`);
            if (response.ok) {
                const data = await response.json();
                setProperties(prevProperties => ({
                    ...prevProperties,
                    product: data,
                }));
                await addMultipleProductDetails(data); // Thêm chi tiết sản phẩm
            } else {
                console.error('Không tìm thấy sản phẩm vừa thêm.');
            }
        } catch (error) {
            console.error('Lỗi trong quá trình tìm kiếm lại sản phẩm:', error);
        }
    };

    const handleAdd = async () => {
        await handleProductSearch();
    };

    const handleConfirmation = async () => {
        if (productData) {
            setProperties(prevProperties => ({
                ...prevProperties,
                product: {
                    id: productData.id,
                    name: productData.name,
                    code: productData.code,
                    createdDate: productData.createdDate,
                    deleted: productData.deleted,
                },
            }));
            if (isProductFound) {
                await addMultipleProductDetails(productData); // Gọi hàm thêm chi tiết sản phẩm nếu tìm thấy
            }
        }
        setModalIsOpen(false);
    };

    const addMultipleProductDetails = async (productData) => {
        const detailsToSave = updatedProductDetails.map(detail => ({
            ...detail,
            product: {
                id: productData.id,
                name: productData.name,
                code: productData.code,
            },
        }));

        console.log("Details to save:", detailsToSave); // Thêm dòng này để kiểm tra dữ liệu

        try {
            const response = await fetch('http://localhost:8080/api/v1/productDetails/saveAll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(detailsToSave),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Lỗi khi thêm chi tiết sản phẩm:', errorData);
                throw new Error('Lỗi khi thêm chi tiết sản phẩm');
            }

            const result = await response.json();
            console.log('Chi tiết sản phẩm đã được thêm:', result);
            window.location.href = "/admin/manage/product";
        } catch (error) {
            console.error('Lỗi trong quá trình thêm chi tiết sản phẩm:', error);
        }
    };
    const handleCancel = () => {
        setModalIsOpen(false);
    };

    return (
        <>
            {hasValidProductDetails && (
                <div className="flex flex-col space-y-4">
                    <div className="relative bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-br from-[#1E5B53] to-[#CCFFAA] text-white shadow-gray-900/20 shadow-lg p-6">
                        <h6 className="block antialiased tracking-normal font-sans text-xl font-bold leading-relaxed text-white text-center">{label}</h6>
                    </div>
                    <div>
                        <TableRowSelection />
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-center">
                        <button
                            type="button"
                            onClick={handleAdd}
                            className="px-8 py-3 bg-gradient-to-br from-[#1E5B53] to-[#CCFFAA] text-white font-bold rounded-3xl transition-all duration-300 transform-gpu hover:opacity-80 hover:shadow-lg"
                        >
                            Add
                        </button>
                    </div>

                    {modalIsOpen && (
                        <div className="absolute top-0 right-0 m-4">
                            <MyComponent
                                isOpen={modalIsOpen}
                                onRequestClose={handleCancel}
                                onConfirm={handleConfirmation}
                                title="Xác nhận thêm chi tiết sản phẩm"
                                message={isProductFound
                                    ? "Sản phẩm đã tồn tại. Bạn có muốn thêm chi tiết cho sản phẩm này?"
                                    : "Sản phẩm đã được thêm thành công. Bạn có muốn thêm chi tiết cho sản phẩm này?"
                                }
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default SetProductDetailsManage;
