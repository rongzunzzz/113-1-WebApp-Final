import { useLocation, useNavigate } from 'react-router-dom';
import { useTest } from '../context/TestContext';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export default function TestResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { getTest } = useTest();
  
  if (!state) {
    navigate('/tests');
    return null;
  }

  const { testId, resultIndex, answers } = state;
  
  console.log(testId)
  console.log(answers)
  const { success, test } = getTest(testId);
  
  if (!success) {
    navigate('/tests');
    return null;
  }
  console.log(test);
  const result = test.results[resultIndex];
  console.log(result);


  return (
    <div className="max-w-2xl mx-auto p-6">
      {test.backgroundImage && (
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url(${test.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15
          }}
        />
      )}
      
      <div className="relative z-10 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold mb-4">{test.title}</h1>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">您的測驗結果：</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            {result.imageUrl && (
              <div className="mb-4">
                <img
                  src={result.imageUrl}
                  alt={result.title}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
            <h3 className="text-lg font-medium mb-2">{result.title}</h3>
            <p className="text-gray-700">{result.description}</p>
          </div>
        </div>

        <div className="mb-8">
          <Button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('測驗連結已複製到剪貼簿！');
            }}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 mb-4"
          >
            分享測驗
          </Button>
        </div>

        <div className="mt-8 space-y-4">
          <Link to="/tests">
            <Button className="w-full bg-custom-secondary hover:bg-black hover:text-white">
              返回測驗列表
            </Button>
          </Link>
          <Link to={`/test/${testId}`}>
            <Button className="w-full bg-gray-200 hover:bg-gray-300 text-custom-black">
              重新測驗
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 