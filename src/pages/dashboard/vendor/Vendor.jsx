import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Spinner,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import Cookies from "js-cookie";
import CustomTable from "../../../components/CustomTable";
import { useNavigate } from "react-router-dom";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { ViewIcon } from "lucide-react";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = Cookies.get("token");
  const navigate = useNavigate();

  const fetchVendors = useCallback(
    async (page) => {
      if (!token) return;

      setLoading(true);
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/admin/all-vendors?page=${page}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        setVendors(data.vendors);
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
    navigate(`/vendor-detail/${id}`);
  };

  const handleOrder = (id) => {
    navigate(`/vendor-order/${id}`);
  };

  // Add numbering to the data before passing to CustomTable
  const numberedVendors = vendors.map((vendor, index) => ({
    ...vendor,
    rowNumber: (currentPage - 1) * 10 + index + 1,
  }));

  const columns = [
    {
      key: "rowNumber",
      label: "S.No.",
      render: (row) => <div>{row.rowNumber}</div>,
      width: "w-12",
    },
    {
      key: "img_url",
      label: "Profile",
      render: (row) => (
        <div className="w-10 h-10 rounded-full overflow-hidden">
          {row.img_url ? (
            <img
              src={`${import.meta.env.VITE_BASE_URL_IMAGE}/${row.img_url}`}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              N/A
            </div>
          )}
        </div>
      ),
      width: "w-20",
    },
    {
      key: "name",
      label: "Name",
      render: (row) => <div>{row.name || "N/A"}</div>,
      width: "w-48",
    },
    {
      key: "p_mobile",
      label: "Mobile",
      render: (row) => <div>{row.p_mobile || "N/A"}</div>,
      width: "w-40",
    },
    {
      key: "email",
      label: "Email",
      render: (row) => <div>{row.email || "N/A"}</div>,
      width: "w-60",
    },
    {
      key: "dob",
      label: "DOB",
      render: (row) => {
        const formatDate = (dateString) => {
          if (!dateString) return "N/A";
          const date = new Date(dateString);
          const day = String(date.getUTCDate()).padStart(2, "0");
          const month = date.getUTCMonth() + 1;
          const year = date.getUTCFullYear();
          return `${day}/${month}/${year}`;
        };
        return <div>{formatDate(row.dob)}</div>;
      },
      width: "w-32",
    },
    {
      key: "gender",
      label: "Gender",
      render: (row) => <div>{row.gender || "N/A"}</div>,
      width: "w-32",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <div className="flex items-center">
          <div
            className={`h-2.5 w-2.5 rounded-full mr-2 ${
              row.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
            }`}></div>
          {row.status}
        </div>
      ),
      width: "w-32",
    },
    {
      key: "actions",
      label: "Order",
      render: (row) => (
        <div className="flex gap-2">
          <Tooltip content="order">
            <button onClick={() => handleOrder(row.id)}>
              <ViewIcon className="h-5 w-5 text-blue-500" />
            </button>
          </Tooltip>
        </div>
      ),
      width: "w-28",
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
              Vendor List
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              View the current active vendors
            </Typography>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner className="h-8 w-8 text-blue-500" />
          </div>
        ) : (
          <CustomTable columns={columns} data={numberedVendors} />
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

export default Vendors;
