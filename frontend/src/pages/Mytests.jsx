import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTest } from '../context/TestContext';
import { useAuth } from '../context/AuthContext';
import { TestSection } from '../components/TestSection';

export default function MyTests() {
  const { user } = useAuth();
  const { deleteTest, displayedTests, setDisplayedTests } = useTest();
  const [isLoading, setIsLoading] = useState(true);

  const handleDelete = async (testId, testTitle) => {
    if (window.confirm(`確定要刪除「${testTitle}」這個測驗嗎？`)) {
      try {
        await deleteTest(testId);
        setDisplayedTests(prevTests => prevTests.filter(test => test.id !== testId));
      } catch (error) {
        console.error('Error deleting test:', error);
      }
    }
  };

  useEffect(() => {
    const fetchTests = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/getAllTests/');
        const { success, message, allTests } = response.data;
        if (success) {
          console.log(message);
          const uniqueTests = Array.from(new Map(allTests.map(test => [test.id, test])).values());
          setDisplayedTests(uniqueTests);
        }
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, [setDisplayedTests]);

  const myTests = displayedTests.filter(test => test.userId === user.userId);

  console.log('Displayed Tests:', displayedTests);

  return (
    <div className="max-w-4xl mx-auto">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg font-semibold">Loading...</p>
          <div className="mt-4 border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      ) : (
        <TestSection
          title="我的測驗"
          tests={myTests}
          isOwner={true}
          onDelete={handleDelete}
          emptyMessage="你還沒有建立任何測驗"
        />
      )}
    </div>
  );
}
