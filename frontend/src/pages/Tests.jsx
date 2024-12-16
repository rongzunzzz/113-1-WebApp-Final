import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTest } from '../context/TestContext';
import { useAuth } from '../context/AuthContext';
import { TestSection } from '../components/TestSection';

export default function Tests() {
  const { user } = useAuth();
  const { deleteTest, displayedTests, setDisplayedTests } = useTest();
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  const handleDelete = async (testId, testTitle) => {
    if (window.confirm('確定要刪除「${testTitle}」這個測驗嗎？')) {
      try {
        await deleteTest(testId);
        setDisplayedTests(prevTests => prevTests.filter(test => test.id !== testId)); // Update the state after deletion
      } catch (error) {
        console.error('Error deleting test:', error);
      }
    }
  };

  useEffect(() => {
    const fetchTests = async () => {
      setIsLoading(true); // Set loading state to true when fetching starts
      try {
        const response = await axios.get('/api/getAllTests/');
        const { success, message, allTests } = response.data;
        if (success) {
          console.log(message);
          setDisplayedTests(allTests);
        }
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setIsLoading(false); // Set loading state to false when fetching is done
      }
    };

    fetchTests();
  }, [setDisplayedTests]);

  // Separate tests by owner
  const myTests = displayedTests.filter(test => test.userId === user.userId);
  const othersTests = displayedTests.filter(test => test.userId !== user.userId);

  return (
    <div className="max-w-4xl mx-auto">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg font-semibold">Loading...</p>
          {/* Add a spinner or animation */}
          <div className="mt-4 border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      ) : (
        <>
          {/*<TestSection
            title="我的測驗"
            tests={myTests}
            isOwner={true}
            onDelete={handleDelete}
            emptyMessage="你還沒有建立任何測驗"
          />*/}

          <TestSection
            title="熱門測驗"
            tests={othersTests}
            isOwner={false}
            onDelete={handleDelete}
            emptyMessage="目前沒有其他人的測驗"
          />
        </>
      )}
    </div>
  );
}