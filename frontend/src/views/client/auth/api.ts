const API_URL = 'http://localhost:8080/api/v1';

export const loginApi = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
};

export const getUserDetail = async (token: string): Promise<User> => {
  const response = await fetch(`${API_URL}/users/details`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get user details');
  }

  return response.json();
};


export const registerApi = async (role_id: number, password: string, username: string): Promise<any> => {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role_id, password, username }),
    });
  
    if (!response.ok) {
      throw new Error('Registration failed');
    }
  
    return response.json();
  };
  