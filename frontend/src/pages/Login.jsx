import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (formData.email === 'test@example.com' && formData.password === 'password') {
        login({
          email: formData.email,
          name: '測試用戶'
        });
        navigate('/');
      } else {
        setError('電子郵件或密碼錯誤');
      }
    } catch (err) {
      setError('登入時發生錯誤');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-start justify-center pt-20 bg-custom-primary">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-center mb-8">登入系統</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              電子郵件
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          測試帳號：test@example.com<br />
          測試密碼：password
        </p>
      </div>
    </div>
  );
} 