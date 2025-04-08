import React from "react";
import SlideShow from "./decorate/SlideShow";
import banner from "./images/banner1.png"
import banner2 from "./images/banner2.png"
import banner3 from "./images/banner3.png"
import NewProduct from "./NewProduct";

function BlackFriday() {

  const features = [
    {
      imgSrc: "https://sneakerdaily.vn/wp-content/uploads/2022/09/doi-mau-doi-size-mien-phi.jpg",
      text: "Đổi mẫu, đổi size miễn phí",
    },
    {
      imgSrc: "https://sneakerdaily.vn/wp-content/uploads/2022/09/mua-truoc-tra-sau-mien-lai.jpg",
      text: "Mua trước, trả sau miễn lãi",
    },
    {
      imgSrc: "https://sneakerdaily.vn/wp-content/uploads/2022/09/giao-hang-doi-tra-tan-nha.jpg",
      text: "Giao hàng, đổi trả tận nhà",
    },
    {
      imgSrc: "https://sneakerdaily.vn/wp-content/uploads/2022/09/hang-gia-den-tien-gap-doi.jpg",
      text: "Hàng giả, đền tiền gấp đôi",
    },
  ];


  return (
    <div className="bg-white text-white font-sans">
      {/* Container với chiều rộng lớn hơn */}
      <div className="container mx-auto px-[4%] mt-0 max-w-full"> {/* max-w-full để mở rộng hết */}

        <div className="flex flex-wrap bg-gray-50 p-4 space-x-4">
          {/* Phần bên trái (SlideShow) */}
          <div className="flex-[8] bg-white shadow-lg rounded-lg overflow-hidden w-full h-full">
            <div className="relative w-full h-full">
              <SlideShow />
            </div>
          </div>

          {/* Phần bên phải */}
          <div className="flex-col space-y-8 flex-[2]">
            {/* Slide 1 */}
            <div className="bg-gray-100 rounded-lg shadow-md flex">
              <img
                src={banner}
                alt="BST Kính Mắt 2024"
                className="w-full h-full object-cover rounded-md shadow-md"
              />
            </div>
            {/* Slide 2 */}
            <div className="bg-gray-100  rounded-lg shadow-md flex">
              <img
                src={banner2}
                alt="BST Túi Xách 2024"
                className="w-full h-full object-cover rounded-md shadow-md"
              />
            </div>
            <div className="bg-gray-100  rounded-lg shadow-md flex">
              <img
                src={banner3}
                alt="BST Túi Xách 2024"
                className="w-full h-full object-cover rounded-md shadow-md"
              />
            </div>


          </div>
        </div>

        <div className="flex justify-around items-center py-4 bg-gray-100 mt-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center space-x-4  p-2 rounded-lg bg-white shadow-sm"
            >
              <div className="w-15 h-15 rounded-full  overflow-hidden">
                <img
                  src={feature.imgSrc}
                  alt={feature.text}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm font-medium text-black">{feature.text}</p>
            </div>
          ))}
        </div>

        <div className="text-blue-600">
          <div className="text-center mt-10 uppercase font-semibold">
            <h1>Bộ sưu tập</h1>
          </div>
          <NewProduct />
        </div>


      </div>

    </div>
  );
}

export default BlackFriday;
