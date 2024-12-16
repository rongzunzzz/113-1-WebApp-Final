import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTest } from '../context/TestContext';
import { useAuth } from '../context/AuthContext';
import { TestSection } from '../components/TestSection';
import { Trash2, FileText } from 'lucide-react';

export default function Tests() {
  const { user } = useAuth();
  const { deleteTest, displayedTests, setDisplayedTests } = useTest();
  const [myTests, setMyTests] = useState([]);
  const [othersTests, setOtherTests] = useState([]);

  const handleDelete = async (testId, testTitle) => {
    if (window.confirm(`確定要刪除「${testTitle}」這個測驗嗎？`)) {
      await deleteTest(testId);
    }
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const { data: { success, message, allTests } } = await axios.get('/api/getAllTests/');
        if (success) {
          console.log(message);
          setDisplayedTests(allTests);
          setMyTests(allTests.filter((test) => test.userId === user.userId));
          setOtherTests(allTests.filter((test) => test.userId !== user.userId));
        }
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };

    fetchTests();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4 border-b pb-4">
          <FileText className="w-10 h-10 text-blue-500" />
          <h1 className="text-3xl font-extrabold text-gray-800">可用測驗</h1>
        </div>

        {/* My Tests Section */}
        <TestSection
          title="我的測驗"
          tests={myTests}
          isOwner={true}
          onDelete={handleDelete}
          emptyMessage="你還沒有建立任何測驗"
          renderCustom={(test) => (
            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between hover:bg-gray-100 transition-colors duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.02]">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{test.title}</h2>
                <p className="text-sm text-gray-600">
                  建立日期: {new Date(test.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(test.id, test.title)}
                className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-full transition-colors duration-300"
                aria-label="刪除測驗"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        />

        {/* Other Tests Section */}
        <TestSection
          title="其他測驗"
          tests={othersTests}
          isOwner={false}
          onDelete={handleDelete}
          emptyMessage="目前沒有其他人的測驗"
          renderCustom={(test) => (
            <div className="bg-gray-50 rounded-xl p-4 flex items-center hover:bg-gray-100 transition-colors duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.02]">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{test.title}</h2>
                <p className="text-sm text-gray-600">作者: {test.userName}</p>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}