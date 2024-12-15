import { useTest } from '../context/TestContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TestResults() {
  const { testResults, getTest, deleteResult, displayedResults, setDisplayedResults } = useTest();
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
                data: { success, test, message }
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

  return (
    <div className="bg-custom-primary p-6 rounded-lg border border-black">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-custom-black">測驗結果</h2>
        {error && (
          <Button
            onClick={handleRetry}
            className="flex items-center gap-2"
            variant="outline"
          >
            <RefreshCw className="h-4 w-4" />
            重試
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="text-custom-black">
            載入中... {Math.round(loadingProgress)}%
          </p>
        </div>
      )}

      {error && !isLoading && (
        <div className="text-red-500 p-4 bg-red-50 rounded-lg mb-4">
          {error}
        </div>
      )}

      {!isLoading && !error && processedResults.length === 0 && (
        <p className="text-custom-black text-center p-4">還沒有測驗結果</p>
      )}

      {!isLoading && !error && processedResults.length > 0 && (
        <div className="space-y-4">
          {processedResults.map((result, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-black relative group">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-medium text-lg text-custom-black">{result.test.title}</h3>
                  <p className="text-custom-black text-sm">{new Date(result.date).toLocaleString()}</p>
                </div>
                <Button
                  onClick={() => deleteResult(index)}
                  className="text-gray-400 hover:bg-black hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  variant="ghost"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-custom-black font-medium mb-4">
                結果：{result.testResult?.title}
              </p>
              <p className="text-gray-600 mb-4">{result.testResult?.description}</p>
              
              <div className="space-y-3">
                {Object.entries(result.answers).map(([qIndex, answer]) => {
                  const question = result.test?.questions[parseInt(qIndex)];
                  return (
                    <div key={qIndex} className="bg-gray-100 p-3 rounded-md">
                      <p className="text-custom-black font-medium">
                        問題 {parseInt(qIndex) + 1}: {question?.question}
                      </p>
                      <p className="text-custom-black mt-1">
                        答案: {question?.options[answer]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
