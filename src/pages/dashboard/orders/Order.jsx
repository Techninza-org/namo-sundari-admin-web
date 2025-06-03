import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Progress,
  Spinner,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import Cookies from "js-cookie";
import CustomTable from "../../../components/CustomTable";
import { useNavigate } from "react-router-dom";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const token = Cookies.get("token");
  const navigate = useNavigate();

  const fetchOrders = useCallback(
    async (page) => {
      if (!token) return;

      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/admin/get-all-orders?page=${page}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        if (data && data.data) {
          // Add index to each order based on pagination
          const ordersWithIndex = data.data.map((order, index) => ({
            ...order,
            index: (page - 1) * 10 + index + 1,
          }));
          setOrders(ordersWithIndex);
          setTotalPages(data.pagination?.total_pages || 1);
        } else if (Array.isArray(data)) {
          // Add index if response is direct array
          const ordersWithIndex = data.map((order, index) => ({
            ...order,
            index: index + 1,
          }));
          setOrders(ordersWithIndex);
          setTotalPages(1);
        } else {
          setOrders([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders. Please try again.");
        setOrders([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) fetchOrders(currentPage);
  }, [token, currentPage, fetchOrders]);

  const deleteOrder = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admin/delete-order/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(orders.filter((order) => order.id !== id));
    } catch (error) {
      console.error("Error deleting order:", error);
      setError("Failed to delete order. Please try again.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/product-order-detail/${id}`);
  };

  const columns = [
    {
      key: "index",
      label: "S.No.",
      render: (row) => <div>{row.index}</div>,
      width: "w-12",
    },
    {
      key: "id",
      label: "Order ID",
      render: (row) => <div>{row.id || "N/A"}</div>,
      width: "w-60",
    },
    {
      key: "user_name",
      label: "Name",
      render: (row) => <div>{row.user?.name || "N/A"}</div>,
      width: "w-48",
    },
    {
      key: "createdAt",
      label: "Order Date",
      render: (row) => (
        <div>
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A"}
        </div>
      ),
      width: "w-40",
    },
    {
      key: "orderStatus",
      label: "Order Status",
      render: (row) => {
        let textColorClass = "text-gray-700";

        if (row.orderStatus === "SUCCESS") {
          textColorClass = "text-green-500 font-medium";
        } else if (row.orderStatus === "FAILED") {
          textColorClass = "text-red-500 font-medium";
        }

        return <div className={textColorClass}>{row.orderStatus || "N/A"}</div>;
      },
      width: "w-36",
    },
    {
      key: "total_amount",
      label: "Total Amount",
      render: (row) => <div>{row.totalAmount || "N/A"}</div>,
      width: "w-32",
    },
    {
      key: "items_count",
      label: "Items Total",
      render: (row) => {
        const totalItems =
          row.orderItems?.reduce((sum, item) => {
            return sum + (item.quantity || 0);
          }, 0) || 0;

        return <div>{totalItems}</div>;
      },
      width: "w-32",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const getStatus = (status) => {
          switch (status) {
            case "CONFIRMED":
              return "Order Confirmed";
            case "PENDING":
              return "Order Pending";
            case "PROCESSING":
              return "Processing";
            case "SHIPPED":
              return "Shipped";
            case "DELIVERED":
              return "Delivered";
            case "CANCELLED":
              return "Cancelled";
            default:
              return "Unknown";
          }
        };

        const getProgress = (status) => {
          switch (status) {
            case "CONFIRMED":
              return { value: 25, color: "blue" };
            case "PROCESSING":
              return { value: 50, color: "orange" };
            case "SHIPPED":
              return { value: 75, color: "amber" };
            case "DELIVERED":
              return { value: 100, color: "green" };
            case "CANCELLED":
              return { value: 0, color: "red" };
            default:
              return { value: 0, color: "gray" };
          }
        };

        const progress = getProgress(row.status);

        return (
          <div className="w-10/12">
            <Typography
              variant="small"
              className="mb-1 block text-xs font-medium text-blue-gray-600">
              {getStatus(row.status)}
            </Typography>
            <Progress
              value={progress.value}
              variant="gradient"
              color={progress.color}
              className="h-1"
            />
          </div>
        );
      },
      width: "w-32",
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Tooltip content="Edit">
            <button onClick={() => handleEdit(row.id)}>
              <PencilIcon className="h-5 w-5 text-blue-500" />
            </button>
          </Tooltip>
          <Tooltip content="Delete">
            <button onClick={() => deleteOrder(row.id)}>
              <TrashIcon className="h-5 w-5 text-red-500" />
            </button>
          </Tooltip>
        </div>
      ),
      width: "w-28",
    },
  ];

  return (
    <Card>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h5" color="blue-gray">
              Orders List
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              View the current active Orders
            </Typography>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner className="h-8 w-8 text-blue-500" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center text-red-500">
            {error}
          </div>
        ) : orders && orders.length > 0 ? (
          <CustomTable columns={columns} data={orders} />
        ) : (
          <div className="flex justify-center items-center text-gray-500">
            No orders available.
          </div>
        )}
      </CardBody>

      <CardFooter className="flex justify-between">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}>
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {currentPage > 3 && (
            <>
              <IconButton
                variant="text"
                size="sm"
                onClick={() => setCurrentPage(1)}>
                1
              </IconButton>
              {currentPage > 4 && <p>...</p>}
            </>
          )}

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = Math.max(1, currentPage - 2) + i;
            if (page > totalPages) return null;
            return (
              <IconButton
                key={page}
                variant="text"
                size="sm"
                onClick={() => setCurrentPage(page)}
                disabled={currentPage === page}>
                {page}
              </IconButton>
            );
          })}

          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && <p>...</p>}
              <IconButton
                variant="text"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}>
                {totalPages}
              </IconButton>
            </>
          )}
        </div>

        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}>
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Order;
