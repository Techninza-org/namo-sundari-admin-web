import { useCallback, useEffect, useState } from "react";
import { Card, CardBody, Tooltip, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

import CustomTable from "@/components/CustomTable";
import {  PlusCircleIcon } from "@heroicons/react/24/solid";
import VendorAssignForm from "./urbanCompoents/VendorAssignForm";
import UpdateOrderStatus from "./urbanCompoents/UpdateOrderStatus";

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = Cookies.get("token");
  const { id: orderId } = useParams();

  const [open, setOpen] = useState(false);
  const [bidId, setBidId] = useState(null);
  


  const handleOpen = useCallback((categoryId, projectTitle, price, id) => {
      console.log(id, projectTitle, price);
  
      const bids = {
        cartId: order.cart_id,
        category_id: categoryId,
        id: id,
        projectTitle: projectTitle,
        price: price,
      };
  
      setOpen(!open);
      setBidId(bids);
      fetchOrder();
      
    }, [order, open]);

  useEffect(() => {
    fetchOrder();
  }, [orderId, token]);
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL_SOOPRS}/get-order/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          setOrder(response.data.data);
        } else {
          setError("Failed to fetch order details.");
        }
      } catch (err) {
        setError(`Error fetching order data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };





  const columns = [
    {
      key: "image",
      label: "Image",
      render: (row) => (
        <img
          src={`${import.meta.env.VITE_BASE_URL_IMAGE}${row.image}`}
          alt="Product"
          className="w-16 h-16 object-cover rounded-md"
        />
      ),
    },
    { key: "id", label: "Product ID", render: (row) => row.product_id },
    { key: "name", label: "Product Name", render: (row) => row.title },
    { key: "quantity", label: "Quantity", render: (row) => row.quantity },
    {
      key: "price",
      label: "Price",
      render: (row) => `${row.price.toFixed(2)}`,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs ${row.vendor === 0 ? "bg-yellow-500 text-white" : "bg-green-500 text-white"}`}>
          {row.vendor === 0 ? "Not Assigned" : "Assigned"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="px-4 py-2 flex gap-2">
          <Tooltip content="Add Bid">
            <button onClick={() => handleOpen(row.category_id, row.title, row.price, row.id)}>
              <PlusCircleIcon className="h-5 w-5 text-green-500" />
            </button>
          </Tooltip>
        </div>
      ),
      width: "w-32",
    },
  ];

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  
  return (
    <Card className="w-full max-w-5xl mx-auto mt-5 p-6 shadow-lg">
      <CardBody>
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div>
            <Typography variant="h5" color="blue-gray" className="font-bold">
              Order Details
            </Typography>
            <div className="mt-3 space-y-2 border rounded-lg p-4">
              <Typography>
                <span className="font-semibold">Order ID:</span>{" "}
                {order?.order_id}
              </Typography>
              <Typography>
                <span className="font-semibold">Username:</span>{" "}
                {order?.username}
              </Typography>
              <Typography>
                <span className="font-semibold">Email:</span> {order?.email}
              </Typography>
              <Typography>
                <span className="font-semibold">Address:</span> {order?.address}
              </Typography>
              <Typography>
                <span className="font-semibold">Total Amount:</span>{" "}
                {order?.total_amount}
              </Typography>
              <Typography>
                <span className="font-semibold">Payment ID:</span>{" "}
                {order?.payment_id}
              </Typography>
              <Typography>
                <span className="font-semibold">Created At:</span>{" "}
                {order?.created_at
                  ? new Date(order.created_at).toLocaleString()
                  : "N/A"}
              </Typography>
            </div>
          </div>
            <div>
            <Typography variant="h5" color="blue-gray" className="font-bold mb-3">
            Update Order Status
            </Typography>
              <UpdateOrderStatus orderId={orderId} assignstatus={order.status}  />
            </div>
        </div>

        <div className="mt-5">
          <Typography variant="h6" className="mb-4 font-bold">
            Products
          </Typography>
          {order?.products && order.products.length > 0 ? (
            <CustomTable columns={columns} data={order.products} />
          ) : (
            <p>No products found in this order.</p>
          )}
        </div>
      </CardBody>
        <VendorAssignForm open={open} handleOpen={handleOpen} bidId={bidId}/>
    </Card>
    
  );
};

export default OrderDetail;
