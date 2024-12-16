import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';

export function TestCard({ test, isOwner, onDelete }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">{test.title}</h2>
          <p className="text-gray-600">
            共 {test.questions.length} 個問題
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link to={`/test/${test.testId}`}>
            <Button className="bg-custom-secondary hover:bg-black hover:text-white transition duration-300">
              開始測驗
            </Button>
          </Link>
          {isOwner && (
            <>
              <Link to={`/edit/${test.testId}`}>
                <Button className="bg-custom-secondary hover:bg-black hover:text-white transition duration-300">
                  編輯測驗
                </Button>
              </Link>
              <Button 
                onClick={() => onDelete(test.testId, test.title)}
                className="bg-white text-red-500 hover:bg-red-50 hover:text-red-700 transition duration-300"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}