import React, { useState, useEffect } from "react";
import blackFriday from "../images/black-friday.png"
import blackFriday2 from "../images/black-friday-2.png"
import blackFriday3 from "../images/black-friday-3.png"


const SlideShow = () => {
    const slides = [
        {
            image: blackFriday,
        },
        {
            image:
                blackFriday2,
        },
        {
            image: blackFriday3,
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(nextSlide, 3000);
        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="relative h-[460px] w-full overflow-hidden">
            {/* Hình ảnh */}
            <div className="absolute inset-0">
                <img
                    src={slides[currentIndex].image}
                    alt={`Slide ${currentIndex + 1}`}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Nút chuyển slide trước */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white px-4 py-2 rounded-full transition"
            >
                &lt;
            </button>

            {/* Nút chuyển slide sau */}
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white px-4 py-2 rounded-full transition"
            >
                &gt;
            </button>
        </div>
    );
};

export default SlideShow;
