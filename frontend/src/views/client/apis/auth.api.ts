import { AuthRespon } from "../types/auth.type";
import http from "../utils/http";


const authApi = {
  registerAccount: (body: { email: string; password: string }) => {
    return http.post<AuthRespon>('/register', body);
  },
  loginAccount: (body: { email: string; password: string }) => {
    return http.post<AuthRespon>('/login', body);
  },
  logout: () => {
    return http.post('/logout');
  }
};

export default authApi;
