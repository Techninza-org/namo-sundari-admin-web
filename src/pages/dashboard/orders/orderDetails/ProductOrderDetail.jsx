import { useState, useEffect } from "react";

import axios from "axios";
import GeneralInfo from "./components/GeneralInfo";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
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
  const { id } = useParams();



  const token = Cookies.get("token");



  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/get-order/${id}`, {
          headers: {
            Authorization: 'Bearer ' + token,
          }
        });

        if (response.status !== 200) {
          throw new Error('Failed to fetch order data');
        }

        const data = response.data;
        console.log(data, 'data');


        // Map the API response to match your component's expected structure
        const enhancedData = {
          ...data,
          // Map orderItems to cart_items to match your component's expectations
          cart_items: data.orderItems.map(item => ({
            ...item,
            selectedVendor: item.vendor || null,
            isEditingVendor: false
          })),
          // Map totalAmount to total_amount (camelCase to snake_case)
          // total_amount: data.totalAmount
        };
        console.log(enhancedData, 'eee');


        setOrderData(enhancedData);
      } catch (err) {
        setError('Failed to fetch order data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [token, id]);
  const updateOrderStatus = (newStatus) => {
    setOrderData((prevData) => ({
      ...prevData,
      status: newStatus,
    }));
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <OrderHeader
          orderData={orderData}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <OrderSummary
            orderData={orderData}
          />
         
            <CustomerInformation customerData={orderData} />
          

          <div className="mt-6">
            <Address addressData={orderData.address} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">



          <OrderItems
            items={orderData.orderItems}
            totalAmount={orderData.totalAmount}
          />



        </div>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">


          <div className="mt-6">
            <GeneralInfo orderData={orderData} />
          </div>




        </div>


      </div>
    </div>
  );
};

export default ProductOrderDetail;
