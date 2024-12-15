import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '../context/TestContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Minus, Save, Image as ImageIcon, ChevronDown, Edit2, Check } from 'lucide-react';

export default function CreateTest() {
  const navigate = useNavigate();
  const { addTest } = useTest();
  const { user } = useAuth();
  const [currentTest, setCurrentTest] = useState({ 
    title: '', 
    questions: [],
    backgroundImage: '',
    results: []
  });
  const [newQuestion, setNewQuestion] = useState({ 
    question: '', 
    options: ['', ''],
    optionResults: [0, 0]
  });
  const [newResult, setNewResult] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [generatingIndex, setGeneratingIndex] = useState(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [editingResultIndex, setEditingResultIndex] = useState(null);

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
    if (!newQuestion.question.trim()) {
      alert('請填寫問題內容！');
      return;
    }

    if (newQuestion.options.some(opt => !opt.trim())) {
      alert('請填寫所有選項！');
      return;
    }

    if (currentTest.results.length === 0) {
      alert('請先新增至少兩個可能的測驗結果！');
      return;
    }

    setCurrentTest(prev => ({
      ...prev,
      questions: [...prev.questions, { ...newQuestion }]
    }));

    // 重置新問題表單
    setNewQuestion({
      question: '',
      options: ['', ''],
      optionResults: [0, 0]
    });
  };

  const editQuestion = (index) => {
    setEditingQuestionIndex(index);
    setNewQuestion(currentTest.questions[index]);
  };

  const saveEditedQuestion = () => {
    setCurrentTest(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) => 
        index === editingQuestionIndex ? { ...newQuestion } : q
      )
    }));
    setEditingQuestionIndex(null);
    setNewQuestion({
      question: '',
      options: ['', ''],
      optionResults: [0, 0]
    });
  };

  const updateOptionResult = (optionIndex, resultIndex) => {
    const newOptionResults = [...newQuestion.optionResults];
    newOptionResults[optionIndex] = resultIndex;
    setNewQuestion({
      ...newQuestion,
      optionResults: newOptionResults
    });
  };

  const saveTest = async () => {
    // 基本驗證
    if (!currentTest.title.trim()) {
      alert('請填寫測驗標題！');
      return;
    }

    if (currentTest.results.length < 2) {
      alert('請至少添加兩個可能的測驗結果！');
      return;
    }

    if (currentTest.questions.length === 0) {
      alert('請至少添加一個問題！');
      return;
    }

    try {
      // 創建新的測驗物件
      const newTest = {
        userId: user.userId,
        title: currentTest.title,
        questions: currentTest.questions.map(q => ({
          question: q.question,
          options: q.options,
          optionResults: q.optionResults
        })),
        results: currentTest.results.map(result => ({
          title: result.title,
          description: result.description,
          imageUrl: result.imageUrl
        })),
        backgroundImage: currentTest.backgroundImage,
        createdAt: new Date().toISOString()
      };

      console.log('Saving test:', newTest); // 調試日誌

      // 添加測驗
      await addTest(newTest);
      
      // 顯示成功消息
      alert('測驗已成功保存！');
      
      // 先重置表單
      setCurrentTest({ 
        title: '', 
        questions: [],
        backgroundImage: '',
        results: []
      });
      
      // 最後才導航
      setTimeout(() => {
        navigate('/tests');
      }, 0);
      
    } catch (error) {
      console.error('Error saving test:', error);
      alert('保存測驗時發生錯誤！');
    }
  };

  const addResult = () => {
    if (!newResult.title.trim() || !newResult.description.trim()) {
      alert('請填寫結果標題和描述！');
      return;
    }

    setCurrentTest(prev => ({
      ...prev,
      results: [...prev.results, { ...newResult, imageUrl: '' }]
    }));

    // 重置新結果表單
    setNewResult({
      title: '',
      description: ''
    });
  };

  const handleOptionChange = (index, value) => {
    console.log('Changing option:', index, value); // 添加調試日誌
    setNewQuestion(prev => {
      const newOptions = [...prev.options];
      newOptions[index] = value;
      return {
        ...prev,
        options: newOptions
      };
    });
  };

  const handleOptionResultChange = (index, value) => {
    setNewQuestion(prev => {
      const newOptionResults = [...prev.optionResults];
      newOptionResults[index] = value;
      return {
        ...prev,
        optionResults: newOptionResults
      };
    });
  };

  const generateImage = async (description, index) => {
    setGeneratingIndex(index);
    setLoading(true);
    try {
      const response = await fetch(`/api/generate-image/?prompt=${encodeURIComponent(description)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('圖片生成失敗');
      }
      
      const data = await response.json();
      console.log('Generated image data:', data);  // 添加調試日誌
      
      setCurrentTest(prev => ({
        ...prev,
        results: prev.results.map((result, i) => 
          i === index ? { ...result, imageUrl: data.image_url } : result
        )
      }));
    } catch (error) {
      console.error('Error generating image:', error);
      alert('生成圖片時發生錯誤');
    } finally {
      setLoading(false);
      setGeneratingIndex(null);
    }
  };

  const editResult = (index) => {
    setEditingResultIndex(index);
    setNewResult(currentTest.results[index]);
  };

  const saveEditedResult = () => {
    if (!newResult.title.trim() || !newResult.description.trim()) {
      alert('請填寫結果標題和描述！');
      return;
    }

    setCurrentTest(prev => ({
      ...prev,
      results: prev.results.map((result, index) => 
        index === editingResultIndex 
          ? { ...newResult, imageUrl: result.imageUrl }
          : result
      )
    }));

    setEditingResultIndex(null);
    setNewResult({
      title: '',
      description: ''
    });
  };

  const cancelEditResult = () => {
    setEditingResultIndex(null);
    setNewResult({
      title: '',
      description: ''
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">建立新測驗</h1>
      
      {/* 測驗標題輸入 */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="測驗標題"
          value={currentTest.title}
          onChange={(e) => setCurrentTest({...currentTest, title: e.target.value})}
          className="text-xl font-bold"
        />
      </div>

      {/* 背景圖片上傳 */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">背景圖片</h2>
        <div className="space-y-4">
          {/* 圖片預覽區域 */}
          {currentTest.backgroundImage && (
            <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={currentTest.backgroundImage}
                alt="背景預覽"
                className="w-full h-full object-cover"
              />
              <Button
                onClick={removeBackgroundImage}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          {/* 上傳按鈕 */}
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex items-center px-4 py-2 bg-custom-secondary hover:bg-black hover:text-white rounded-md transition-colors duration-200"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              {currentTest.backgroundImage ? '更換圖片' : '選擇圖片'}
            </label>
            {currentTest.backgroundImage && (
              <span className="text-sm text-gray-600">
                已選擇圖片
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 測驗結果設定區塊 */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">測驗結果設定</h2>
          <Button
            onClick={addResult}
            className="bg-custom-secondary hover:bg-black hover:text-white rounded-full inline-flex items-center"
            disabled={editingResultIndex !== null}
          >
            <Save className="h-4 w-4 mr-1" />
            <span>保存</span>
          </Button>
        </div>
        
        {/* 新增結果表單 */}
        {editingResultIndex === null && (
          <div className="space-y-3 mb-6">
            <Input
              placeholder="結果標題"
              value={newResult.title}
              onChange={(e) => setNewResult(prev => ({
                ...prev,
                title: e.target.value
              }))}
              className="w-full"
            />
            <textarea
              placeholder="結果描述"
              value={newResult.description}
              onChange={(e) => setNewResult(prev => ({
                ...prev,
                description: e.target.value
              }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-secondary"
              rows={3}
            />
          </div>
        )}

        {/* 已添加的結果列表 */}
        <div className="space-y-4">
          {currentTest.results.map((result, index) => (
            <div 
              key={index}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              {editingResultIndex === index ? (
                // 編輯模式
                <div className="space-y-3">
                  <Input
                    placeholder="結果標題"
                    value={newResult.title}
                    onChange={(e) => setNewResult(prev => ({
                      ...prev,
                      title: e.target.value
                    }))}
                    className="w-full"
                  />
                  <textarea
                    placeholder="結果描述"
                    value={newResult.description}
                    onChange={(e) => setNewResult(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-secondary"
                    rows={3}
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={saveEditedResult}
                      className="flex items-center bg-custom-secondary hover:bg-black hover:text-white"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      <span>保存</span>
                    </Button>
                    <Button
                      onClick={cancelEditResult}
                      className="flex items-center bg-gray-200 hover:bg-gray-300"
                    >
                      <Minus className="w-4 h-4 mr-1" />
                      <span>取消</span>
                    </Button>
                  </div>
                </div>
              ) : (
                // 顯示模式
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{result.title}</h3>
                      <p className="text-sm text-gray-600">{result.description}</p>
                    </div>
                    <Button
                      onClick={() => editResult(index)}
                      className="flex items-center bg-blue-100 hover:bg-blue-200 text-blue-700"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      <span>編輯</span>
                    </Button>
                  </div>
                  
                  {/* 圖片生成區域 */}
                  <div className="mt-3">
                    {result.imageUrl ? (
                      <div className="relative">
                        <img
                          src={result.imageUrl}
                          alt={result.title}
                          className="w-full h-40 object-cover rounded-md"
                        />
                        <Button
                          onClick={() => generateImage(result.description, index)}
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-black text-sm px-2 py-1 rounded flex items-center"
                        >
                          <ImageIcon className="w-4 h-4 mr-1" />
                          <span>重新生成</span>
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => generateImage(result.description, index)}
                        disabled={loading && generatingIndex === index}
                        className="w-full bg-custom-secondary hover:bg-black hover:text-white text-sm py-2 flex items-center justify-center"
                      >
                        {loading && generatingIndex === index ? (
                          <span>生成圖片中...</span>
                        ) : (
                          <>
                            <ImageIcon className="w-4 h-4 mr-1" />
                            <span>生成結果圖片</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 問題列表 */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">已新增的問題</h2>
        <div className="space-y-4">
          {currentTest.questions.map((question, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-md">
              {editingQuestionIndex === index ? (
                <>
                  <Input
                    placeholder="問題內容"
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion(prev => ({
                      ...prev,
                      question: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-secondary"
                  />
                  <div className="space-y-2 mt-2">
                    {newQuestion.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder={`選項 ${optIndex + 1}`}
                          value={option}
                          onChange={(e) => handleOptionChange(optIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-secondary"
                        />
                        <div className="relative">
                          <select
                            value={newQuestion.optionResults[optIndex]}
                            onChange={(e) => handleOptionResultChange(optIndex, parseInt(e.target.value))}
                            className="px-3 py-2 pr-8 bg-custom-secondary text-black rounded-md
                              text-sm font-medium hover:bg-black hover:text-white
                              transition-colors duration-200 cursor-pointer
                              border-none outline-none appearance-none min-w-[120px]"
                            style={{
                              WebkitAppearance: 'none',
                              MozAppearance: 'none'
                            }}
                          >
                            {currentTest.results.map((result, resultIndex) => (
                              <option 
                                key={resultIndex} 
                                value={resultIndex}
                                className="bg-white text-black"
                              >
                                {result.title}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
                        </div>
                        {newQuestion.options.length > 2 && (
                          <Button
                            onClick={() => removeOption(optIndex)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 space-x-4">
                    <Button 
                      onClick={saveEditedQuestion}
                      className="bg-gray-200 hover:bg-gray-300 text-custom-black rounded-full inline-flex items-center"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      保存編輯
                    </Button>
                    <Button 
                      onClick={() => setEditingQuestionIndex(null)}
                      className="bg-red-200 hover:bg-red-300 text-custom-black rounded-full inline-flex items-center"
                    >
                      取消
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-medium">問題 {index + 1}: {question.question}</p>
                  <div className="mt-2 space-y-1">
                    {question.options.map((option, optIndex) => (
                      <p key={optIndex} className="text-sm text-gray-600">
                        • {option}
                      </p>
                    ))}
                  </div>
                  <Button
                    onClick={() => editQuestion(index)}
                    className="mt-2 bg-blue-200 hover:bg-blue-300 text-custom-black rounded-full inline-flex items-center"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    編輯
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 新增問題區塊 */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">新增問題</h2>
          <Button 
            onClick={addQuestion}
            className="bg-custom-secondary hover:bg-black hover:text-white rounded-full inline-flex items-center"
          >
            <Save className="h-4 w-4 mr-1" />
            <span>保存</span>
          </Button>
        </div>
        
        <div className="space-y-4">
          <Input
            placeholder="問題內容"
            value={newQuestion.question}
            onChange={(e) => setNewQuestion(prev => ({
              ...prev,
              question: e.target.value
            }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-secondary"
          />

          {/* 選項輸入區域 */}
          <div className="space-y-2">
            {newQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`選項 ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-secondary"
                />
                <div className="relative">
                  <select
                    value={newQuestion.optionResults[index]}
                    onChange={(e) => handleOptionResultChange(index, parseInt(e.target.value))}
                    className="px-3 py-2 pr-8 bg-custom-secondary text-black rounded-md
                      text-sm font-medium hover:bg-black hover:text-white
                      transition-colors duration-200 cursor-pointer
                      border-none outline-none appearance-none min-w-[120px]"
                    style={{
                      WebkitAppearance: 'none',
                      MozAppearance: 'none'
                    }}
                  >
                    {currentTest.results.map((result, resultIndex) => (
                      <option 
                        key={resultIndex} 
                        value={resultIndex}
                        className="bg-white text-black"
                      >
                        {result.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
                </div>
                {newQuestion.options.length > 2 && (
                  <Button
                    onClick={() => removeOption(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 儲存測驗按鈕 */}
      <div className="mt-4">
        <Button 
          onClick={saveTest}
          className="w-full bg-custom-secondary hover:bg-black hover:text-white rounded-full inline-flex items-center justify-center"
        >
          <Save className="h-4 w-4 mr-1" />
          <span>儲存測驗</span>
        </Button>
      </div>
    </div>
  );
} 