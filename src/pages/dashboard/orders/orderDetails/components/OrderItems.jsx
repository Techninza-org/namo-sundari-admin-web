// import { Edit, Check } from "lucide-react";
import { Check, Edit, View, X } from "lucide-react";
import PropTypes from "prop-types";
import VendorModal from "./VendorModal";
import { useState, useEffect } from "react";
// import { Button } from "@material-tailwind/react";
import Cookies from "js-cookie";

import axios from "axios";
// import { useState } from "react";



const OrderItems = ({ items, totalAmount }) => {
  return (
    <div className="bg-white h-fit rounded-xl shadow-sm overflow-hidden mt-6">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Order Items</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Product
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Quantity
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Vendor name
              </th>
               <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Vendor email
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <OrderItemRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-end space-x-4">
          <div className="text-sm text-gray-500">Total:</div>
          <div className="text-lg font-semibold text-gray-900">
            ₹{parseFloat(totalAmount).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};


const OrderItemRow = ({ item }) => {
  const [open, setOpen] = useState(false);
  const [fetchedVendors, setFetchedVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");

  // const [selectedStatus, setSelectedStatus] = useState(item.status || "ORDERED");
  const [selectedStatus, setSelectedStatus] = useState(item.orderItemStatus || "ORDERED");
  const [isEditingStatus, setIsEditingStatus] = useState(false);

const statusOptions = [
  { id: "ORDERED", name: "Order Placed" },
  { id: "SHIPPED", name: "Shipped" },
  { id: "DELIVERED", name: "Delivered" },
  { id: "CANCELED", name: "Canceled" }
];

 
const handleStatusChange = (statusId) => {
    setSelectedStatus(statusId);
  };

  // Handle status update
  const saveStatusUpdate = async () => {
    await updateOrderStatus(selectedStatus);
    setIsEditingStatus(false);
    // Update the item's status in the UI
    item.orderItemStatus  = selectedStatus;
  };



 const updateOrderStatus = async (statusId) => {
  try {
    await axios.put(
      `${import.meta.env.VITE_BASE_URL}/admin/update-order-status-admin`,
      {
        OrderItemStatus: statusId, // This will now be one of: ORDERED, SHIPPED, DELIVERED, CANCELED
        OrderItemId: item.id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Failed to update order status:", error);
  }
};
  const handleOpen = () => setOpen(!open);

  // Fetch vendors when the modal is opened
  useEffect(() => {
    if (open && item.variant?.product) {
      const fetchVendors = async () => {
        setLoading(true);
        try {
          const categoryId = item.variant.product.mainCategoryId;
          
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/admin/get-vendor-by-service/${categoryId}`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          setFetchedVendors(response.data);
        } catch (error) {
          console.error("Error fetching vendors:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchVendors();
    }
  }, [open, item.variant?.product?.mainCategoryId]);

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            {item.variant?.images && item.variant.images.length > 0 && (
              <img
                className="h-10 w-10 rounded-md object-cover"
                src={`${import.meta.env.VITE_BASE_URL_IMAGE}${item.variant.images[0]}`}
                alt={item.variant?.product?.name || "Product"}
              />
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {item.variant?.product?.name || "Product Name"}
            </div>
            <div className="text-sm text-gray-900">
              {item.variant?.product?.slug || "Product Slug"}
            </div>
          
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          ₹{parseFloat(item.price).toFixed(2)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{item.quantity}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
      

        <div>
          
          {isEditingStatus ? (
            <div className="flex items-center space-x-2">
              <select
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              <span
                className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  item.status === "ORDERED"
                    ? "bg-yellow-400"
                    : item.status === "SHIPPED"
                    ? "bg-blue-500"
                    : item.status === "DELIVERED"
                    ? "bg-green-500"
                    : item.status === "CANCELED"
                    ? "bg-red-500"
                    : "bg-gray-500"
                }`}
              ></span>
              <p className="font-medium">
                {statusOptions.find((s) => s.id === item.orderItemStatus)?.name || "N/A"}
              </p>
              <button
                onClick={() => setIsEditingStatus(true)}
                className="ml-2 text-indigo-600 hover:text-indigo-800"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {item.vendor ? (
            item.vendor.name
          ) : (
            <button onClick={handleOpen}>
              <View className="h-5 w-5" />
            </button>
          )}
        </div>
      </td>
        <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {item.vendor ? (
            item.vendor.email
          ) : (
            <button onClick={handleOpen}>
              <View className="h-5 w-5" />
            </button>
          )}
        </div>
      </td>

      {/* Modal for Vendor List */}
      <VendorModal
        open={open}
        setOpen={setOpen}
        vendorOptions={fetchedVendors}
        loading={loading}
        item={item}
      />
    </tr>
  );
};

OrderItems.propTypes = {
  items: PropTypes.array.isRequired,
  totalAmount: PropTypes.number.isRequired,
  vendorOptions: PropTypes.array.isRequired,
  handleVendorChange: PropTypes.func.isRequired,
  toggleVendorEdit: PropTypes.func.isRequired,
};

OrderItemRow.propTypes = {
  item: PropTypes.object.isRequired,
  vendorOptions: PropTypes.array.isRequired,
  handleVendorChange: PropTypes.func.isRequired,
  toggleVendorEdit: PropTypes.func.isRequired,
};

export default OrderItems;
