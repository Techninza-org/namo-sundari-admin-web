import { ChevronLeft, Printer, Download } from 'lucide-react';
import PropTypes from 'prop-types';

const OrderHeader = ({ orderData }) => {
  console.log(orderData, 'header');
  
  const statusOptions = [
    { id: 0, name: "Order Placed" },
    { id: 1, name: "Working" },
    { id: 2, name: "Completed" },
  ];

  const currentStatus = statusOptions.find(option => option.id === orderData.status);

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeft className="h-5 w-5 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Order #{orderData.order_id}</h1>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            orderData.status === 2
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {currentStatus?.name || 'Unknown'} 
        </span>
      </div>
      <div className="flex space-x-3">
        {/* Optional: Uncomment if needed */}
        {/* 
        <button className="flex items-center px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </button>
        <button className="flex items-center px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
        */}
      </div>
    </div>
  );
};

OrderHeader.propTypes = {
  orderData: PropTypes.shape({
    order_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    status: PropTypes.number.isRequired,
  }).isRequired,
};

export default OrderHeader;
