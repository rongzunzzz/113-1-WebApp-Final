import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTest } from '../context/TestContext';
import { useAuth } from '../context/AuthContext';
import { TestSection } from '../components/TestSection';

export default function Tests() {
  const { deleteTest } = useTest();

  const { user } = useAuth();
  const [displayedTests, setDisplayedTests] = useState([]);

  const handleDelete = async (testId, testTitle) => {
    if (window.confirm(`確定要刪除「${testTitle}」這個測驗嗎？`)) {
      const success = await deleteTest(testId);
      if (success) {
        setDisplayedTests(prevTests => 
          prevTests.filter(test => String(test.id) !== String(testId))
        );
      }
    }
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const { data: { success, message, allTests } } = await axios.get('/api/getAllTests/');
        if (success) {
          console.log('Tests fetched successfully:', message);
          setDisplayedTests(allTests);
        }
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };

    fetchTests();
  }, []);

  const myTests = displayedTests.filter(test => test.userId === user.userId);
  const othersTests = displayedTests.filter(test => test.userId !== user.userId);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">可用測驗</h1>
      
      <TestSection
        title="我的測驗"
        tests={myTests}
        isOwner={true}
        onDelete={handleDelete}
        emptyMessage="你還沒有建立任何測驗"
      />

      <TestSection
        title="其他測驗"
        tests={othersTests}
        isOwner={false}
        onDelete={handleDelete}
        emptyMessage="目前沒有其他人的測驗"
      />
    </div>
  );
}
