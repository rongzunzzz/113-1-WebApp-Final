import axios from 'axios';
import { createContext, useState, useContext, useEffect } from 'react';

const TestContext = createContext();

export function TestProvider({ children }) {
  const [savedTests, setSavedTests] = useState(() => {
    const saved = localStorage.getItem('savedTests');
    return saved ? JSON.parse(saved) : [];
  });

  const [displayedUserTests, setDisplayedUserTests] = useState([]);
  const [displayedOthersTests, setDisplayedOthersTests] = useState([]);

  const [testResults, setTestResults] = useState(() => {
    const results = localStorage.getItem('testResults');
    return results ? JSON.parse(results) : [];
  });

  const [displayedResults, setDisplayedResults] = useState([]);

  // 添加刪除測驗函數
  const deleteTest = async (testId) => {
    const {
      data: { success, message }
    } = await axios.post('/api/deleteTest/', {
      testId: testId, 
    })

    console.log(message);

    if (success)  {
      setSavedTests(prev => prev.filter(test => test.testId !== testId));
      // 同時刪除相關的測驗結果
      setTestResults(prev => prev.filter(result => result.testId !== testId));
    } 

    return success;
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

  const addTest = async (newTest) => {
    console.log('Adding test:', newTest);
    try {
      const {
        data: { success, message, test_id }
      } = await axios.post('/api/saveTest/', {
        userId: newTest.userId,
        title: newTest.title,
        questions: newTest.questions,
        results: newTest.results,
        backgroundImage: newTest.backgroundImage,
      })

      if (success) {
        console.log(message + `test uuid: ${test_id}`);
      }


    //   setSavedTests(prev => {
    //     const updated = [...prev, newTest];
    //     console.log('Updated tests:', updated);
    //     return updated;
    //   });
    } catch (error) {
      console.error('Error in addTest:', error);
      throw error;
    }
  };

  const addResult = (newResult) => {
    setTestResults(prev => [...prev, newResult]);
  };

  // 新增取得特定測驗的函數
  const getTest = (testId) => {
    console.log('Getting test:', testId);
    console.log('Available tests:', displayedUserTests);
    const test = displayedUserTests.find(test => test.testId === testId);
    console.log('Found test:', test);
    return test || null;
  };

  // 新增計算測驗結果的函數
  const calculateTestResult = (testId, answers) => {
    const test = getTest(testId);
    if (!test) return null;

    // 計算每個結果出現的次數
    const resultCounts = {};
    Object.entries(answers).forEach(([questionIndex, optionIndex]) => {
      const resultIndex = test.questions[questionIndex].optionResults[optionIndex];
      resultCounts[resultIndex] = (resultCounts[resultIndex] || 0) + 1;
    });

    // 找出最常出現的結果
    let maxCount = 0;
    let finalResultIndex = 0;
    Object.entries(resultCounts).forEach(([index, count]) => {
      if (count > maxCount) {
        maxCount = count;
        finalResultIndex = parseInt(index);
      }
    });

    return {
      resultIndex: finalResultIndex,
      result: test.results[finalResultIndex]
    };
  };

  return (
    <TestContext.Provider value={{
      savedTests,
      testResults,

      displayedUserTests, setDisplayedUserTests,
      displayedOthersTests, setDisplayedOthersTests,

      addTest,
      addResult,
      displayedResults, setDisplayedResults,

      deleteTest,
      deleteResult,
      getTest,
      calculateTestResult
    }}>
      {children}
    </TestContext.Provider>
  );
}

export function useTest() {
  return useContext(TestContext);
} 