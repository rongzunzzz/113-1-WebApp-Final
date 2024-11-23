import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">歡迎使用心理測驗系統</h1>
      
      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <Link 
          to="/create"
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
        >
          <h2 className="text-2xl font-semibold mb-4">建立測驗</h2>
          <p className="text-gray-600">
            創建您自己的心理測驗，設計問題和選項，分享給其他使用者。
          </p>
        </Link>

        <Link 
          to="/take"
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
        >
          <h2 className="text-2xl font-semibold mb-4">參與測驗</h2>
          <p className="text-gray-600">
            瀏覽並參與其他使用者創建的心理測驗。
          </p>
        </Link>

        <Link 
          to="/results"
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
        >
          <h2 className="text-2xl font-semibold mb-4">測驗結果</h2>
          <p className="text-gray-600">
            查看您過去參與的測驗結果和歷史記錄。
          </p>
        </Link>

        {user && (
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">歡迎回來</h2>
            <p className="text-gray-600">
              {user.name}，很高興再次見到您！
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 