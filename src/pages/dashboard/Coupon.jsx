import { useState, useEffect, useCallback } from "react";
import React from "react";
import {
  Button,
  Card,
  Dialog,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
  Input,
  Switch,
  Tooltip,
  Spinner,
} from "@material-tailwind/react";
import axios from "axios";
import Cookies from "js-cookie";
import CustomTable from "../../components/CustomTable";
import { TrashIcon } from "@heroicons/react/24/solid";
import Toaster from "../../components/Toaster";



function Coupon() {
  const [leads, setLeads] = useState([]);
  const [couponName, setcouponName] = useState("");
  const [couponType, setCouponType] = useState("1"); // Default to Discount type
  const [credits, setCredits] = useState("");
  const [discountValue, setDiscountValue] = useState(""); // New state for discount value
  const [discountType, setDiscountType] = useState(""); // New state for discount type
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = React.useState(false);

  const token = Cookies.get("token");

  const handleOpen = () => setOpen((cur) => !cur);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    if (!token) return;
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/get-coupon-code`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeads(data.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
    finally{
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchLeads();
  }, [token, fetchLeads]);

  const onDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/delete-coupon-code/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLeads(leads.filter((lead) => lead.id !== id));
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const handleCouponSubmit = async () => {
    setLoading(true);
    try {
      const data = new URLSearchParams();
      data.append("code_name", couponName);
      data.append("type", couponType);
      data.append("credits", credits);
      data.append("discount_value", discountValue); // Add discount value
      data.append("discount_type", discountType); // Add discount type
      data.append("status", "1"); // Default status to active

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/create-coupon-code`,
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchLeads(); // Fetch leads again to include the newly added coupon
      setcouponName(""); // Clear the input fields
      setCouponType("");
      setCredits("");
      setDiscountValue("");
      setDiscountType("");
      handleOpen(); // Close modal after submission
    } catch (error) {
      console.error("Error submitting coupon:", error);
    }
    finally{
      setLoading(false);
    }
  };

  const onToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "1" ? "0" : "1"; // Toggle status
      const data = new URLSearchParams();
      data.append("status", newStatus);

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/update-coupon-code/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the state after successful update
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === id ? { ...lead, status: newStatus } : lead
        )
      );
      // Show toaster notification
      Toaster.show({
        message: `Coupon ${newStatus === "1" ? "activated" : "deactivated"} successfully`,
        type: "success",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      // Show error toaster notification
      Toaster.show({
        message: "Error updating coupon status",
        type: "error",
      });
    }
  };

  const columns = [
    {
      key: "code_name",
      label: "Coupon Name",
      render: (row) => row.code_name,
    },
    {
      key: "type",
      label: "Type",
      render: (row) => (row.type === "1" ? "REFER CODE" : "DISCOUNT"),
    },
    {
      key: "credits",
      label: "Credits",
      render: (row) => row.credits || "N/A",
    },
    {
      key: "discount_value",
      label: "Discount Value",
      render: (row) => row.discount_value || "N/A",
    },
    {
      key: "discount_type",
      label: "Discount Type",
      render: (row) =>
        row.discount_type ? (row.discount_type === "1" ? "FLAT" : "PERCENTAGE") : "N/A",
    },
    {
      key: "created_at",
      label: "Date & Time",
      render: (row) => new Date(row.created_at).toLocaleString(),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Switch
          id={`switch-${row.id}`}
          checked={row.status === "1"}
          onChange={() => onToggleStatus(row.id, row.status)}
          ripple={false}
          className="h-full w-full bg-red-500 checked:bg-[#2ec946]"
          containerProps={{
            className: "w-10 h-4",
          }}
          circleProps={{
            className: "before:hidden left-0.5 border-none",
          }}
        />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div>
          <Tooltip content="Delete">
            <button onClick={() => onDelete(row.id)}>
              <TrashIcon className="h-5 w-5 text-red-500" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h5" color="blue-gray">
              Coupon Codes
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              View All Coupon Codes
            </Typography>
          </div>
          <Button onClick={handleOpen}>Add Coupon</Button>
        </div>
      </CardHeader>

      <CardBody>
      {loading ? (
          <div className="flex justify-center items-center">
            <Spinner className="h-8 w-8 text-blue-500" />
          </div>
        ) : (
          <CustomTable columns={columns} data={leads} />
        )}
      </CardBody>

      <CardFooter className="flex justify-between">
        {/* Pagination Buttons (Add your pagination logic here if needed) */}
      </CardFooter>

      {/* Modal for adding/editing coupon */}
        <Dialog size="xs" open={open} handler={handleOpen}  className="bg-transparent shadow-none">  
          <Card className="mx-auto w-full max-w-[24rem] bg-white">
            <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="gray-300">
            Add Coupon Code
          </Typography>
          <Typography
            className="mb-3 font-normal !important"
            variant="paragraph"
            color="gray"
          >
            Enter the coupon details.
          </Typography>

          {/* Coupon Name */}
            <Input
              label="Coupon Name"
              size="lg"
              value={couponName}
              onChange={(e) => setcouponName(e.target.value.toUpperCase())}
            />

            {/* Coupon Type Selection */}
            <select
              className="w-full p-2 border rounded-lg"
              value={couponType}
              onChange={(e) => setCouponType(e.target.value)}
            >
              <option value="">Select Coupon Type</option>
              <option value="1">Refer Code</option>
              <option value="2">Discount</option>
            </select>

            {/* Show only if 'Refer Code' is selected */}
            {couponType === "1" && (
              <Input
                label="Credits"
                size="lg"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
              />
            )}

            {/* Show only if 'Discount' is selected */}
            {couponType === "2" && (
              <>
                <Input
                  label="Discount Value"
                  size="lg"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                />
                <select
                  className="w-full p-2 border rounded-lg"
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                >
                  <option value="">Select Discount Type</option>
                  <option value="1">Flat</option>
                  <option value="2">Percentage</option>
                </select>
              </>
            )}
          </CardBody>

          <CardFooter className="pt-0">
            <Button variant="gradient" onClick={handleCouponSubmit} fullWidth>
              Add Coupon
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </Card>
  );
}

export default Coupon;
