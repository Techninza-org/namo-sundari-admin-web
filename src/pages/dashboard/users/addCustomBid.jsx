import PropTypes from "prop-types";
import {
    Button,
    Dialog,
    DialogBody,
    DialogHeader,
    DialogFooter,
    Input,
    Spinner,
    Typography,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Toaster, { showErrorToast, showSuccessToast } from "@/components/Toaster";
import Select from "react-select";

const AddCustomBid = ({ open, handleOpen, bidId  }) => {
    console.log(bidId);
    const [loading, setLoading] = useState(false);
    const token = Cookies.get("token");
    const [services, setServices] = useState([]);
    const [bidData, setBidData] = useState({
        lead_id: bidId?.id || "", // Ensure lead_id is correctly set
        amount: "",
        description: "",
        id: "", // This should hold the selected service ID
    });

    useEffect(() => {
        if (bidId) {
            setBidData((prev) => ({ ...prev, lead_id: bidId.id || "" }));
        }
    }, [bidId]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/get-all-professionals`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setServices(response.data.data.map((service) => ({
                    value: service.id,
                    label: `${service.name} - ${service.email}`,
                })));
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };
        fetchServices();
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBidData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleServiceChange = (selectedOption) => {
        setBidData((prev) => ({ ...prev, id: selectedOption.value })); // Ensure 'id' is updated, not 'service'
    };

    const submitBid = async () => {
        setLoading(true);
        try {
            const formData = new URLSearchParams();
            Object.keys(bidData).forEach((key) => {
                formData.append(key, bidData[key]);
            });

            const response = await axios.post(
                "https://sooprs.com/api2/public/index.php/add_bid",
                formData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );
            if (response.data.status === 200) {
                //clear the form
                setBidData({
                    lead_id: bidId?.id || "",
                    amount: "",
                    description: "",
                    id: "",
                });


                showSuccessToast(response.data.msg);
            } else {
                showErrorToast(response.data.msg);
                setBidData({
                    lead_id: bidId?.id || "",
                    amount: "",
                    description: "",
                    id: "",
                });
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
                <DialogHeader>Submit a Bid</DialogHeader>
                <div className="flex justify-between px-5">
                <Typography className="font-normal">
                {bidId?.projectTitle || "No Title"}
                </Typography>
                <Typography className="font-normal">
                {bidId ? `Min ${bidId.min}- Max ${bidId.max}` : "No Range"}
                </Typography>
                </div>
                <DialogBody>

                    <div className="grid grid-cols-1 gap-4">
                        <Select
                            options={services}
                            onChange={handleServiceChange}
                            placeholder="Select Service"
                            isSearchable
                        />
                        <Input
                            label="Amount"
                            name="amount"
                            type="number"
                            onChange={handleInputChange}
                            value={bidData.amount}
                        />
                        <Input
                            label="Description"
                            name="description"
                            onChange={handleInputChange}
                            value={bidData.description}
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

AddCustomBid.propTypes = {
    open: PropTypes.bool.isRequired,
    handleOpen: PropTypes.func.isRequired,
    bidId: PropTypes.string.isRequired, // Added bidId to propTypes
};

export default AddCustomBid;
