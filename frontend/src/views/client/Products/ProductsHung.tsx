import React, { useState, useEffect } from "react";
import { FaEye, FaShoppingCart } from "react-icons/fa";
import axios from "axios";

// Adjusted Product interface to match API response
interface Product {
  productId: number;
  productCode: string;
  productName: string;
  countColor: number;
  countSize: number;
  originPrice: number | null;
  discountPrice: number | null;
  discountPercent: number | null;
  discountAmount: number | null;
  image: string[];
  mass: number | null;
}

const Products = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/productDetails/abc?page=5");
        // Extract the content array from the API response
        const products = response.data.content || [];
        setProductList(products);
      } catch (error) {
        setError("Error fetching products data.");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  
  const handleViewDetails = (productId: number) => {
    console.log(`View details for product with id: ${productId}`);
  };

  const handleAddToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log(`Added product to cart: ${product.productName}`);
  };

  return (
    <div className="mt-14 mb-12">
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-primary">
            Sản phẩm bán chạy nhất cho bạn
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Danh Mục Sản Phẩm
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400">
            Uy tín - Chất lượng - Giá tốt
          </p>
        </div>

        {/* Loading State */}
        {loading && <div className="text-center">Loading...</div>}

        {/* Error State */}
        {error && <div className="text-center text-red-500">{error}</div>}

        {/* Body section */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5">
            {/* Card section */}
            {productList.length > 0 ? (
              productList.map((data, index) => (
                <div
                  data-aos="fade-up"
                  data-aos-delay={index * 100} // Increase the delay based on the index
                  key={data.productId} // Ensure a unique key for each item
                  className="space-y-3 relative group transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={data.image[0] || "default-image.jpg"} // Use the first image or a default image if no image is provided
                    alt={data.productName}
                    className="h-[320px] w-[250px] object-cover rounded-md transition-all duration-300 group-hover:brightness-75"
                  />
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs py-1 px-2 rounded-md">
                    {data.discountPercent && `${data.discountPercent}% OFF`}
                  </div>
                  <div>
                    <h3 className="font-semibold">{data.productName}</h3>
                    <p className="font-bold text-lg">
                      {data.discountPrice ? (
                        <span>{data.discountPrice}</span>
                      ) : (
                        <span>{data.originPrice}</span>
                      )}
                      {data.originPrice && data.discountPrice && (
                        <span className="line-through text-gray-400 ml-2">{data.originPrice}</span>
                      )}
                    </p>
                  </div>

                  {/* Add to Cart and View Details buttons */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <button
                      className="flex items-center gap-1 bg-green-600 text-white py-2 px-4 rounded-lg shadow-md transform hover:bg-green-700 hover:shadow-lg transition-all duration-200 ease-in-out"
                      onClick={() => handleAddToCart(data)}
                    >
                      <FaShoppingCart /> Thêm vào giỏ hàng
                    </button>
                    <button
                      className="flex items-center gap-1 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transform hover:bg-blue-700 hover:shadow-lg transition-all duration-200 ease-in-out"
                      onClick={() => handleViewDetails(data.productId)}
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">No products available</div>
            )}
          </div>

          {/* View All Button */}
          <div className="flex justify-center">
            <button className="text-center mt-10 cursor-pointer bg-primary text-white py-4 px-7 rounded-lg shadow-md hover:bg-opacity-80 transition-all duration-200">
              Xem tất cả sản phẩm nổi bật
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
