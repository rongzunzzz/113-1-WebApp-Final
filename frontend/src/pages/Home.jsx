import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTest } from '../context/TestContext';
import { Button } from '../components/ui/button';
import { ArrowRight, User, List, ClipboardList } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const { savedTests } = useTest();

  const recentTests = savedTests.slice(-4);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-gray-800 leading-snug">
          歡迎使用心理測驗系統
        </h1>
        <p className="text-lg text-gray-500">
          探索有趣的心理測驗，了解更多關於自己的特質
        </p>
        <Link to="/tests">
          <Button className="bg-gray-800 text-white hover:bg-gray-900 text-lg px-8 py-4 rounded-full shadow-md">
            立即開始測驗
          </Button>
        </Link>
      </section>

      {/* 功能卡片區 */}
      <section className="grid md:grid-cols-2 gap-8">
        {user && (
          <Link
            to="/create"
            className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-2"
          >
            <div className="flex items-center space-x-3 mb-4">
              <ClipboardList className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-700">建立測驗</h2>
            </div>
            <p className="text-gray-500 leading-relaxed">
              創建您自己的心理測驗，設計問題和選項，分享給其他使用者。
            </p>
          </Link>
        )}

        <Link
          to="/tests"
          className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-2"
        >
          <div className="flex items-center space-x-3 mb-4">
            <List className="w-6 h-6 text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-700">參與測驗</h2>
          </div>
          <p className="text-gray-500 leading-relaxed">
            瀏覽並參與其他使用者創建的心理測驗。
          </p>
        </Link>

        {user && (
          <Link
            to="/results"
            className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-2"
          >
            <div className="flex items-center space-x-3 mb-4">
              <User className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-700">測驗結果</h2>
            </div>
            <p className="text-gray-500 leading-relaxed">
              查看您過去參與的測驗結果和歷史記錄。
            </p>
          </Link>
        )}

        {user && (
          <div className="bg-gray-100 p-8 rounded-2xl shadow-inner text-gray-700 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">歡迎回來</h2>
            <p>{user.username}，很高興再次見到您！</p>
          </div>
        )}
      </section>

      {/* 熱門測驗區 */}
      {savedTests.length > 0 && (
        <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-700">熱門測驗</h2>
            <Link
              to="/tests"
              className="text-gray-500 hover:text-gray-700 flex items-center space-x-1"
            >
              <span>查看全部</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {recentTests.map((test) => (
              <Link
                key={test.id}
                to={`/test/${test.id}`}
                className="group relative bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-2"
              >
                {test.backgroundImage && (
                  <div
                    className="absolute inset-0 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                    style={{
                      backgroundImage: `url(${test.backgroundImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                )}
                <div className="relative">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2 group-hover:text-gray-900 transition-colors">
                    {test.title}
                  </h3>
                  <p className="text-gray-500">{test.questions.length} 個問題</p>
                  <Button className="mt-4 w-full bg-gray-800 text-white hover:bg-gray-900 rounded-full">
                    開始測驗
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}