import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Toaster, { showSuccessToast, showErrorToast } from "../../../components/Toaster";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import Cookies from "js-cookie";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AddSubscriber() {
  const { id } = useParams();
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    area_code: "",
    organisation: "",
    wallet: 0,
    country: "",
    listing_about: "",
    is_buyer: 0,
    is_company: 0,
    status: 1,
    is_subscriber: 0,
    is_verified: 0,
    is_kyc_verified: 0,
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const token = Cookies.get("token");

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/get-user/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }, [token, id]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: [
        "is_buyer", "is_company", "status", "is_subscriber", "is_verified", "is_kyc_verified"
      ].includes(name) ? Number(value) : value,
    }));
  };

  const validateForm = () => {
    if (!user.name.trim()) return showErrorToast("Name is required.");
    if (!user.email.trim()) return showErrorToast("Email is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) return showErrorToast("Enter a valid email.");
    if (!user.mobile.trim()) return showErrorToast("Mobile number is required.");
    if (!user.city.trim()) return showErrorToast("City is required.");
    if (user.wallet < 0 || isNaN(user.wallet)) return showErrorToast("Wallet balance cannot be negative.");
    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/update-user/${id}`,
        user,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      showSuccessToast("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      showErrorToast("Failed to update user.");
    }
  };

  return (
    <>
      <Toaster />
      <div className="max-w-4xl mx-auto mt-5 px-4">
        <Card color="transparent" shadow={false} className="p-6 border border-gray-300 shadow-sm rounded-2xl">
          <Typography variant="h4" color="blue-gray">Update User</Typography>
          <form onSubmit={handleUpdate} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="flex flex-col">
              
              <Typography variant="h6">Name</Typography>
              <Input size="lg" name="name" value={user.name}  className="border border-gray-500 !border-t-gray-500 focus:!border-gray-700 px-3 py-2 focus:border-t-0 focus:outline-none focus:ring-0" onChange={handleChange} placeholder="Enter Name" />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <Typography variant="h6">Email</Typography>
              <Input size="lg" name="email" value={user.email}  className="border border-gray-500 !border-t-gray-500 focus:!border-gray-700 px-3 py-2 focus:border-t-0 focus:outline-none focus:ring-0" onChange={handleChange} placeholder="Enter Email" />
            </div>

            {/* Mobile */}
            <div className="flex flex-col">
              <Typography variant="h6">Mobile</Typography>
              <Input size="lg" name="mobile" value={user.mobile}  className="border border-gray-500 !border-t-gray-500 focus:!border-gray-700 px-3 py-2 focus:border-t-0 focus:outline-none focus:ring-0" onChange={handleChange} placeholder="Enter Mobile" />
            </div>

            {/* Wallet */}
            <div className="flex flex-col">
              <Typography variant="h6">Wallet Credit</Typography>
              <Input type="number" size="lg" name="wallet"  className="border border-gray-500 !border-t-gray-500 focus:!border-gray-700 px-3 py-2 focus:border-t-0 focus:outline-none focus:ring-0" value={user.wallet} onChange={handleChange} placeholder="Enter Credit Amount" />
            </div>

            {/* Start Date */}
            <div className="flex flex-col">
              <Typography variant="h6">Start Date</Typography>
              <DatePicker className="border p-2 rounded-lg w-full" selected={startDate} onChange={setStartDate} />
            </div>

            {/* End Date */}
            <div className="flex flex-col">
              <Typography variant="h6">End Date</Typography>
              <DatePicker className="border p-2 rounded-lg w-full" selected={endDate} onChange={setEndDate} />
            </div>
            <div className="flex flex-col">
              
              <Typography variant="h6">Subscrition Price</Typography>
              <Input size="lg" name="name" value={user.name}  className="border border-gray-500 !border-t-gray-500 focus:!border-gray-700 px-3 py-2 focus:border-t-0 focus:outline-none focus:ring-0" onChange={handleChange} placeholder="Enter Name" />
            </div>


            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" className="mt-4 w-full md:w-auto">Update User</Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

export default AddSubscriber;
