import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';

export function Navbar() {
  const { user, logout } = useAuth();

  const navLinkStyle = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm transition-all duration-200 hover:font-bold hover:scale-110 ${
      isActive 
        ? 'font-bold text-black' 
        : 'text-gray-700'
    }`;

  return (
    <nav className="bg-custom-primary shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
              Moniclassroom
            </Link>

            {/* 導航連結 */}
            <div className="hidden md:flex space-x-4">
              <NavLink 
                to="/tests" 
                className={navLinkStyle}
              >
                參與測驗
              </NavLink>

              {user && (
                <>
                  <NavLink 
                    to="/create" 
                    className={navLinkStyle}
                  >
                    建立測驗
                  </NavLink>
                  <NavLink 
                    to="/results" 
                    className={navLinkStyle}
                  >
                    測驗結果
                  </NavLink>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700">{user.name}</span>
                <Button
                  onClick={logout}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  登出
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button className="bg-custom-secondary hover:bg-black hover:text-white">
                  登入/註冊
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 