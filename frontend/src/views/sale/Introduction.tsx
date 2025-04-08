import React, { useEffect, useState } from 'react';

function Introduction() {

    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            imageUrl: "https://wallpapers.com/images/featured/clothes-background-ot7pkynbf8g28jsr.jpg"
        },
        {
            imageUrl: "https://nypost.com/wp-content/uploads/sites/2/2022/11/black-friday-fashion-2.jpg?quality=75&strip=all"
        },
        {
            imageUrl: "https://assets.vogue.com/photos/65f8604e619fe40d5e1b0301/master/pass/western_Trends_001.jpg"
        }
    ];


    const coreValues = [
        { icon: "🚀", title: "Sáng Tạo", description: "Luôn sáng tạo và cải tiến để mang đến sản phẩm dịch vụ tốt nhất." },
        { icon: "🤝", title: "Hợp Tác", description: "Khuyến khích sự hợp tác và làm việc nhóm để đạt hiệu quả cao nhất." },
        { icon: "❤️", title: "Tận Tâm", description: "Cam kết mang đến sự hài lòng tối đa cho khách hàng." },
        { icon: "📈", title: "Phát Triển", description: "Không ngừng cải tiến và phát triển trong mọi lĩnh vực." },
    ];

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000);

        return () => clearInterval(slideInterval);
    }, []);



    return (
        <div>
            <div className="min-h-screen w-full px-4 py-8">
                <div className='mb-10 mt-10'>
                    <div className="relative">
                        <div className="bg-white p-4 rounded-xl shadow-lg">
                            {/* Image */}
                            <img
                                src={slides[currentSlide].imageUrl}
                                alt="Slideshow"
                                className="w-full h-[1000px] object-cover rounded-xl"
                            />
                        </div>
                    </div>


                </div>
                {/* About Section */}
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* First Column - DOANH NGHIỆP */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="font-semibold text-2xl md:text-3xl mb-4">DOANH NGHIỆP</h3>
                            <p className="text-gray-600 text-lg">Là một doanh nghiệp với 13 năm hoạt động trên thị trường Việt, và đang không ngừng phát triển</p>
                        </div>

                        {/* Second Column - NGƯỜI BÁN HÀNG */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="font-semibold text-2xl md:text-3xl mb-4">NGƯỜI BÁN HÀNG</h3>
                            <p className="text-gray-600 text-lg">Là những người bán hàng tỉ mỉ trong từng sản phẩm. Mang chất lượng dịch vụ chạm đến trái tim</p>
                        </div>
                    </div>

                    {/* VỀ CANTH Section */}
                    <div className="relative py-8 mt-10 mb-10">
                        <div className="flex items-center justify-center space-x-4 relative">
                            <h2 className="text-3xl md:text-4xl font-bold text-center px-4">VỀ CANTH</h2>
                        </div>
                    </div>

                    {/* Sections Below VỀ CANTH */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Thương Hiệu Thời Trang Section */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="font-semibold text-2xl md:text-3xl mb-4">THƯƠNG HIỆU THỜI TRANG</h3>
                            <p className="text-gray-600 text-lg">Là thương hiệu thời trang siêu ứng dụng dẫn đầu Việt Nam được dân chúng tin yêu vì chất lượng và dịch vụ.</p>
                        </div>

                        {/* Môi Trường Làm Việc Section */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="font-semibold text-2xl md:text-3xl mb-4">MÔI TRƯỜNG LÀM VIỆC</h3>
                            <p className="text-gray-600 text-lg">Là nơi mang lại cho nhân viên sự tử tế, niềm vui, sự phát triển vượt bậc và niềm tự hào.</p>
                        </div>
                    </div>
                </div>


                {/* Statistics Section */}
                <div className="max-w-7xl mx-auto mt-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold">CHÚNG TÔI CÓ GÌ?</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                        {[
                            {
                                title: "Khách hàng",
                                description: "Hơn 1.000.000 khách hàng thân thiết",
                                image: "https://info.cardina.vn/wp-content/themes/cardina/assets/img/home-img/person.png"
                            },
                            {
                                title: "Cửa hàng",
                                description: "Hơn 30 cửa hàng trên toàn quốc",
                                image: "https://info.cardina.vn/wp-content/themes/cardina/assets/img/home-img/location.png"
                            },
                            {
                                title: "Hệ thống sản xuất",
                                description: "12 chuyền may hiệu suất cao",
                                image: "https://theme.hstatic.net/200000503583/1001276925/14/mobile_qtrinh_4.png?v=124"
                            },
                            {
                                title: "Sản Phẩm",
                                description: "Hơn 1700 mã sản phẩm đa dạng và chất lượng",
                                image: "https://info.cardina.vn/wp-content/themes/cardina/assets/img/home-img/woman.png"
                            },
                            {
                                title: "Đội ngũ",
                                description: "Hơn 300 nhân sự có chuyên môn cao",
                                image: "https://info.cardina.vn/wp-content/themes/cardina/assets/img/home-img/fashion-iocn.png"
                            }
                        ].map((item, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-300">
                                <div className="mb-4">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-20 w-auto mx-auto"
                                    />
                                </div>
                                <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-gray-500 py-20 mt-10">
                    <div className="mt-16">
                        <h3 className="text-3xl text-center font-bold text-gray-800 mb-8 ">GIÁ TRỊ CỐT LÕI CỦA CANTH</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-3 ">
                            {coreValues.map((value, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                                    <div className="text-4xl mb-4">{value.icon}</div>
                                    <h4 className="text-xl font-semibold text-gray-800 mb-2">{value.title}</h4>
                                    <p className="text-gray-600">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


                <div className="bg-gray-50 py-20 mt-10">
                    <div className="max-w-7xl mx-auto px-6 sm:px-16">
                        <div className="text-center">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6">TẦM NHÌN VÀ SỨ MỆNH</h2>
                            <p className="text-xl text-gray-600 mb-12">
                                Chúng tôi không chỉ bán hàng, mà còn mang lại giá trị bền vững cho khách hàng thông qua những sản phẩm chất lượng và dịch vụ tận tâm.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Tầm Nhìn */}
                            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
                                <img
                                    src="https://maisonoffice.vn/wp-content/uploads/2023/11/1-vai-tro-cua-tam-nhin-va-su-menh.jpg"
                                    alt="Vision Icon"
                                    className="w-24 h-24 mb-4"
                                />
                                <h3 className="text-2xl font-semibold text-gray-800 mb-4">TẦM NHÌN</h3>
                                <p className="text-lg text-gray-600 text-center">
                                    Chúng tôi mong muốn trở thành một trong những công ty hàng đầu trong ngành bán lẻ, cung cấp sản phẩm chất lượng cao và mang lại trải nghiệm mua sắm tuyệt vời cho khách hàng.
                                </p>
                            </div>

                            {/* Sứ Mệnh */}
                            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
                                <img
                                    src="https://anhvanyds.com/wp-content/uploads/2021/06/su-menh-tam-nhin-gia-tri-cot-loi.jpg"
                                    alt="Mission Icon"
                                    className="w-24 h-24 mb-4"
                                />
                                <h3 className="text-2xl font-semibold text-gray-800 mb-4">SỨ MỆNH</h3>
                                <p className="text-lg text-gray-600 text-center">
                                    Sứ mệnh của chúng tôi là cung cấp sản phẩm chất lượng, nâng cao giá trị cuộc sống của khách hàng thông qua dịch vụ chuyên nghiệp và cam kết sự hài lòng tuyệt đối.
                                </p>
                            </div>
                        </div>


                        {/* CTA Button */}
                        <div className="text-center mt-12">
                            <a
                                href="#contact"
                                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-xl font-medium hover:bg-blue-700 transition"
                            >
                                Liên Hệ Với Chúng Tôi
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Introduction;