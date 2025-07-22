import React from 'react';
import { Play } from 'lucide-react';

const TestActionButtons = ({ 
  testStatus, 
  selectedRule,
  onStartTest, 
  onStopTest, 
  onRetryTest, 
  onSubmitResult, 
  onCancel,
  submitting 
}) => {
  return (
    <div className="flex justify-center gap-4">
      {testStatus === 'ready' && (
        <button
          onClick={onStartTest}
          className="flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Play className="h-4 w-4 mr-2" />
          Start Test
        </button>
      )}

      {testStatus === 'running' && (
        <div className="flex gap-4 items-center">
          <div className="flex items-center text-yellow-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600 mr-2"></div>
            Test in progress...
          </div>
          <button
            onClick={onStopTest}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Stop Test
          </button>
        </div>
      )}

      {testStatus === 'completed' && (
        <div className="flex gap-4">
          <button
            onClick={onRetryTest}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Retry Test
          </button>
          <button
            onClick={onSubmitResult}
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Result'}
          </button>
        </div>
      )}

      <button
        onClick={onCancel}
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
      >
        Cancel
      </button>
    </div>
  );
};

export default TestActionButtons;
