import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (username, account, password) => {
    try {
      const {
        data: { success, message },
      } = await axios.post('api/signup/', {
        username,
        account,
        password,
    }); 
    /* 
    testsignupname
    testsignup@gmail.com
    testsignup
    */
      
    if (success) {
        console.log(message);
    }      

    //   setUser(user);
    //   localStorage.setItem('token', token);
      
    //   return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || '註冊失敗');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 