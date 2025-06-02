import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Toaster, {
  showErrorToast,
  showSuccessToast,
} from "@/components/Toaster";
import Select from "react-select";

const VendorAssignForm = ({ open, handleOpen, bidId }) => {
  console.log("Received bidId:", bidId); // Debugging log

  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");
  const [services, setServices] = useState([]);
  const [bidData, setBidData] = useState({
    cart_id: "",
    itemId: "",
    vendorId: "",
  });

  // Update bidData whenever bidId changes
  useEffect(() => {
    if (bidId) {
      console.log("Updating bidData with bidId:", bidId); // Debugging log
      setBidData({
        cart_id: bidId.cartId || "",
        itemId: bidId.id || "",
        vendorId: bidId.id || "",
      });
    }
  }, [bidId]); // Ensure deep comparison

  // Fetch vendors based on category_id
  useEffect(() => {
    if (!bidId?.category_id) return;

    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/get-all-vendors/${bidId.category_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setServices(
          response.data.data.map((service) => ({
            value: service.id,
            label: `${service.name} - ${service.email}`,
          }))
        );
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [bidId?.category_id, token]);

  // Handle vendor selection
  const handleServiceChange = (selectedOption) => {
    setBidData((prev) => ({ ...prev, vendorId: selectedOption.value }));
  };

  // Submit form
  const submitBid = async () => {
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      Object.keys(bidData).forEach((key) => {
        formData.append(key, bidData[key]);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/set-vendor-for-order-item`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 200) {
        setBidData((prev) => ({ ...prev, vendorId: "" })); // Reset vendorId only
        showSuccessToast(response.data.msg);
      } else {
        showErrorToast(response.data.msg);
      }
      handleOpen();
    } catch (error) {
      showErrorToast("Failed to submit bid.");
      console.error("Error submitting bid:", error);
    }
    setLoading(false);
  };

  return (
    <div>
      <Toaster />
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Assign Vendor</DialogHeader>
        <div className="flex justify-between px-5">
          <Typography className="font-normal">
            {bidId?.projectTitle || "No Title"}
          </Typography>
          <Typography className="font-normal">
            {bidId ? `${bidId.price} Rupees` : "No Range"}
          </Typography>
        </div>
        <DialogBody>
          <div className="grid grid-cols-1 gap-4">
            <Select
              options={services}
              onChange={handleServiceChange}
              placeholder="Select Vendor"
              isSearchable
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={handleOpen} className="mr-2">
            Cancel
          </Button>
          <Button variant="text" onClick={submitBid} disabled={loading}>
            {loading ? <Spinner className="h-4 w-4" /> : "Submit"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

VendorAssignForm.propTypes = {
  open: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
  bidId: PropTypes.shape({
    id: PropTypes.string,
    cartId: PropTypes.string,
    category_id: PropTypes.string,
    projectTitle: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

export default VendorAssignForm;
