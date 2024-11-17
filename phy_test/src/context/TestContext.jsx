import { createContext, useState, useContext, useEffect } from 'react';

const TestContext = createContext();

export function TestProvider({ children }) {
  const [savedTests, setSavedTests] = useState(() => {
    const saved = localStorage.getItem('savedTests');
    return saved ? JSON.parse(saved) : [];
  });

  const [testResults, setTestResults] = useState(() => {
    const results = localStorage.getItem('testResults');
    return results ? JSON.parse(results) : [];
  });

  // 添加刪除測驗函數
  const deleteTest = (testId) => {
    if (window.confirm('確定要刪除這個測驗嗎？相關的測驗結果也會被刪除。')) {
      setSavedTests(prev => prev.filter(test => test.id !== testId));
      // 同時刪除相關的測驗結果
      setTestResults(prev => prev.filter(result => result.testId !== testId));
    }
  };

  // 添加刪除測驗結果函數
  const deleteResult = (resultIndex) => {
    setTestResults(prev => prev.filter((_, index) => index !== resultIndex));
  };

  // 當測驗數據改變時，保存到 localStorage
  useEffect(() => {
    localStorage.setItem('savedTests', JSON.stringify(savedTests));
  }, [savedTests]);

  // 當測驗結果改變時，保存到 localStorage
  useEffect(() => {
    localStorage.setItem('testResults', JSON.stringify(testResults));
  }, [testResults]);

  const addTest = (newTest) => {
    setSavedTests(prev => [...prev, newTest]);
  };

  const addResult = (newResult) => {
    setTestResults(prev => [...prev, newResult]);
  };

  return (
    <TestContext.Provider value={{
      savedTests,
      testResults,
      addTest,
      addResult,
      deleteTest,    // 導出刪除測驗函數
      deleteResult   // 導出刪除結果函數
    }}>
      {children}
    </TestContext.Provider>
  );
}

export function useTest() {
  return useContext(TestContext);
} 