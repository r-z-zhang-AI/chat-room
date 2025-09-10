import { User } from '@/types/common';

export const auth = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setAuth: (token: string, user: User) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  clearAuth: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isLoggedIn: (): boolean => {
    return !!auth.getToken();
  }
};

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = auth.getToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  return response.json();
};
