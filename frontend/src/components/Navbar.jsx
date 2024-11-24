import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from './ui/button';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-custom-primary shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
            >
              心理測驗系統
            </Link>
            
            {user && (
              <div className="hidden md:flex space-x-4">
                <Link 
                  to="/create" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  建立測驗
                </Link>
                <Link 
                  to="/take" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  參與測驗
                </Link>
                <Link 
                  to="/results" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  測驗結果
                </Link>
              </div>
            )}
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {user.name}
              </span>
              <Button
                onClick={handleLogout}
                className="bg-gray-200 hover:bg-gray-300 text-custom-black rounded-full px-4 py-2"
              >
                登出
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 