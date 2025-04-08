import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoBagHandle, IoCart } from 'react-icons/io5';
import { FaEye } from 'react-icons/fa';
import { Button } from '@/components/ui';
import { Pagination, Select } from '@/components/ui'
import BreadCrumb from './BreadCrumb';
import ProductCard from '@/views/sale/product/ProductCard'


interface Color {
    id: number;
    name: string;
}

interface Size {
    id: number;
    name: string;
}

interface Event {
    id: number;
    name: string;
}

interface Product {
    productId: number;
    productCode: string;
    productName: string;
    countColor: number;
    countSize: number;
    price: number;
    discountPrice: number;
    discountPercent: number;
    discountAmount: number;
    image: string[];
    mass: number;
    listEvent: Event[];
}


type Option = {
    value: number
    label: string
}
const options: Option[] = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 50, label: '50 / page' }
]

const NewProduct: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
    const [pageSize, setPageSize] = useState(10)

    const onPageSizeChange = (val: Option) => {
        setPageSize(val.value)
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
    }
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [totalElement, setTotalElement] = useState(0)


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/productDetails/event?page=0&size=10');
                const data = await response.json();
                setProducts(data.content);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, pageSize]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        
        <div className="product-list">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mt-5">
                {products.map((product, index) => (
                   <ProductCard key={index} product={product}> </ProductCard>
                ))}
            </div>
            <div className="flex items-center justify-end pb-10"> {/* Align pagination to the right */}
                <Pagination
                    currentPage={currentPage + 1} // Ant Design expects 1-based page number
                    pageSize={pageSize}
                    total={totalElement}
                    onChange={handlePageChange}
                />
                <div style={{ minWidth: 120 }} className="ml-4">
                    <Select
                        size="sm"
                        isSearchable={false}
                        defaultValue={options[0]}
                        options={options}
                        onChange={selected => onPageSizeChange(selected as Option)}
                    />
                </div>
            </div>
        </div>
    );
};

export default NewProduct;
