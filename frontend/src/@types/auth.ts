// export type SignInCredential = {
//     userName: string
//     password: string
// }

// export type SignInResponse = {
//     status: string
//     token: string
//     user: {
//         userName: string
//         authority: string[]
//         avatar: string
//         email: string
//     }
// }

// export type SignUpResponse = SignInResponse

// export type SignUpCredential = {
//     userName: string
//     email: string
//     password: string
// }

// export type ForgotPassword = {
//     email: string
// }

// export type ResetPassword = {
//     password: string
// }

export type SignInCredential = {
    email: string;
    password: string;
};

export type SignInResponse = {
    status: string; // Trạng thái phản hồi từ backend
    message: string; // Thông báo từ phản hồi
    data: {
        tokenType: string; // Loại token, ví dụ "Bearer"
        token: string; // Token xác thực
        refreshToken: string; // Token làm mới
        id: number; // ID người dùng
        username: string; // Tên đăng nhập
        roles: string[]; // Danh sách các quyền
        avatar?: string; // Avatar, có thể để tùy chọn nếu không phải lúc nào cũng có
        email: string; // Email người dùng
    };
};

export type SignUpCredential = {
    userName: string;
    email: string;
    password: string;
};

export type SignUpResponse = SignInResponse;

export type ForgotPassword = {
    email: string;
};

export type ResetPassword = {
    password: string;
};
