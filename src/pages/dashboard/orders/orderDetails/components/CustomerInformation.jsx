import { UserCheck, MapPin, Timer } from 'lucide-react';
import PropTypes from 'prop-types';

const CustomerInformation = ({ customerData }) => {
  console.log(customerData, "customerData in CustomerInformation.jsx");
  console.log(customerData.user.name, 'nameeeee');
  
  // Format date to readable format
  const formatDate = (dateString) => {
    console.log(dateString, "dateString in formatDate function");
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Customer Information</h2>
        </div>
        
        <div className="p-6">
            <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                    <UserCheck className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-base font-medium text-gray-900">{customerData.user.name}</h3>
                    <p className="text-sm text-gray-500">{customerData.user.email}</p>
                </div>
            </div>
            
      
            
            <OrderTimeline orderDate={formatDate(customerData.created_at)} status={customerData.status}/>
            
       
        </div>
    </div>
);
};

// File: components/OrderTimeline.jsx (This is included in CustomerInformation.jsx)
const statusOptions = [
  { id: 0, name: "Order Placed" },
  { id: 1, name: "Working" },
  { id: 2, name: "Completed" },
];

const OrderTimeline = ({ orderDate, status }) => {
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Order Timeline</h3>
      <div className="space-y-4">
        {statusOptions.map((step, index) => {
          const isCompleted = index < status;
          const isCurrent = index === status;

          const dotColor = isCompleted || isCurrent ? "bg-indigo-600" : "bg-gray-300";
          const textColor = isCompleted || isCurrent ? "text-gray-900" : "text-gray-500";
          let description = "Pending";

          if (index === 0) {
            description = formatDate(orderDate);
          } else if (index === 1) {
            description = status >= 1 ? "Work in progress" : "Pending";
          } else if (index === 2) {
            description = status === 2 ? "Delivered" : "Not scheduled yet";
          }

          return (
            <div key={step.id} className="flex items-center">
              <div className="mr-3 flex flex-col items-center">
                <div className={`h-2.5 w-2.5 rounded-full ${dotColor}`}></div>
                {index < statusOptions.length - 1 && (
                  <div className="h-full w-px bg-gray-200"></div>
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${textColor}`}>{step.name}</p>
                <p className="text-xs text-gray-500">{description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


OrderTimeline.propTypes = {
    orderDate: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
    };
    
CustomerInformation.propTypes = {
  customerData: PropTypes.shape({
    user_name: PropTypes.string.isRequired,
    user_email: PropTypes.string.isRequired,
    address: PropTypes.string,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
};

export default CustomerInformation;
