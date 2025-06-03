import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Switch,
  Spinner,
  Textarea,
} from "@material-tailwind/react";
import axios from "axios";
import Cookies from "js-cookie";
import CustomTable from "../../../components/CustomTable";
import { TrashIcon } from "@heroicons/react/24/solid";
import Toaster, {
  showSuccessToast,
  showErrorToast,
} from "../../../components/Toaster";
import UpdateMainCategory from "./updateAllCetogorymodal/UpdateMainCategory";
import { Edit } from "lucide-react";

const MainCategory = () => {
  const [leads, setLeads] = useState([]);
  const [mainCategory, setMainCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadigSubmit, setLoadigSubmit] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const token = Cookies.get("token");

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    if (!token) return;
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/get-all-main-categories`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeads(data.categories);
    } catch (error) {
      console.error("Error fetching leads:", error);
      showErrorToast(
        error.response?.data?.message || "Failed to fetch categories"
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchLeads();
  }, [token, fetchLeads]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCouponSubmit = async () => {
    setLoadigSubmit(true);
    try {
      const formData = new FormData();
      formData.append("name", mainCategory);
      formData.append("description", description);
      if (image) formData.append("image", image);

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/add-main-category`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSuccessToast("Category added successfully");
      fetchLeads();
      setMainCategory("");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error("Error submitting category:", error);
      showErrorToast(error.response?.data?.message || "Failed to add category");
    } finally {
      setLoadigSubmit(false);
    }
  };

  const onToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin/category-status`,
        { status: newStatus, id: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === id ? { ...lead, status: newStatus } : lead
        )
      );
      showSuccessToast("Category status updated");
    } catch (error) {
      console.error("Error updating status:", error);
      showErrorToast(
        error.response?.data?.message || "Failed to update status"
      );
    }
  };

  const handleDelete = async (id) => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("No token found. User may not be authenticated.");
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admin/delete-main-category/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchLeads();
      showSuccessToast("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      showErrorToast(
        error.response?.data?.message || "Failed to delete category"
      );
    }
  };

  const columns = [
    {
      key: "index",
      label: "S.No.",
      render: (row) => row.index,
    },
    {
      key: "imgUrl",
      label: "Image",
      render: (row) => (
        <img
          src={`${import.meta.env.VITE_BASE_URL_IMAGE}${row.imgUrl}`}
          alt="image"
          className="w-16 h-16 object-cover rounded-md"
        />
      ),
    },
    {
      key: "name",
      label: "Main Category",
      render: (row) => row.name,
    },
    {
      key: "description",
      label: "Description",
      render: (row) => row.description,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Switch
          id={`switch-${row.id}`}
          checked={row.status === 1}
          onChange={() => onToggleStatus(row.id, row.status)}
        />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button size="sm" onClick={() => handleEditClick(row)}>
            <Edit className="h-5 w-5 text-blue-500" />
          </button>
          <button size="sm" onClick={() => handleDelete(row.id)}>
            <TrashIcon className="h-5 w-5 text-red-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Toaster />
      <div className="flex flex-col lg:flex-row gap-6 mt-10 px-4">
        {/* Left Side - Form */}
        <Card className="p-4 w-full lg:w-1/3 shadow-lg">
          <Typography variant="h5" className="mb-4 text-center">
            Add Category
          </Typography>
          <CardBody className="space-y-4">
            <Input
              label="Enter Main Category"
              value={mainCategory}
              onChange={(e) => setMainCategory(e.target.value)}
              className="w-full"
            />
            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-24 p-2 border rounded-lg"
            />
            <div className="w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md mx-auto"
              />
            )}
          </CardBody>
          <CardFooter className="text-center">
            <Button
              onClick={handleCouponSubmit}
              disabled={loadigSubmit}
              className="w-full">
              {loadigSubmit ? <Spinner className="h-5 w-5" /> : "Add Category"}
            </Button>
          </CardFooter>
        </Card>

        {/* Right Side - Table */}
        <Card className="w-full lg:w-2/3 shadow-lg">
          <Typography variant="h5" className="mb-4 text-center">
            Categories
          </Typography>
          <CardBody>
            {loading ? (
              <div className="flex justify-center">
                <Spinner className="h-8 w-8 text-blue-500" />
              </div>
            ) : (
              <CustomTable
                columns={columns}
                data={leads.map((item, idx) => ({
                  ...item,
                  index: idx + 1,
                }))}
              />
            )}
          </CardBody>
        </Card>

        <UpdateMainCategory
          open={editDialogOpen}
          handleOpen={() => setEditDialogOpen(false)}
          categoryData={selectedCategory}
          onUpdateSuccess={() => {
            setEditDialogOpen(false);
            fetchLeads();
          }}
        />
      </div>
    </>
  );
};

export default MainCategory;
