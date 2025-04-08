import { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
// import "./hiddennavbarfooter.css"
const PageNotFound = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Quay lại trang trước đó
    };

    const handleGoBackHomePage = () => {
        window.location.href = "/"; // Quay lại trang trước đó
    };

    return (
        <>
            <main className="grid h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="font-semibold text-4xl text-indigo-600">404</p>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Không tìm thấy trang
                    </h1>
                    <p className="mt-6 text-base leading-7 text-gray-600">
                        Rất tiếc, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        {/* Nút quay lại trang trước */}
                        <button
                            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={handleGoBack}
                        >
                            Quay trở lại
                        </button>

                        <Link to="#" className="text-sm font-semibold text-gray-900">
                            Liên hệ hỗ trợ <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                    <div className={"mt-5"}>
                        <button
                            className="w-60 rounded-md bg-gray-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={handleGoBackHomePage}
                        >
                            Quay trở lại trang chủ
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
};

export default PageNotFound;
