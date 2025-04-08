import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserDetail, loginApi, registerApi } from './api';
import useAuth from '@/utils/hooks/useAuth'

interface User {
    username: string;
    customerId: string | null,
}

interface AuthContextType {
    id: number | null;
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    checkAuth: () => Promise<void>;
    logout: () => void;
    login: (email: string, password: string) => Promise<void>;
    register: (role_id: number, password: string, username: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        console.log("OkOk", user)
    }, [user])

    // Kiểm tra người dùng đã đăng nhập chưa
    const checkAuth = async () => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (token) {
            try {
                const userDetail = await getUserDetail(token); // Lấy thông tin người dùng từ API
                console.log(userDetail)
                console.log(userDetail.data.username)
                setUser({
                    id: userDetail?.data?.id || '', // Giá trị mặc định nếu id bị undefined
                    username: userDetail?.data?.username || '', // Giá trị mặc định nếu username bị undefined
                    customerId: userDetail?.data?.customer?.id || '', // Giá trị mặc định nếu username bị undefined
                });
            } catch (err) {
                console.error('Failed to get user details:', err);
                logout();
            }
        }
        setLoading(false);
    };

    // Đăng nhập
    const login = async (email: string, password: string) => {
        try {
            const response = await loginApi(email, password);
            const { token, refresh_token } = response.data;

            // Lưu token và refresh_token vào localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('refresh_token', refresh_token);

            // Sau khi đăng nhập thành công, gọi getUserDetail để lấy thông tin người dùng
            const userDetail = await getUserDetail(token);
            setUser({
                username: userDetail.username,
            });
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    // Đăng ký
    const register = async (role_id: number, password: string, username: string) => {
        try {
            const response = await registerApi(role_id, password, username);
            const { token, refresh_token } = response.data;

            // Lưu token và refresh_token vào localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('refresh_token', refresh_token);

            // Sau khi đăng ký thành công, gọi getUserDetail để lấy thông tin người dùng
            const userDetail = await getUserDetail(token);
            setUser({
                username: userDetail.username
            });
        } catch (err) {
            console.error('Registration failed:', err);
        }
    };

    // Đăng xuất
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            console.log("HAVE TOKEN")
            getUserDetail(token)
                .then(userDetail => {
                    setUser({
                        username: userDetail.username
                    });
                    console.log( "Username", userDetail.username)
                })
                .catch(err => {
                    console.error('Failed to get user details:', err);
                    logout(); // Nếu có lỗi khi lấy thông tin người dùng, đăng xuất
                });
        } else {
            console.log("NO HAVE TOKEN")

            setUser(null);  // Nếu không có token, đảm bảo user là null
        }
        setLoading(false);
    }, []);


    // Kiểm tra trạng thái người dùng khi component được mount
    useEffect(() => {
        checkAuth();
    }, []);  // Thực thi chỉ khi component mount hoặc khi có sự thay đổi token


    return (
        <AuthContext.Provider value={{ user, setUser, loading, checkAuth, logout, login, register }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook tùy chỉnh để sử dụng context
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthProvider;


// toio nghix no o doan nay api login tra ve data kieu khac apiu detail tra api kiueu khac nen no bij hoac o cai dr
// dropdown ben navber