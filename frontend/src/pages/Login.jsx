import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import axios from 'axios';
import { Coins } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' 或 'register'
  const [error, setError] = useState('');
  
  const [loginData, setLoginData] = useState({
    account: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    username: '',
    account: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const {
        data: { success, message, user }
      } = await axios.get('api/login/', {
        params: {
          account: loginData.account,
          password: loginData.password,
        }
    })
      if ((success || loginData.account === 'test@example.com' && loginData.password === 'password')) {
        console.log(message)
        console.log(user.user_id)
        await login({
          userId: user.user_id,
          account: loginData.account,
          username: user.username,
        });
        navigate('/');
      } else {
        setError('電子郵件或密碼錯誤');
      }
    } catch (err) {
      setError('登入時發生錯誤');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('密碼不一致');
      return;
    }

    try {
      await register(registerData.username, registerData.account, registerData.password);
      navigate('/');
    } catch (err) {
      setError(err.message || '註冊失敗');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-start justify-center pt-20 bg-custom-primary">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
        {/* Tab 切換按鈕 */}
        <div className="flex mb-8 border-b">
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === 'login'
                ? 'border-b-2 border-custom-secondary font-semibold'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('login')}
          >
            登入
          </button>
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === 'register'
                ? 'border-b-2 border-custom-secondary font-semibold'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('register')}
          >
            註冊
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* 登入表單 */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                電子郵件
              </label>
              <Input
                type="account"
                value={loginData.account}
                onChange={(e) => setLoginData({ ...loginData, account: e.target.value })}
                required
                className="w-full"
                placeholder="請輸入電子郵件"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密碼
              </label>
              <Input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
                className="w-full"
                placeholder="請輸入密碼"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-custom-secondary hover:bg-black hover:text-white transition-colors py-2 mt-4"
            >
              登入
            </Button>

            <p className="mt-6 text-center text-sm text-gray-600">
              測試帳號：test@example.com<br />
              測試密碼：password
            </p>
          </form>
        )}

        {/* 註冊表單 */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                名稱
              </label>
              <Input
                type="text"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                required
                className="w-full"
                placeholder="請輸入名稱"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                電子郵件
              </label>
              <Input
                type="account"
                value={registerData.account}
                onChange={(e) => setRegisterData({ ...registerData, account: e.target.value })}
                required
                className="w-full"
                placeholder="請輸入電子郵件"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密碼
              </label>
              <Input
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                required
                className="w-full"
                placeholder="請輸入密碼"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                確認密碼
              </label>
              <Input
                type="password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                required
                className="w-full"
                placeholder="請再次輸入密碼"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-custom-secondary hover:bg-black hover:text-white transition-colors py-2 mt-4"
            >
              註冊
            </Button>
          </form>
        )}
      </div>
    </div>
  );
} 