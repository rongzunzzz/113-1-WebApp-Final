import { Link } from 'react-router-dom';
import { useTest } from '../context/TestContext';
import { Button } from '../components/ui/button';
import { Trash2 } from 'lucide-react';

export default function Mytests() {
  const { savedTests, deleteTest } = useTest();

  const handleDelete = (testId, testTitle) => {
    if (window.confirm(`確定要刪除「${testTitle}」這個測驗嗎？`)) {
      deleteTest(testId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">我的測驗</h1>
      
      {savedTests.length > 0 ? (
        <div className="space-y-4">
          {savedTests.map((test) => (
            <div 
              key={test.id} 
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{test.title}</h2>
                  <p className="text-gray-600">
                    共 {test.questions.length} 個問題
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Link to={`/test/${test.id}`}>
                    <Button className="bg-custom-secondary hover:bg-black hover:text-white">
                      編輯測驗
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => handleDelete(test.id, test.title)}
                    className="bg-white text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">目前沒有可用的測驗</p>
        </div>
      )}
    </div>
  );
} 