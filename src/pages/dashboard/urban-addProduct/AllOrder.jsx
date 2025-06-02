import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Progress,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import Cookies from "js-cookie";

import { useNavigate } from "react-router-dom"; // Import useNavigate
// import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

import CustomTable from "@/components/CustomTable";

function AllOrder() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // const [search, setSearch] = useState(""); // Added search filter
  const [isLoading, setIsLoading] = useState(false);
  // State for single filter dropdown
//   const [filter, setFilter] = useState("");

  const token = Cookies.get("token");
 

  const navigate = useNavigate(); // Initialize navigate

  const fetchOrders = useCallback(
    async (page) => {
      if (!token) return;
      setIsLoading(true);

      const form = new URLSearchParams();

      // Added search filter
    //   form.append("search", search);

    //   // If-else condition based on filter value
    //   if (filter === "client") {
    //     form.append("is_buyer", "1");
    //     // Add any additional form data for "client"
    //   } else if (filter === "professional") {
    //     form.append("is_buyer", "0");
    //     // Add any additional form data for "bugery1"
    //   } else if (filter === "subscriber") {
    //     form.append("is_subscriber", "1");
    //     // Add any additional form data for "bugery1"
    //   } else if (filter === "agency") {
    //     form.append("is_company", "1");
    //     // Add any additional form data for "bugery1"
    //   }
      form.append("page", page);
      form.append("limit", 10);

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_URL_SOOPRS}/get-all-orders-uc`,
         
          form.toString(),
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        console.log("data", data.data);
        setUsers(data.data);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching users:", error);
        setIsLoading(false);
      }
      setIsLoading(false);
    },
    [token,]
  );

  useEffect(() => {
    if (token) fetchOrders(currentPage);
  }, [token, currentPage, fetchOrders]);

  // const handleSearchChange = (e) => {
  //   setSearch(e.target.value);
  // };

//   const handleFilterChange = (e) => {
//     setFilter(e.target.value); // Update filter state
//   };

  // const handleSearch = () => {
  //   // Only fetch users when the search button is clicked
  //   setCurrentPage(1); // Reset to the first page on new search
  //   fetchOrders(1); // Fetch users for the first page with the current search and filter
  // };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/order/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/order-detail/${id}`); // Redirect to detail page with ID
  };

  const columns = [
    {
      key: "id",
      label: "Order ID",
      render: (row) => <div title={row.id}>{row.id || "N/A"}</div>,
      width: "w-52",
    },
    {
      key: "date",
      label: "Date",
      render: (row) => <div title={row.date}>{row.date || "N/A"}</div>,
      width: "w-52",
    },
    {
      key: "username",
      label: "Username",
      render: (row) => <div title={row.username}>{row.username || "N/A"}</div>,
      width: "w-52",
    },
    {
      key: "email",
      label: "Email",
      render: (row) => <div title={row.email}>{row.email || "N/A"}</div>,
      width: "w-52",
    },
    {
      key: "cart_id",
      label: "Cart ID",
      render: (row) => <div title={row.cart_id}>{row.cart_id || "N/A"}</div>,
      width: "w-52",
    },
    {
      key: "time_slot_id",
      label: "Time Slot ID",
      render: (row) => <div title={row.time_slot_id}>{row.time_slot_id || "N/A"}</div>,
      width: "w-48",
    },
    {
      key: "order_status",
      label: "Status",
      render: (row) => {
        let statusText = "Not Assigned";
        let progressValue = 50;
        let progressColor = "red";

        if (row.order_status === 1) {
          statusText = "Partial Assigned";
          progressValue = 50;
          progressColor = "yellow";
        } else if (row.order_status === 2) {
          statusText = "Complete Assigned";
          progressValue = 100;
          progressColor = "green";
        }

        return (
          <div className="w-10/12">
            <Typography
              variant="small"
              className="mb-1 block text-xs font-medium text-blue-gray-600"
            >
              {statusText}
            </Typography>
            <Progress
              value={progressValue}
              variant="gradient"
              color={progressColor}
              className="h-1"
            />
          </div>
        );
      },
      width: "w-32",
    },
    {
      key: "total_amount",
      label: "Total Amount",
      render: (row) => <div>{row.total_amount}</div>,
      width: "w-32",
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="px-4 py-2 flex gap-2">
          <Tooltip content="Edit">
            <button onClick={() => handleEdit(row.id)}>
              <PencilIcon className="h-5 w-5 text-blue-500" />
            </button>
          </Tooltip>
          <Tooltip content="Delete">
            <button onClick={() => handleDelete(row.id)}>
              <TrashIcon className="h-5 w-5 text-red-500" />
            </button>
          </Tooltip>
        </div>
      ),
      width: "w-32",
    },
  ];

  return (
    <Card>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h5" color="blue-gray">
              Order List
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              View the current Orders
            </Typography>
          </div>
          <div className="flex gap-2">

            {/* <select
              onChange={handleFilterChange}
              value={filter}
              className="border border-slate-200 rounded-md  p-1 shadow-sm "
            >
              <option value="">Select Filter</option>
              <option value="client">Client</option>
              <option value="professional">professional</option>
              <option value="subscriber">Subscriber</option>
              <option value="agency">Agency</option>
            </select> */}
            {/* <div className="relative flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by name"
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              />
             
            </div> */}
         
         
          </div>
        </div>
      </CardHeader>

      <CardBody>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <CustomTable
            columns={columns}
            data={users}
          
          />
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

export default AllOrder;