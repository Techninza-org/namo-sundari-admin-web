import { useState } from 'react';
import { Calendar, Edit, Check, X } from 'lucide-react';
import PropTypes from 'prop-types';
import Cookies from "js-cookie";
import axios from "axios";

const OrderSummary = ({ orderData }) => {
  console.log("order>>>>" ,orderData)
  const [selectedStatus, setSelectedStatus] = useState(orderData.status);
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  const token = Cookies.get("token");

  const statusOptions = [
    { id: 0, name: "Order Placed" },
    { id: 1, name: "Working" },
    { id: 2, name: "Completed" },
  ];

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleStatusChange = (statusId) => {
    setSelectedStatus(Number(statusId)); // ensure it's a number
  };

  const saveStatusUpdate = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin/update-order-status`,
        {
          order_id: orderData.id,
          status: selectedStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsEditingStatus(false);
      // Optionally: reload page or trigger refetch if needed
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0: return "bg-yellow-400";
      case 1: return "bg-blue-500";
      case 2: return "bg-purple-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">Order Date</p>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <p className="font-medium">{formatDate(orderData.createdAt)}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Payment ID</p>
          <p className="font-medium">{orderData.paymentOrderId}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Order Status</p>
          {isEditingStatus ? (
            <div className="flex items-center space-x-2">
              <select
                className="block w-26 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              <button
                onClick={saveStatusUpdate}
                className="p-1 bg-green-50 text-green-600 rounded hover:bg-green-100"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsEditingStatus(false)}
                className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusColor(orderData.status)}`} />
              <p className="font-medium">
                {statusOptions.find((s) => s.id === orderData.status) || "Unknown"}
              </p>
              {orderData.status !== 2 && ( // Only allow editing if not Completed
                <button
                  onClick={() => setIsEditingStatus(true)}
                  className="ml-2 text-indigo-600 hover:text-indigo-800"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

OrderSummary.propTypes = {
  orderData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.number.isRequired,
    created_at: PropTypes.string.isRequired,
    payment_id: PropTypes.string.isRequired,
  }).isRequired,
};

export default OrderSummary;
