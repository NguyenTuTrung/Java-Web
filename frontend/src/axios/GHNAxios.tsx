import axios from "axios";

const instanceGHN = axios.create({
    baseURL: "https://online-gateway.ghn.vn"
});


instanceGHN.interceptors.request.use(function (config) {
    config.headers.Token = "718f2008-46b7-11ef-b4a4-2ec170e33d11";
    return config;
});

export default instanceGHN;