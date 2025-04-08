// Create an instance using the config defaults provided by the library

import Axios from "axios";

// At this point the timeout config value is `0` as is the default for the library
const instance = Axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    timeout: 30000,
    headers: {}
  });
// ok
// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Lấy giá trị token từ localStorage
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    if (accessToken) {
        try {
            // Gán token vào headers nếu có
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        } catch (error) {
            console.error("Failed to parse token:", error);
        }
    }

    return config;
}, function (error) {
    // Xử lý lỗi xảy ra trước khi request được gửi
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

export default instance;