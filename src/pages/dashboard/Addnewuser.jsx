import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Toaster, {
  showSuccessToast,
  showErrorToast,
} from "../../components/Toaster";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import Cookies from "js-cookie";

function AddnewSubscriber() {
  const token = Cookies.get("token");

  const [user, setUser] = useState({
    user_id: "",
    plan_id: "",
    purchase_date: "",
    expire_date: "",
    status: 1,
    credits: 0,
    amount: 0,
    type: 0,
  });

  const [professionals, setProfessionals] = useState([]);

  // Fetch professionals list
  const fetchProfessionals = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/get-all-professionals`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfessionals(response.data.data);
      console.log("Professionals fetched:", response.data.data);
    } catch (error) {
      console.error("Error fetching professionals:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Validate form inputs
  const validateForm = () => {
    if (!user.user_id) return showErrorToast("User ID is required.");
    if (!user.plan_id.trim()) return showErrorToast("Plan ID is required.");
    if (!user.purchase_date.trim())
      return showErrorToast("Purchase date is required.");
    if (!user.expire_date.trim())
      return showErrorToast("Expire date is required.");
    if (user.status < 0 || isNaN(user.status))
      return showErrorToast("Status cannot be negative.");
    if (user.credits < 0 || isNaN(user.credits))
      return showErrorToast("Credits cannot be negative.");
    if (user.amount < 0 || isNaN(user.amount))
      return showErrorToast("Amount cannot be negative.");
    if (user.type < 0 || isNaN(user.type))
      return showErrorToast("Type cannot be negative.");
    return true;
  };

  // Handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/add-subscriber`,
        user,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );
      showSuccessToast("Subscriber added successfully!");
    } catch (error) {
      console.error("Error adding subscriber:", error);
      showErrorToast("Failed to add subscriber.");
    }
  };

  return (
    <>
      <Toaster />
      <div className="max-w-4xl mx-auto mt-5 px-4">
        <Card
          color="transparent"
          shadow={false}
          className="p-6 border border-gray-300 shadow-sm rounded-2xl"
        >
          <Typography variant="h4" color="blue-gray">
            Add New User
          </Typography>
          <form
            onSubmit={handleUpdate}
            className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* User Selection */}
            <div className="flex flex-col">
              <Typography variant="h6">Search User</Typography>
              <select
                className="border rounded-md border-gray-500 px-3 py-2 focus:outline-none"
                onChange={(e) => {
                  const selectedUser = professionals.find(
                    (user) => user.id === parseInt(e.target.value)
                  );
                  if (selectedUser) {
                    setUser((prevUser) => ({
                      ...prevUser,
                      user_id: selectedUser.id,
                    }));
                  }
                }}
                value={user.user_id}
              >
                <option value="">
                  <input
                    type="input"
                    className="border rounded-md border-gray-500 px-3 py-2 focus:outline-none"
                    placeholder="Search user"
                    onChange={(e) => {
                      const searchString = e.target.value.toLowerCase();
                      const filteredUsers = professionals.filter(
                        (user) =>
                          user.name.toLowerCase().includes(searchString) ||
                          user.email.toLowerCase().includes(searchString)
                      );
                      filteredUsers(filteredUsers);
                    }}
                  />
                </option>
                {professionals.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Plan Selection */}
            <div className="flex flex-col">
              <Typography variant="h6">Plan</Typography>
              <select
                name="plan_id"
                className="form-select border rounded-md border-gray-500 px-3 py-2 focus:outline-none"
                value={user.plan_id}
                onChange={handleChange}
              >
                <option value="">Select Plan</option>
                <option value="0">Custom</option>
                <option value="1">Standard</option>
                <option value="2">Pro</option>
                <option value="3">Elite</option>
              </select>
            </div>

            {/* Purchase Date */}
            <div className="flex flex-col">
              <Typography variant="h6">Purchase Date</Typography>
              <Input
                type="datetime-local"
                name="purchase_date"
                value={user.purchase_date}
                className="border border-gray-500 px-3 py-2 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            {/* Expire Date */}
            <div className="flex flex-col">
              <Typography variant="h6">Expire Date</Typography>
              <Input
                type="datetime-local"
                name="expire_date"
                value={user.expire_date}
                className="border border-gray-500 px-3 py-2 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <Typography variant="h6">Status</Typography>
              <select
                name="status"
                className="form-select border border-gray-500 px-3 py-2 focus:outline-none"
                value={user.status}
                onChange={handleChange}
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            {/* Credits */}
            <div className="flex flex-col">
              <Typography variant="h6">Credits</Typography>
              <Input
                type="number"
                name="credits"
                value={user.credits}
                className="border border-gray-500 px-3 py-2 focus:outline-none"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <Typography variant="h6">Type</Typography>
              <Input
                type="number"
                name="type"
                value={user.type}
                className="border border-gray-500 px-3 py-2 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            {/* Amount */}
            <div className="flex flex-col">
              <Typography variant="h6">Amount</Typography>
              <Input
                type="number"
                name="amount"
                value={user.amount}
                className="border border-gray-500 px-3 py-2 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-end">
              <Button
                type="submit"
                className="mt-4 w-full md:w-auto bg-blue-500 hover:bg-blue-700"
              >
                Submit
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

export default AddnewSubscriber;
