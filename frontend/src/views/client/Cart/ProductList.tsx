import React, { useState, useEffect } from 'react';
import ProductItem from './ProductItem';

const ProductList = () => {
    const [products, setProducts] = useState(() => {
        // Load initial cart data from localStorage, or use default products if no data exists
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        return savedCart.length > 0 ? savedCart : [
            { id: 1, name: 'Sản phẩm 1', price: 100000, quantity: 1, image: 'https://down-vn.img.susercontent.com/file/9dda1448805603bf7e6f72ed863999f8' },
            { id: 2, name: 'Sản phẩm 2', price: 150000, quantity: 2, image: 'https://down-vn.img.susercontent.com/file/9dda1448805603bf7e6f72ed863999f8' },
            { id: 3, name: 'Sản phẩm 3', price: 200000, quantity: 1, image: 'https://down-vn.img.susercontent.com/file/9dda1448805603bf7e6f72ed863999f8' }
        ];
    });

    // Save the cart to localStorage whenever it changes
    const updateLocalStorage = (updatedCart) => {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleUpdateQuantity = (productId, newQuantity) => {
        setProducts(prevProducts => {
            const updatedCart = prevProducts.map(product =>
                product.id === productId ? { ...product, quantity: newQuantity } : product
            );
            updateLocalStorage(updatedCart);
            return updatedCart;
        });
    };

    const handleRemoveProduct = (productId) => {
        setProducts(prevProducts => {
            const updatedCart = prevProducts.filter(product => product.id !== productId);
            updateLocalStorage(updatedCart);
            return updatedCart;
        });
    };

    return (
        <div className="p-8">
            <div className="space-y-4">
                {products.map(product => (
                    <ProductItem
                        key={product.id}
                        product={product}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveProduct}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductList;
