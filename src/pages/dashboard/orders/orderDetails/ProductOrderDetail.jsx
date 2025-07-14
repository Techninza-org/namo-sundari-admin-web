import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";

import GeneralInfo from "./components/GeneralInfo";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import OrderHeader from "./components/OrderHeader";
import OrderSummary from "./components/OrderSummary";
import OrderItems from "./components/OrderItems";
import CustomerInformation from "./components/CustomerInformation";
import Address from "./components/Address";

const ProductOrderDetail = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shipping, setShipping] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const { id } = useParams();
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/get-order/${id}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch order data");
        }

        const data = response.data;

        const enhancedData = {
          ...data,
          cart_items: data.orderItems.map((item) => ({
            ...item,
            selectedVendor: item.vendor || null,
            isEditingVendor: false,
          })),
        };

        setOrderData(enhancedData);
      } catch (err) {
        setError("Failed to fetch order data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [token, id]);

  const handleShipNow = async () => {
    if (!orderData?.id) {
      setModalContent("❌ Order ID not found. Cannot proceed with shipping.");
      setModalOpen(true);
      return;
    }

    setShipping(true);
    try {
      const formData = new URLSearchParams();
      formData.append("orderId", orderData.id);
      formData.append("weight", "0.5");
      formData.append("height", "5");
      formData.append("breadth", "5");
      formData.append("length", "5");

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/one-click-shiprocket`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("ShipRocket API response:", response.data);

      if (response.status === 200 && response.data) {
        setModalContent(JSON.stringify(response.data, null, 2));
      } else {
        setModalContent(
          `❌ Ship failed: ${response.data?.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Shipping error:", error);
      setModalContent(
        `❌ Failed to ship the order.\n${error?.response?.data?.message || error.message}`
      );
    } finally {
      setModalOpen(true);
      setShipping(false);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <OrderHeader orderData={orderData} />
          <button
            onClick={handleShipNow}
            disabled={shipping}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {shipping ? "Shipping..." : "Ship Now"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <OrderSummary orderData={orderData} />
          <CustomerInformation customerData={orderData} />
          <div className="mt-6">
            <Address addressData={orderData.address} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <OrderItems
            items={orderData.orderItems}
            totalAmount={orderData.totalAmount}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="mt-6">
            <GeneralInfo orderData={orderData} />
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative">
            <h2 className="text-lg font-semibold mb-4">📦 ShipRocket Response</h2>
            <pre className="bg-gray-100 p-3 text-sm rounded max-h-[400px] overflow-y-auto whitespace-pre-wrap">
              {modalContent}
            </pre>
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductOrderDetail;
