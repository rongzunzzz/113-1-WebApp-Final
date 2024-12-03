import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTest } from '../context/TestContext';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react'; // 引入箭頭圖標

export default function Home() {
  const { user } = useAuth();
  const { savedTests } = useTest();

  // 只顯示最新的4個測驗
  const recentTests = savedTests.slice(-4);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          歡迎使用心理測驗系統
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          探索有趣的心理測驗，了解更多關於自己的特質
        </p>
        <Link to="/tests">
          <Button className="bg-custom-secondary hover:bg-black hover:text-white text-lg px-8 py-4">
            立即開始測驗
          </Button>
        </Link>
      </div>

      {/* 功能卡片區 */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {user && (
          <Link 
            to="/create"
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-gray-300"
          >
            <h2 className="text-2xl font-semibold mb-4">建立測驗</h2>
            <p className="text-gray-600">
              創建您自己的心理測驗，設計問題和選項，分享給其他使用者。
            </p>
          </Link>
        )}

        <Link 
          to="/tests"
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-gray-300"
        >
          <h2 className="text-2xl font-semibold mb-4">參與測驗</h2>
          <p className="text-gray-600">
            瀏覽並參與其他使用者創建的心理測驗。
          </p>
        </Link>

        {user && (
          <Link 
            to="/results"
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-gray-300"
          >
            <h2 className="text-2xl font-semibold mb-4">測驗結果</h2>
            <p className="text-gray-600">
              查看您過去參與的測驗結果和歷史記錄。
            </p>
          </Link>
        )}

        {user && (
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">歡迎回來</h2>
            <p className="text-gray-600">
              {user.name}，很高興再次見到您！
            </p>
          </div>
        )}
      </div>

      {/* 熱門測驗區 */}
      {savedTests.length > 0 && (
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">熱門測驗</h2>
            <Link 
              to="/tests" 
              className="text-custom-secondary hover:text-black flex items-center"
            >
              查看全部
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {recentTests.map((test) => (
              <Link 
                key={test.id} 
                to={`/test/${test.id}`}
                className="group relative bg-gray-50 p-6 rounded-lg hover:shadow-md transition-all duration-300"
              >
                {test.backgroundImage && (
                  <div 
                    className="absolute inset-0 rounded-lg opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                    style={{
                      backgroundImage: `url(${test.backgroundImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                )}
                <div className="relative">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-custom-secondary transition-colors">
                    {test.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {test.questions.length} 個問題
                  </p>
                  <Button className="w-full bg-custom-secondary hover:bg-black hover:text-white">
                    開始測驗
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 