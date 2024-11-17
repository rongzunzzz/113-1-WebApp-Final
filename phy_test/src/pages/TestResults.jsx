import { useTest } from '../context/TestContext';
import { Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function TestResults() {
  const { testResults, savedTests, deleteResult } = useTest();

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">測驗結果</h2>
      {testResults.length > 0 ? (
        <div className="space-y-4">
          {testResults.map((result, index) => {
            const test = savedTests.find(t => t.id === result.testId);
            return (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 relative group">
                <Button
                  onClick={() => deleteResult(index)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  variant="ghost"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <h3 className="font-medium text-lg text-gray-800">{result.testTitle}</h3>
                <p className="text-gray-500 text-sm mb-4">{result.date}</p>
                <div className="space-y-3">
                  {Object.entries(result.answers).map(([qIndex, answer]) => {
                    const question = test?.questions[parseInt(qIndex)];
                    return (
                      <div key={qIndex} className="bg-gray-50 p-3 rounded-md">
                        <p className="text-gray-700 font-medium">
                          問題 {parseInt(qIndex) + 1}: {question?.question}
                        </p>
                        <p className="text-gray-600 mt-1">
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
        <p className="text-gray-500">還沒有測驗結果</p>
      )}
    </div>
  );
} 