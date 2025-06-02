

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Toaster, {
  showSuccessToast,
  showErrorToast,
} from "../../../components/Toaster";

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const token = Cookies.get("token");

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        console.error("Admin token is missing.");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      const formData = new FormData();
      formData.append("id", id);
      formData.append("password", password);

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin/update-user-password`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      showSuccessToast("Password updated successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      showErrorToast("Failed to update password");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) {
          console.error("Admin token is missing.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/get-user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <div className="text-center p-4">Loading user details...</div>;
  if (!user) return <div className="text-center p-4 text-red-600">User not found.</div>;

  const renderSection = (title, data) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/3">
                  {item.label}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-2/3">
                  {item.value || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  

  const renderAddresses = () => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">Address Information</h3>
    {user.Address?.length ? (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                House No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Street
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                City
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                District
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pincode
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Default
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {user.Address
              .sort((a, b) => b.isDefault - a.isDefault) // Sort to show default address first
              .map((addr, index) => (
                <tr key={index} className={addr.isDefault ? "bg-green-50" : (index % 2 === 0 ? "bg-gray-50" : "bg-white")}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {addr.houseNo || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {addr.street || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {addr.city || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {addr.district || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {addr.pincode || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      addr.status === 1 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {addr.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {addr.isDefault && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="text-gray-600">No addresses available</div>
    )}
  </div>
);
  const userDetails = [
    { label: "ID", value: user.id },
    { label: "Name", value: user.name },
    { label: "Email", value: user.email },
  
    { label: "Role", value: user.role },
    { label: "Created At", value: new Date(user.createdAt).toLocaleDateString() },
    { label: "Updated At", value: new Date(user.updatedAt).toLocaleDateString() },
  ];

  return (
    <>
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">User Details (ID: {user.id})</h2>

       
       <div className="mb-8 flex items-center gap-6">
         <img
          src={`${import.meta.env.VITE_BASE_URL_IMAGE}${user.profile_img}`}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border"
        />
        <div>
          <h3 className="text-lg font-medium text-gray-700">Profile Image</h3>
        </div>
      </div>
  
        {renderSection("User Information", userDetails)}
        {renderAddresses()}
      </div>
      {/* update password form */}
      <div className="p-6 max-w-3xl mx-auto border rounded-lg shadow-md bg-white mt-8">
        <h2 className="text-2xl font-semibold mb-4">Update Password</h2>
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
    </>
  );
};

export default UserDetail;