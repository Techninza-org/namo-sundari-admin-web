import { MapPin, Home, Map } from 'lucide-react';
import PropTypes from 'prop-types';

const Address = ({ addressData }) => {
  console.log("address>>>>", addressData);

  // Handle case where address might be null or undefined
  if (!addressData) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Delivery Address</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500">No address information available</p>
        </div>
      </div>
    );
  }

  const formatAddress = () => {
    const parts = [
      addressData.houseNo,
      addressData.street,
      addressData.city,
      addressData.district,
      addressData.pincode
    ].filter(Boolean); // Remove any null/undefined values
    
    return parts.join(', ');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Delivery Address</h2>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-indigo-600 mt-1 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-gray-900 font-medium">{formatAddress()}</p>
            {addressData.isDefault && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                <Home className="h-3 w-3 mr-1" />
                Default Address
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">House/Flat No.</p>
            <p className="font-medium text-gray-900">{addressData.houseNo}</p>
          </div>
          <div>
            <p className="text-gray-500">Pincode</p>
            <p className="font-medium text-gray-900">{addressData.pincode}</p>
          </div>
          <div>
            <p className="text-gray-500">City</p>
            <p className="font-medium text-gray-900">{addressData.city}</p>
          </div>
          <div>
            <p className="text-gray-500">District</p>
            <p className="font-medium text-gray-900">{addressData.district}</p>
          </div>
        </div>

        {addressData.street && (
          <div className="pt-2">
            <p className="text-gray-500 text-sm">Street</p>
            <p className="font-medium text-gray-900">{addressData.street}</p>
          </div>
        )}
      </div>
    </div>
  );
};

Address.propTypes = {
  addressData: PropTypes.shape({
    id: PropTypes.number,
    houseNo: PropTypes.string,
    street: PropTypes.string,
    city: PropTypes.string,
    district: PropTypes.string,
    pincode: PropTypes.string,
    isDefault: PropTypes.bool,
    status: PropTypes.number,
  }),
};

Address.defaultProps = {
  addressData: null,
};

export default Address;