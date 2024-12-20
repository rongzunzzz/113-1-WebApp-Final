import axios from 'axios';
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

  const [displayedTests, setDisplayedTests] = useState([]);
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
      setDisplayedTests(prev => prev.filter(test => test.testId !== testId));
      setDisplayedResults(prev => prev.filter(result => result.testId !== testId));  // 同時刪除相關的測驗結果
    } 
  };

  // 添加刪除測驗結果函數
  const deleteResult = async (resultIndex) => {
    const {
      data: { success, message }
    } = await axios.delete('/api/deleteResult/', {
      data: {
        resultId: resultIndex,
      }
    })
    console.log(message);

    if (success) {
      setDisplayedResults(prev => prev.filter(result => result.resultId !== resultIndex));
    }
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
    try {
      const {
        data: { success, message, testId }
      } = await axios.post('/api/saveTest/', {
        userId: newTest.userId,
        title: newTest.title,
        questions: newTest.questions,
        results: newTest.results,
        backgroundImage: newTest.backgroundImage,
      })

      if (success) {
        console.log(message + `test uuid: ${testId}`);
      }
    } catch (error) {
      console.error('Error in addTest:', error);
      throw error;
    }
  };

  const addResult = (newResult) => {
    setTestResults(prev => [...prev, newResult]);
  };

  // 新增取得特定測驗的函數
  const getTest = async (testId) => {
    const {
      data: { success, test }
    } = await axios.get('/api/getTestById/', {
      params: {
        testId: testId,
      }
    });
    
    const result = success? test : null;
    return { "success": success, "test": result };
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
      displayedTests, setDisplayedTests,

      testResults,

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