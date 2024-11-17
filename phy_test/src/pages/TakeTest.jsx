import { useState } from 'react';
import { useTest } from '../context/TestContext';
import { Button } from '../components/ui/button';
import { ChevronLeft, ChevronRight, Check, Trash2 } from 'lucide-react';

export default function TakeTest() {
  const { savedTests, addResult, deleteTest } = useTest();
  const [currentTakingTest, setCurrentTakingTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const startTest = (test) => {
    setCurrentTakingTest(test);
    setAnswers({});
    setCurrentQuestionIndex(0);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < currentTakingTest.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitTest = () => {
    if (!currentTakingTest) return;
    
    if (Object.keys(answers).length !== currentTakingTest.questions.length) {
      alert('請回答所有問題！');
      return;
    }

    const result = {
      testId: currentTakingTest.id,
      testTitle: currentTakingTest.title,
      answers: answers,
      date: new Date().toLocaleString()
    };
    
    addResult(result);
    setCurrentTakingTest(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
    alert('測驗已完成！');
  };

  if (!currentTakingTest) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">選擇測驗</h2>
        {savedTests.length > 0 ? (
          <div className="space-y-4">
            {savedTests.map((test) => (
              <div key={test.id} 
                className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 group"
              >
                <span className="font-medium">{test.title}</span>
                <div className="flex items-center space-x-2">
                  <Button 
                    onClick={() => startTest(test)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    開始測驗
                  </Button>
                  <Button
                    onClick={() => deleteTest(test.id)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    variant="ghost"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">目前沒有可用的測驗</p>
        )}
      </div>
    );
  }

  const currentQuestion = currentTakingTest.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === currentTakingTest.questions.length - 1;

  return (
    <div className="min-h-[60vh] flex flex-col">
      {currentTakingTest?.backgroundImage && (
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url(${currentTakingTest.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15
          }}
        />
      )}
      
      <div className="relative z-10">
        <div className="mb-6 flex justify-between items-center">
          <span className="text-lg font-medium text-gray-700">
            問題 {currentQuestionIndex + 1} / {currentTakingTest.questions.length}
          </span>
          <div className="flex gap-2">
            {currentTakingTest.questions.map((_, idx) => (
              <div 
                key={idx}
                className={`w-3 h-3 rounded-full transition-all ${
                  answers[idx] !== undefined 
                    ? 'bg-green-500' 
                    : idx === currentQuestionIndex 
                      ? 'bg-blue-500' 
                      : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">
            {currentQuestion.question}
          </h2>
          
          <div className="space-y-4">
            {currentQuestion.options.map((option, oIndex) => (
              <label 
                key={oIndex} 
                className={`block p-4 rounded-xl border-2 transition-all cursor-pointer
                  ${answers[currentQuestionIndex] === oIndex 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-100 hover:bg-gray-50 hover:border-gray-200'}`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={oIndex}
                    checked={answers[currentQuestionIndex] === oIndex}
                    onChange={() => {
                      setAnswers({
                        ...answers,
                        [currentQuestionIndex]: oIndex
                      });
                    }}
                    className="hidden"
                  />
                  <span className="text-lg text-gray-700">{option}</span>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <Button 
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
              onClick={isLastQuestion ? submitTest : goToNextQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLastQuestion ? '提交測驗' : '下一題'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 