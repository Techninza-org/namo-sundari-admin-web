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
import { useParams } from "react-router-dom";

function VendorOrder() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = Cookies.get("token");
  const navigate = useNavigate();
    const { id } = useParams(); // Get the user ID from the URL parameters

  const fetchVendors = useCallback(
    async (page) => {
      if (!token) return;

      setLoading(true);
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/admin/all-vendor-cart-items/${id}?page=${page}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        console.log("data", data.data);
        setVendors(data.data);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) fetchVendors(currentPage);
  }, [token, currentPage, fetchVendors]);

  const deleteVendor = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admin/delete-vendor/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVendors(vendors.filter((vendor) => vendor.id !== id));
    } catch (error) {
      console.error("Error deleting vendor:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/product-order-detail/${id}`);
  };

  const columns = [
    {
      key: "order_id",
      label: "Order ID",
      render: (row) => <div>{row.order.razorpay_order_id || "N/A"}</div>,
      width: "w-60",
    },
    {
      key: "user_name",
      label: "Name",
      render: (row) => <div>{row.user.name || "N/A"}</div>,
      width: "w-48",
    },
    {
      key: "user_mobile",
      label: "Mobile",
      render: (row) => <div>{row.user.mobile || "N/A"}</div>,
      width: "w-40",
    },
    {
      key: "total_amount",
      label: "Total Amount",
      render: (row) => <div>{row.order.total_amount || "N/A"}</div>,
      width: "w-32",
    },

    {
      key: "status",
      label: "Status",
      render: (row) => {
        const getStatus = (status) => {
          switch (status) {
            case 0:
              return "Order Placed";
            case 1:
              return "Partner Assigned";
            case 2:
              return "On the way";
            case 3:
              return "Started";
            case 4:
              return "Completed";
            default:
              return "Pending";
          }
        };
        return (
          <div className="w-10/12">
            <Typography
              variant="small"
              className="mb-1 block text-xs font-medium text-blue-gray-600"
            >
              {getStatus(row.order.status)}
            </Typography>
            <Progress
              value={row.status === 4 ? 100 : row.status * 25}
              variant="gradient"
              color={row.status === 4 ? "green" : "red"}
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
            <button onClick={() => handleEdit(row.order.id)}>
              <PencilIcon className="h-5 w-5 text-blue-500" />
            </button>
          </Tooltip>
          <Tooltip content="Delete">
            <button onClick={() => deleteVendor(row.id)}>
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
              Vendor Orders List
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
        ) : vendors.length > 0 ? (
          <CustomTable columns={columns} data={vendors} />
        ) : (
          <div className="flex justify-center items-center text-gray-500">
            No vendors available.
          </div>
        )}
      </CardBody>

      <CardFooter className="flex justify-between">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {currentPage > 3 && (
            <>
              <IconButton
                variant="text"
                size="sm"
                onClick={() => setCurrentPage(1)}
              >
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
                disabled={currentPage === page}
              >
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
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </IconButton>
            </>
          )}
        </div>

        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}

export default VendorOrder;
