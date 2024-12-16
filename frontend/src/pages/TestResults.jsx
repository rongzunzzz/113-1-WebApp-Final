import { useTest } from '../context/TestContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function TestResults() {
  const navigate = useNavigate();
  const { deleteResult, displayedResults, setDisplayedResults } = useTest();
  const { user } = useAuth();
  const [processedResults, setProcessedResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  // 獲取使用者的測驗結果
  useEffect(() => {
    const getUserResults = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const {
          data: { success, userResults, message }
        } = await axios.get('/api/getUserResults/', {
          params: {
            userId: user.userId,
          }
        });
        
        if (success) {
          console.log('獲取使用者結果:', userResults);
          setDisplayedResults(userResults);
        } else {
          console.warn('獲取使用者結果失敗:', message);
          setError('無法載入測驗結果，請稍後再試');
        }
      } catch (error) {
        console.error('獲取使用者結果時發生錯誤:', error);
        setError('載入測驗結果時發生錯誤');
      } finally {
        setIsLoading(false);
      }
    };
    
    getUserResults();
  }, [retryCount]);

  // 處理測驗詳細資訊
  useEffect(() => {
    const processResults = async () => {
      if (!displayedResults.length) return;
      
      setIsLoading(true);
      setError(null);
      setLoadingProgress(0);

      try {
        const total = displayedResults.length;
        let completed = 0;

        const processed = await Promise.all(
          displayedResults.map(async (result) => {
            try {
              const {
                data: { success, message, test }
              } = await axios.get('/api/getTestById/', {
                params: {
                  testId: result.testId,
                }
              });

              completed++;
              setLoadingProgress((completed / total) * 100);

              if (!success) {
                console.warn(`測驗 ${result.testId} 載入失敗: ${message}`);
                return null;
              }

              return {
                ...result,
                test,
                testResult: test.results[result.resultIndex]
              };
            } catch (err) {
              console.error(`處理測驗 ${result.testId} 時發生錯誤:`, err);
              return null;
            }
          })
        );

        const validResults = processed.filter(Boolean);
        setProcessedResults(validResults);

        if (validResults.length < displayedResults.length) {
          console.warn(`有 ${displayedResults.length - validResults.length} 個測驗結果未能成功載入`);
        }

      } catch (error) {
        console.error('處理測驗結果時發生錯誤:', error);
        setError('處理測驗結果時發生錯誤，請稍後再試');
      } finally {
        setIsLoading(false);
        setLoadingProgress(100);
      }
    };

    if (displayedResults.length > 0) {
      processResults();
    }
  }, [displayedResults]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleTitleClick = (testId) => {
    navigate(`/test/${testId}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">測驗結果</h1>

      {isLoading && (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="text-gray-600">
            載入中... {Math.round(loadingProgress)}%
          </p>
        </div>
      )}

      {error && !isLoading && (
        <div className="text-red-500 p-4 bg-red-50 rounded-lg mb-4 flex justify-between items-center">
          <span>{error}</span>
          <Button
            onClick={handleRetry}
            className="flex items-center gap-2"
            variant="outline"
          >
            <RefreshCw className="h-4 w-4" />
            重試
          </Button>
        </div>
      )}

      {!isLoading && !error && processedResults.length === 0 && (
        <p className="text-center p-4">還沒有測驗結果</p>
      )}

      {!isLoading && !error && processedResults.length > 0 && (
        <div className="space-y-6">
          {processedResults.map((result, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              {/* 測驗標題和刪除按鈕 */}
              <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 
                      onClick={() => handleTitleClick(result.test.testId)}
                      className="text-xl font-semibold text-gray-900 cursor-pointer hover:text-blue-600 hover:underline transition-colors"
                    >
                      {result.test.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {new Date(result.date).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    onClick={async () => {
                      await deleteResult(result.resultId);
                      navigate('/results');
                      window.location.reload();
                    }}
                    className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full"
                    variant="ghost"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* 測驗結果區塊 */}
              <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-lg font-semibold mb-4">測驗結果</h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h5 className="font-medium text-lg mb-2">{result.testResult?.title}</h5>
                  <p className="text-gray-600 mb-4">{result.testResult?.description}</p>
                  
                  {result.testResult?.imageUrl && (
                    <div className="mt-4">
                      <img 
                        src={result.testResult.imageUrl} 
                        alt={result.testResult.title}
                        className="w-full h-auto max-h-[400px] object-contain rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 答題詳情區塊 */}
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-lg font-semibold mb-4">答題詳情</h4>
                <div className="space-y-3">
                  {Object.entries(result.answers).map(([qIndex, answer]) => {
                    const question = result.test?.questions[parseInt(qIndex)];
                    return (
                      <div 
                        key={qIndex} 
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <p className="font-medium text-gray-900 mb-2">
                          問題 {parseInt(qIndex) + 1}: {question?.text}
                        </p>
                        <p className="text-gray-600">
                          你的答案: {question?.options[answer]}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
