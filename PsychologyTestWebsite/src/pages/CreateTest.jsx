import { useState } from 'react';
import { useTest } from '../context/TestContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Minus, Save, Image as ImageIcon } from 'lucide-react';

export default function CreateTest() {
  const { addTest } = useTest();
  const [currentTest, setCurrentTest] = useState({ 
    title: '', 
    questions: [],
    backgroundImage: ''
  });
  const [newQuestion, setNewQuestion] = useState({ 
    question: '', 
    options: ['', '']
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentTest({
          ...currentTest,
          backgroundImage: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBackgroundImage = () => {
    setCurrentTest({
      ...currentTest,
      backgroundImage: ''
    });
  };

  const addOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, '']
    });
  };

  const removeOption = (indexToRemove) => {
    if (newQuestion.options.length <= 2) {
      alert('至少需要兩個選項！');
      return;
    }
    setNewQuestion({
      ...newQuestion,
      options: newQuestion.options.filter((_, index) => index !== indexToRemove)
    });
  };

  const addQuestion = () => {
    if (newQuestion.question && newQuestion.options.every(opt => opt !== '')) {
      setCurrentTest({
        ...currentTest,
        questions: [...currentTest.questions, { ...newQuestion }]
      });
      setNewQuestion({
        question: '',
        options: ['', '']
      });
    } else {
      alert('請填寫問題和所有選項！');
    }
  };

  const saveTest = () => {
    // 檢查當前是否有未保存的問題
    const hasUnfinishedQuestion = newQuestion.question && 
      newQuestion.options.every(opt => opt !== '');

    // 如果有未保存的問題，先添加到 currentTest
    if (hasUnfinishedQuestion) {
      setCurrentTest(prev => ({
        ...prev,
        questions: [...prev.questions, { ...newQuestion }]
      }));
    }

    // 檢查測驗是否有標題和問題
    if (!currentTest.title) {
      alert('請填寫測驗標題！');
      return;
    }

    // 檢查是否有問題（包括剛剛添加的未保存問題）
    const finalQuestions = hasUnfinishedQuestion 
      ? [...currentTest.questions, { ...newQuestion }]
      : currentTest.questions;

    if (finalQuestions.length === 0) {
      alert('請至少添加一個問題！');
      return;
    }

    // 儲存測驗
    const newTest = {
      id: Date.now(),
      title: currentTest.title,
      questions: finalQuestions,
      backgroundImage: currentTest.backgroundImage
    };

    addTest(newTest);
    
    // 重置表單
    setCurrentTest({ 
      title: '', 
      questions: [],
      backgroundImage: ''
    });
    setNewQuestion({ 
      question: '', 
      options: ['', '']
    });
    
    alert('測驗已儲存！');
  };

  return (
    <div className="space-y-6">
      <div className="bg-custom-primary p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-custom-black mb-4">新增測驗</h2>
        <div className="mb-6 space-y-4">
          <Input
            placeholder="測驗標題"
            value={currentTest.title}
            onChange={(e) => setCurrentTest({...currentTest, title: e.target.value})}
          />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-center">
              {currentTest.backgroundImage ? (
                <div className="relative w-full">
                  <img 
                    src={currentTest.backgroundImage} 
                    alt="背景預覽" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    onClick={removeBackgroundImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white"
                    size="sm"
                  >
                    移除圖片
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-700">上傳背景圖片</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      支援 PNG, JPG, GIF 格式
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {currentTest.questions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">已新增的問題：</h3>
            <div className="space-y-4">
              {currentTest.questions.map((q, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-black">
                  <div className="flex justify-between items-start">
                    <p className="font-medium">{`${idx + 1}. ${q.question}`}</p>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {q.options.map((opt, optIdx) => (
                      <li key={optIdx} className="text-gray-600">
                        {`${String.fromCharCode(65 + optIdx)}. ${opt}`}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4 text-custom-black">新增問題</h3>
          <div className="space-y-4">
            <Input
              placeholder="問題"
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
            />
            
            <div className="space-y-2">
              {newQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder={`選項 ${index + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...newQuestion.options];
                      newOptions[index] = e.target.value;
                      setNewQuestion({...newQuestion, options: newOptions});
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={newQuestion.options.length <= 2}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-custom-black rounded-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                新增選項
              </Button>
            </div>

            <div className="mt-4 space-x-4">
              <Button 
                onClick={addQuestion}
                className="bg-gray-200 hover:bg-gray-300 text-custom-black rounded-full inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                新增問題
              </Button>
              <Button 
                onClick={saveTest}
                className="bg-custom-secondary hover:bg-black hover:text-white rounded-full inline-flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                儲存測驗
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 