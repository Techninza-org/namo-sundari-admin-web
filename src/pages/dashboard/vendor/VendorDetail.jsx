import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from "axios";
import Toaster, {
  showSuccessToast,
  showErrorToast,
} from "../../../components/Toaster";


const VendorDetailsTable = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const vendorId = useParams().id; 
  const token = Cookies.get("token");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");


const handleUpdatePassword = async (e) => {
  e.preventDefault();
  try {
    if (!token) {
      console.error("Admin token is missing.");
      showErrorToast("Admin token is missing.");
      return;
    }
    if (password !== confirmPassword) {
      showErrorToast("Passwords do not match!");
      return;
    }
    
   
    const requestData = {
      id: vendorId,
      password: password,
    };

    
    const response = await axios.put(
      `${import.meta.env.VITE_BASE_URL}/admin/update-vendor-password`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Handle success response
    if (response.data.success) {
      showSuccessToast("Password updated successfully!");
      setPassword("");
      setConfirmPassword("");
    } else {
      showErrorToast(response.data.message || "Failed to update password");
    }
  } catch (error) {
    console.error("Error updating password:", error);
    showErrorToast(
      error.response?.data?.message || "Failed to update password"
    );
  }
};

  console.log("Vendor ID:", vendorId); 

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/get-vendor/${vendorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setVendor(response.data.vendor);
        } else {
          throw new Error('API returned unsuccessful response');
        }
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (vendorId && token) {
      fetchVendorDetails();
    }
  }, [vendorId, token]);

  if (loading) return <div className="text-center p-4">Loading vendor details...</div>;
  if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  if (!vendor) return <div className="text-center p-4">No vendor data available</div>;

  const personalInfo = [
    { label: 'Full Name', value: vendor.name },
   
    { label: 'Email', value: vendor.email },
   
  ];





  const bankDetails = [
    { label: 'Bank Name', value: vendor.bank_name },
    { label: 'Account No', value: vendor.account_no },
    { label: 'IFSC Code', value: vendor.ifsc_no },
  ];



  const renderSection = (title, data) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 w-1/3">{item.label}</td>
                <td className="px-6 py-4 text-sm text-gray-500 w-2/3">{item.value || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );


  return (
    <>
      <Toaster />
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Vendor Details (ID: {vendor.id})</h2>
      <div className="mb-8 flex items-center gap-6">
        <img
          src={`${import.meta.env.VITE_BASE_URL_IMAGE}/${vendor.img_url}`}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border"
        />
        <div>
          <h3 className="text-lg font-medium text-gray-700">Profile Image</h3>
        </div>
      </div>

      {renderSection('Personal Information', personalInfo)}
      {/* {renderSection('Document Information', documentInfo)} */}
      {/* {renderDocumentImages()} */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       
      
      </div>
      {renderSection('Bank Details', bankDetails)}
      {/* {renderSection('Status Information', statusInfo)} */}
        {/* update password form */}
     <div className="p-6 max-w-3xl   rounded-lg  bg-white mt-8">
      <h2 className="text-2xl font-semibold mb-4">Update Vendor Password</h2>
      <form
        onSubmit={handleUpdatePassword}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        
      
        {/* New Password */}
        <div>
          <label className="block font-medium mb-1">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block font-medium mb-1">Confirm New Password</label>
          <input
            type="password"
            name="confirmNewPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="sm:col-span-2 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
    </div>
    </>
  );
};

export default VendorDetailsTable;
