import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import Cookies from "js-cookie";

function Setting() {
  const [settings, setSettings] = useState({
    vendorCommission: "",
    plateformfee: "",
    gst: "",
    deliveryFee: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = Cookies.get("token");

  
const fetchSettings = useCallback(async () => {
  if (!token) return;

  setInitialLoading(true);
  setError(null);
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/admin/get-settings`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    // Since your API returns { success: true, message: "...", data: {...} }
    // You need to access response.data.data
    if (response.data && response.data.data) {
      setSettings({
        vendorCommission: response.data.data.vendorCommission?.toString() || "",
        plateformfee: response.data.data.plateformfee?.toString() || "",
        gst: response.data.data.gst?.toString() || "",
        deliveryFee: response.data.data.deliveryFee?.toString() || "",
      });
    }
  } catch (error) {
    console.error("Error fetching settings:", error);
    // Don't show error if it's a 404 (settings might not exist yet)
    if (error.response?.status !== 404) {
      setError("Failed to fetch settings. Default values will be used.");
    }
  } finally {
    setInitialLoading(false);
  }
}, [token]);

  useEffect(() => {
    if (token) fetchSettings();
  }, [token, fetchSettings]);

  const handleInputChange = (name, value) => {
    // Ensure only positive numbers
    const numericValue = parseFloat(value);
    if (value === "" || (!isNaN(numericValue) && numericValue >= 0)) {
      setSettings(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError("No authentication token found.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Convert string values to numbers and validate
      const payload = {
        vendorCommission: parseFloat(settings.vendorCommission) || 0,
        plateformfee: parseFloat(settings.plateformfee) || 0,
        gst: parseFloat(settings.gst) || 0,
        deliveryFee: parseFloat(settings.deliveryFee) || 0,
      };

      // Validate ranges (optional - adjust as needed)
      if (payload.vendorCommission > 100) {
        setError("Vendor commission cannot exceed 100%");
        return;
      }
      if (payload.gst > 100) {
        setError("GST cannot exceed 100%");
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/set-settings`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Settings updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error updating settings:", error);
      setError(
        error.response?.data?.message || 
        "Failed to update settings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    fetchSettings(); // Reset to server values
    setError(null);
    setSuccess(null);
  };

  if (initialLoading) {
    return (
      <Card>
        <CardBody className="flex justify-center items-center min-h-[400px]">
          <Spinner className="h-8 w-8 text-blue-500" />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div>
          <Typography variant="h5" color="blue-gray">
            Platform Settings
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            Configure commission rates, fees, and other platform settings
          </Typography>
        </div>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Typography className="text-blue-gray-900 font-medium mb-2">
                Vendor Commission (%)
              </Typography>
              <Input
                type="number"
                value={settings.vendorCommission}
                onChange={(e) => handleInputChange("vendorCommission", e.target.value)}
                placeholder="Enter vendor commission percentage"
                min="0"
                max="100"
                step="0.01"
                className="!border-blue-gray-200 focus:!border-blue-500"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>

            <div>
              <Typography className="text-blue-gray-900 font-medium mb-2">
                Platform Fee (%)
              </Typography>
              <Input
                type="number"
                value={settings.plateformfee}
                onChange={(e) => handleInputChange("plateformfee", e.target.value)}
                placeholder="Enter platform fee percentage"
                min="0"
                step="0.01"
                className="!border-blue-gray-200 focus:!border-blue-500"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>

            <div>
              <Typography className="text-blue-gray-900 font-medium mb-2">
                GST (%)
              </Typography>
              <Input
                type="number"
                value={settings.gst}
                onChange={(e) => handleInputChange("gst", e.target.value)}
                placeholder="Enter GST percentage"
                min="0"
                max="100"
                step="0.01"
                className="!border-blue-gray-200 focus:!border-blue-500"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>

            <div>
              <Typography className="text-blue-gray-900 font-medium mb-2">
                Delivery Fee (₹)
              </Typography>
              <Input
                type="number"
                value={settings.deliveryFee}
                onChange={(e) => handleInputChange("deliveryFee", e.target.value)}
                placeholder="Enter delivery fee amount"
                min="0"
                step="0.01"
                className="!border-blue-gray-200 focus:!border-blue-500"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <Typography color="red" className="text-sm">
                {error}
              </Typography>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <Typography color="green" className="text-sm">
                {success}
              </Typography>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading && <Spinner className="h-4 w-4" />}
              Update Settings
            </Button>
            
            <Button
              type="button"
              variant="outlined"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

export default Setting;