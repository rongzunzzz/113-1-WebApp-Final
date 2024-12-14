import { useTest } from '../context/TestContext';
import { useAuth } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useEffect } from 'react';
import axios from 'axios';

export default function TestResults() {
  const { testResults, getTest, deleteResult,
          displayedResults, setDisplayedResults } = useTest();
  const { user } = useAuth();

  useEffect(() => {
    const getUserResults = async () => {
      const {
        data: { success, userResults }
      } = await axios.get('/api/getUserResults/', {
        params: {
          userId: user.userId,
        }
      });
      
      if (success) {
        console.log(userResults);
      }
    };
    
    getUserResults();
  }, [])

  return (
    <div className="bg-custom-primary p-6 rounded-lg border border-black">
      <h2 className="text-xl font-semibold text-custom-black mb-4">測驗結果</h2>
      {testResults.length > 0 ? (
        <div className="space-y-4">
          {testResults.map((result, index) => {
            const test = getTest(result.testId);
            if (!test) return null;
            
            const testResult = test.results[result.resultIndex];
            return (
              <div key={index} className="bg-white p-6 rounded-lg border border-black relative group">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-medium text-lg text-custom-black">{test.title}</h3>
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
                  結果：{testResult?.title}
                </p>
                <p className="text-gray-600 mb-4">{testResult?.description}</p>
                
                <div className="space-y-3">
                  {Object.entries(result.answers).map(([qIndex, answer]) => {
                    const question = test?.questions[parseInt(qIndex)];
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
            );
          })}
        </div>
      ) : (
        <p className="text-custom-black">還沒有測驗結果</p>
      )}
    </div>
  );
} 