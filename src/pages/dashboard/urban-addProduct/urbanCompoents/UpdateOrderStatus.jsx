import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Toaster, {
  showErrorToast,
  showSuccessToast,
} from "@/components/Toaster";

const UpdateOrderStatus = ({ orderId,assignstatus }) => {
  const [status, setStatus] = useState(assignstatus);
    

  const statusOptions = [
    { value: null, label: "Not Assigned" },
    { value: 1, label: "Partially Assigned" },
    { value: 2, label: "Completely Assigned" },
  ];

  const handleChange = (e) => {
    const newValue = e.target.value === "null" ? null : Number(e.target.value);
    setStatus(newValue);
  };

  const handleUpdateStatus = async () => {
    try {
      const token = Cookies.get("token"); // Replace with your actual token
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/update-order-status`,
        { id: orderId, status },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      showSuccessToast("Status updated successfully");
    } catch (error) {
      console.error("Error updating status", error);
      showErrorToast("Failed to update status");
    }
  };

  return (
    <>
    <Toaster />   
     <div className="p-4 border rounded-lg shadow-md">
      <select
        value={status === null ? "null" : status}
        onChange={handleChange}
        className="p-2 border rounded w-full"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        onClick={handleUpdateStatus}
        className="ml-2 p-2 mt-2 bg-blue-500 text-white rounded"
      >
        Update
      </button>
    </div>
    </>
  );
};

export default UpdateOrderStatus;
