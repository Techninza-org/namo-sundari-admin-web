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
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

import AddCustomBid from "./addCustomBid";
import { ViewIcon } from "lucide-react";

function Users() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = Cookies.get("token");
  const [open, setOpen] = useState(false);
  const [bidId, setBidId] = useState(null);
  


  const handleOpen = (id,projectTitle,min,max) =>{

    const bids ={
      id:id,
      projectTitle:projectTitle,
      min:min,
      max:max
    }

    setOpen(!open);
    setBidId(bids);
   

  } 
  


  const navigate = useNavigate(); // Initialize navigate

  const fetchLeads = useCallback(
    async (page) => {
      if (!token) return;
  
  
  
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/all-users?page=${page}&limit=10`,
         
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        console.log("leads", data.users);
        setLeads(data.users);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );
  
  useEffect(() => {
    if (token) fetchLeads(currentPage);
  }, [token, currentPage, fetchLeads]);

  

  const deleteLead = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(leads.filter((lead) => lead.id !== id));
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/user-detail/${id}`); // Redirect to detail page with ID
  };
  const handleOrder = (id) => {
    navigate(`/user-order/${id}`); // Redirect to order page with ID

  };

  const columns = [
    // {
    //   key: "profile_img",
    //   label: "Profile",
    //   render: (row) => (
    //     <div className="w-10 h-10 rounded-full overflow-hidden">
    //       {row.profile_img ? (
    //         <img
    //           src={`${import.meta.env.VITE_BASE_URL_IMAGE}${row.profile_img}`}
    //           alt="Profile"
    //           className="object-cover w-full h-full"
    //         />
    //       ) : (
    //         <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
    //           N/A
    //         </div>
    //       )}
    //     </div>
    //   ),
    //   width: "w-20",
    // },
    {
      key: "name",
      label: "Name",
      render: (row) => <div>{row.name || "N/A"}</div>,
      width: "w-48",
    },
   
    {
      key: "email",
      label: "Email",
      render: (row) => <div>{row.email || "N/A"}</div>,
      width: "w-60",
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
            <button onClick={() => deleteLead(row.id)}>
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
              User List
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              View the current active Users
            </Typography>
          </div>
          {/* <Button variant="gradient">Add New Lead</Button> */}
        </div>
      </CardHeader>

      <CardBody>
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner className="h-8 w-8 text-blue-500" />
          </div>
        ) : (
          <CustomTable columns={columns} data={leads} />
          
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
    
      <AddCustomBid open={open} handleOpen={handleOpen} bidId={bidId} />
    </Card>
  );
}

export default Users;
