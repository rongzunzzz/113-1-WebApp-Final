import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import CreateTest from './pages/CreateTest';
import TakeTest from './pages/TakeTest';
import TestResults from './pages/TestResults';

const PsychologyTestApp = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [currentTest, setCurrentTest] = useState({ title: '', questions: [] });
  const [newQuestion, setNewQuestion] = useState({ question: '', options: ['', ''] });
  const [savedTests, setSavedTests] = useState([]);
  const [currentTakingTest, setCurrentTakingTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [testResults, setTestResults] = useState([]);
  const [showHeaderFooter, setShowHeaderFooter] = useState(true);

  // 新增問題
  const addQuestion = () => {
    if (newQuestion.question && newQuestion.options.every(opt => opt !== '')) {
      setCurrentTest({
        ...currentTest,
        questions: [...currentTest.questions, { ...newQuestion }]
      });
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      });
    }
  };

  // 儲存測驗
  const saveTest = () => {
    if (currentTest.title && currentTest.questions.length > 0) {
      const newTest = {
        id: Date.now(),
        ...currentTest
      };
      setSavedTests([...savedTests, newTest]);
      setCurrentTest({ title: '', questions: [] });
      alert('測驗已儲存！');
    } else {
      alert('請填寫測驗標題和至少一個問題！');
    }
  };

  // 開始執行測驗
  const startTest = (test) => {
    setCurrentTakingTest(test);
    setAnswers({});
    setShowHeaderFooter(false);
  };

  // 提交答案
  const submitTest = () => {
    if (!currentTakingTest) return;
    
    const result = {
      testId: currentTakingTest.id,
      testTitle: currentTakingTest.title,
      answers: answers,
      date: new Date().toLocaleString()
    };
    
    setTestResults([...testResults, result]);
    setCurrentTakingTest(null);
    setAnswers({});
    setShowHeaderFooter(true);
    alert('測驗已完成！');
  };

  return (
    <Router>
      <div className="min-h-screen bg-custom-primary">
        {/* 導航欄 */}
        <nav className="bg-custom-primary shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900">心理測驗系統</span>
              </div>
              <div className="flex items-center space-x-2">
                <NavLink to="/">製作測驗</NavLink>
                <NavLink to="/take">執行測驗</NavLink>
                <NavLink to="/results">測驗結果</NavLink>
              </div>
            </div>
          </div>
        </nav>

        {/* 主要內容區 */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-custom-primary rounded-2xl shadow-lg border border-black">
            <div className="p-6">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <CreateTest 
                      currentTest={currentTest}
                      setCurrentTest={setCurrentTest}
                      newQuestion={newQuestion}
                      setNewQuestion={setNewQuestion}
                      addQuestion={addQuestion}
                      saveTest={saveTest}
                    />
                  } 
                />
                <Route 
                  path="/take" 
                  element={
                    <TakeTest 
                      savedTests={savedTests}
                      currentTakingTest={currentTakingTest}
                      answers={answers}
                      setAnswers={setAnswers}
                      startTest={startTest}
                      submitTest={submitTest}
                    />
                  } 
                />
                <Route 
                  path="/results" 
                  element={
                    <TestResults 
                      testResults={testResults}
                      savedTests={savedTests}
                    />
                  } 
                />
              </Routes>
            </div>
          </div>
        </main>

        {/* 頁腳 */}
        {showHeaderFooter && (
          <footer className="bg-custom-primary border-t border-gray-100 mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <p className="text-center text-custom-black">© 2024 心理測驗系統. All rights reserved.</p>
            </div>
          </footer>
        )}
      </div>
    </Router>
  );
};

// 自定義導航鏈接組件
function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`px-4 py-2 rounded-full transition-all duration-200 ${
        isActive 
          ? 'bg-black text-white font-medium'
          : 'text-gray-600 hover:text-gray-900 hover:bg-black hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

export default PsychologyTestApp;
