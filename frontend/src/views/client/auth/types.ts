interface User {
    id: number;
    username: string;
    roles: string[];
    role: Role
  }


  interface Role {
      code: string,
      name: string
  }
  
  interface LoginResponse {
    data: {
      tokenType: string;
      id: number;
      username: string;
      roles: string[];
      message: string;
      token: string;
      refresh_token: string;
    }
  }
  