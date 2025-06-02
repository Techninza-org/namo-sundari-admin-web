import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Toaster, {
  showSuccessToast,
  showErrorToast,
} from "../../../components/Toaster";
import { Card, Input, Typography } from "@material-tailwind/react";
import Cookies from "js-cookie";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function AddUserForRole() {
  const token = Cookies.get("token");
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "",
    password: "",
  });

  const [professionals, setProfessionals] = useState([]);

  // Fetch professionals list
  const fetchProfessionals = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/get-all-roles`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfessionals(response.data.data);
      console.log("Roles fetched:", response.data.data);
    } catch (error) {
      console.error("Error fetching professionals:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchProfessionals();
    console.log("Professionals:", professionals);
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
    if (!user.name) return showErrorToast("Name is required.");
    if (!user.email.trim()) return showErrorToast("Email is required.");
    if (!user.mobile.trim())
      return showErrorToast("Mobile number is required.");
    if (!user.password.trim()) return showErrorToast("Password is required.");
    if (!user.role) return showErrorToast("Role is required.");
    return true;
  };

  // Handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/add-user`,
        new URLSearchParams(user),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );
      showSuccessToast("User added successfully!");
    } catch (error) {
      console.error("Error adding user:", error);
      showErrorToast("Failed to add user.");
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
            {/* Role Selection */}
<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <Button variant="outline" role="combobox" aria-expanded={open} className="w-[810px] justify-between">
      {selectedRole
        ? professionals.find((p) => p.id.toString() === selectedRole)?.name
        : "Select Role..."}
      <ChevronsUpDown className="opacity-50" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-[810px] p-0">
    <Command>
      <CommandInput placeholder="Search role..." className="h-9" />
      <CommandList>
        <CommandEmpty>No Role found.</CommandEmpty>
        <CommandGroup>
          {professionals.map((professional) => (
            <CommandItem
              key={professional.id}
              value={professional.id.toString()}
              onSelect={() => {
                setSelectedRole(professional.id.toString());
                setUser((prevUser) => ({
                  ...prevUser,
                  role: professional.id.toString(), // Set only one role
                }));
                setOpen(false);
              }}
            >
              {professional.name}
              <Check
                className={cn(
                  "ml-auto",
                  selectedRole === professional.id.toString() ? "opacity-100" : "opacity-0"
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>
            <div className="flex flex-col"></div>

            {/* Name */}
            <div className="flex flex-col">
              <Typography variant="h6">Name</Typography>
              <Input
                type="text"
                name="name"
                value={user.name}
                className="border border-gray-500 px-3 py-2 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <Typography variant="h6">Email</Typography>
              <Input
                type="email"
                name="email"
                value={user.email}
                className="border border-gray-500 px-3 py-2 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            {/* Mobile */}
            <div className="flex flex-col">
              <Typography variant="h6">Mobile</Typography>
              <Input
                type="text"
                name="mobile"
                value={user.mobile}
                className="border border-gray-500 px-3 py-2 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <Typography variant="h6">Password</Typography>
              <Input
                type="password"
                name="password"
                value={user.password}
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

export default AddUserForRole;
