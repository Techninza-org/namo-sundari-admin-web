import { Receipt, CreditCard, Gift, FileText, Calculator, Bookmark, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

const GeneralInfo = ({ orderData }) => {
  console.log("general info>>>>", orderData);

  // Handle case where orderData might be null or undefined
  if (!orderData) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Order Information</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500">No order information available</p>
        </div>
      </div>
    );
  }

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return `₹${amount}`;
  };

  // Get payment mode with proper formatting
  const getPaymentModeDisplay = (mode) => {
    if (!mode) return "N/A";
    return mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase();
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED': 
        return "bg-green-100 text-green-800";
      case 'PENDING': 
        return "bg-yellow-100 text-yellow-800";
      case 'CANCELLED': 
        return "bg-red-100 text-red-800";
      case 'SUCCESS': 
        return "bg-green-100 text-green-800";
      case 'FAILED': 
        return "bg-red-100 text-red-800";
      default: 
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Order Information</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Order ID and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Order ID</p>
            <div className="flex items-center">
              <Receipt className="h-4 w-4 text-gray-400 mr-2" />
              <p className="font-semibold text-gray-900">#{orderData.id}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Order Status</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(orderData.status)}`}>
              {orderData.status}
            </span>
          </div>
        </div>

        {/* Payment Information */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">Payment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Mode</p>
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                <p className="font-medium text-gray-900">{getPaymentModeDisplay(orderData.paymentMode)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Order ID</p>
              <p className="font-medium text-gray-900">{orderData.paymentOrderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(orderData.orderStatus)}`}>
                {orderData.orderStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">Price Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Calculator className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-600">Subtotal</span>
              </div>
              <span className="font-medium text-gray-900">
                {formatCurrency(orderData.totalAmount)}
              </span>
            </div>
            
            {orderData.gst && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">GST</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(orderData.gst)}
                </span>
              </div>
            )}
            
            {orderData.discount && (
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Gift className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-gray-600">Discount</span>
                </div>
                <span className="font-medium text-green-600">
                  -{formatCurrency(orderData.discount)}
                </span>
              </div>
            )}
            
            {/* Final Total (if you want to calculate it) */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="text-base font-semibold text-gray-900">Total Amount</span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(orderData.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Coupon and Notes */}
        <div className="border-t border-gray-100 pt-6 space-y-4">
          {orderData.couponCode && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Coupon Code</p>
              <div className="flex items-center">
                <Bookmark className="h-4 w-4 text-green-500 mr-2" />
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {orderData.couponCode}
                </span>
              </div>
            </div>
          )}
          
          {orderData.notes && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Notes</p>
              <div className="flex items-start">
                <FileText className="h-4 w-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{orderData.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

GeneralInfo.propTypes = {
  orderData: PropTypes.shape({
    id: PropTypes.number,
    totalAmount: PropTypes.string,
    gst: PropTypes.string,
    discount: PropTypes.string,
    couponCode: PropTypes.string,
    status: PropTypes.string,
    orderStatus: PropTypes.string,
    paymentMode: PropTypes.string,
    paymentOrderId: PropTypes.string,
    notes: PropTypes.string,
  }),
};

GeneralInfo.defaultProps = {
  orderData: null,
};

export default GeneralInfo;