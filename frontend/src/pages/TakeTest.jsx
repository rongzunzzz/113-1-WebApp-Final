import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTest } from '../context/TestContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

export default function TakeTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTest, addResult } = useTest();
  const { user } = useAuth();
  const [currentTest, setCurrentTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    console.log('Loading test with ID:', id);
    const getStartTest = async () => {
       const { success, test } = await getTest(id);
       console.log('Loaded test:', test);
       if (!success) {
         navigate('/tests');
         return;
       }
       setCurrentTest(test);
    }

    getStartTest();    
    
    // const {
    //   data: { success, test }
    // } = await axios.get('/api/getTestById/', {
    //   params: {
    //     testId: id,
    //   }
    // });
    
  }, [id, navigate, getTest]);

  if (!currentTest) {
    return <div>載入中...</div>;
  }

  console.log('Current question index:', currentQuestionIndex);
  console.log('Current test questions:', currentTest.questions);
  const currentQuestion = currentTest.questions[currentQuestionIndex];
  console.log('Current question:', currentQuestion);

  if (!currentQuestion) {
    console.error('No question found at index:', currentQuestionIndex);
    return <div>找不到問題</div>;
  }

  const isLastQuestion = currentQuestionIndex === currentTest.questions.length - 1;

  const handleAnswerSelect = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const saveTestResult = async (result) => {
    console.log(result);
    const {
      data: { success, message }
    } = await axios.post('/api/saveTestResult/', {
      testId: result.testId,
      userId: user.userId,
      answers: result.answers,
      resultIndex: result.resultIndex,
    });
    console.log(message);
  };

  const submitTest = async () => {
    console.log('submitTest')
    if (Object.keys(answers).length !== currentTest.questions.length) {
      alert('請回答所有問題！');
      return;
    }

    console.log("currenetTest:...")
    console.log(currentTest)

    const result = {
      testId: currentTest.testId,
      testTitle: currentTest.title,
      answers: answers,
      resultIndex: calculateFinalResult(),
      date: new Date().toISOString()
    };
    
    await saveTestResult(result);

    await addResult(result);
    
    navigate(`/test/${currentTest.testId}/result`, { 
      state: { 
        testId: currentTest.testId,
        resultIndex: result.resultIndex,
        answers: answers
      } 
    });
  };

  const calculateFinalResult = () => {
    const resultCounts = {};
    Object.entries(answers).forEach(([questionIndex, optionIndex]) => {
      const resultIndex = currentTest.questions[questionIndex].optionResults[optionIndex];
      resultCounts[resultIndex] = (resultCounts[resultIndex] || 0) + 1;
    });

    let maxCount = 0;
    let finalResultIndex = 0;
    Object.entries(resultCounts).forEach(([index, count]) => {
      if (count > maxCount) {
        maxCount = count;
        finalResultIndex = parseInt(index);
      }
    });

    return finalResultIndex;
  };

  return (
    <div className="min-h-[60vh] flex flex-col max-w-4xl mx-auto">
      {currentTest.backgroundImage && (
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url(${currentTest.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15
          }}
        />
      )}
      
      <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg">
        {/* 進度指示器 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">{currentTest.title}</h2>
            <span className="text-sm text-gray-600">
              問題 {currentQuestionIndex + 1} / {currentTest.questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-custom-secondary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / currentTest.questions.length) * 100}%`
              }}
            />
          </div>
        </div>
        
        {/* 問題和選項 */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200
                  ${answers[currentQuestionIndex] === index 
                    ? 'border-black bg-gray-100' 
                    : 'border-gray-200 hover:border-gray-400'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        
        {/* 導航按鈕 */}
        <div className="flex justify-between mt-6">
          <Button 
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            上一題
          </Button>
          <Button 
            onClick={isLastQuestion ? submitTest : goToNextQuestion}
            disabled={answers[currentQuestionIndex] === undefined}
            className="bg-custom-secondary hover:bg-black hover:text-white"
          >
            {isLastQuestion ? '提交測驗' : '下一題'}
            {!isLastQuestion && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
} 