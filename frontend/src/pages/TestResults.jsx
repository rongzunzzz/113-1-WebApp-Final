import { useTest } from '../context/TestContext';
import { useAuth } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useEffect } from 'react';
import axios from 'axios';

export default function TestResults() {
  const { testResults, getTest, deleteResult } = useTest();
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">測驗結果</h1>
      
      {testResults.length > 0 ? (
        <div className="space-y-6">
          {testResults.map((result, index) => {
            const test = getTest(result.testId);
            if (!test) return null;
            
            const testResult = test.results[result.resultIndex];
            return (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                {/* 測驗標題和刪除按鈕 */}
                <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-custom-black">{test.title}</h3>
                      <p className="text-gray-600 text-sm">{new Date(result.date).toLocaleString()}</p>
                    </div>
                    <Button
                      onClick={() => deleteResult(index)}
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
                    <h5 className="font-medium text-lg mb-2">{testResult?.title}</h5>
                    <p className="text-gray-600 mb-4">{testResult?.description}</p>
                    
                    {testResult?.imageUrl && (
                      <div className="mt-4">
                        <img 
                          src={testResult.imageUrl} 
                          alt={testResult.title}
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
                      const question = test?.questions[parseInt(qIndex)];
                      return (
                        <div 
                          key={qIndex} 
                          className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <p className="font-medium text-custom-black mb-2">
                            問題 {parseInt(qIndex) + 1}: {question?.question}
                          </p>
                          <p className="text-gray-600">
                            回答: {question?.options[answer]}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-gray-600">還沒有測驗結果</p>
        </div>
      )}
    </div>
  );
} 