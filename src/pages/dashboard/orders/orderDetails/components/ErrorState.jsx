import { AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

const ErrorState = ({ error }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <p className="text-red-600 font-medium">Error: {error}</p>
        </div>
      </div>
    </div>
  );
};

ErrorState.PropTypes = {
  error: PropTypes.string.isRequired,
};


export default ErrorState;