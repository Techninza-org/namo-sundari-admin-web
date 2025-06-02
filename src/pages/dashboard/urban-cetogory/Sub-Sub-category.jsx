import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Spinner,
  Switch,
} from "@material-tailwind/react";
import Select from "react-select";
import axios from "axios";
import Cookies from "js-cookie";
import CustomTable from "../../../components/CustomTable";
import Toaster, { showSuccessToast, showErrorToast } from "../../../components/Toaster";
import { TrashIcon } from "@heroicons/react/24/solid";
// import { set } from "lodash";
// import { ca } from "date-fns/locale";

const SubSubCategory = () => {
  const [subSubCategories, setsubSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setsubCategories] = useState([]);
  const [mainCategoryId, setMainCategoryId] = useState(null); // Selected main category
  const [subCategoryId, setsubCategoryId] = useState(null);
  const [subCategory, setSubCategory] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const token = Cookies.get("token");

  
  // console.log(mainCategoryId.value, "mainCategoryId");

  const fetchMainCategories = useCallback(async () => {
    setLoading(true);
    if (!token) return;
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/get-categories`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories(data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    if (!token || !mainCategoryId) return; // Fetch only when main category is selected
  
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/get-sub-categories/${
          mainCategoryId ? `${mainCategoryId?.value}` : "0"
        }`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setsubCategories(data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, [token, mainCategoryId]);

  const fetchsubSubCategories = useCallback(async () => {
    setLoading(true);
    if (!token) return;
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/get-sub-sub-categories/${
          subCategoryId ? `/${subCategoryId}` : "0"
        }`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setsubSubCategories(data.data);
    } catch (error) {
      console.error("Error fetching subSubCategories:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCategories();
      fetchsubSubCategories();
      fetchMainCategories();
    }
  }, [token, fetchCategories, fetchsubSubCategories, fetchMainCategories]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubCategorySubmit = async () => {
    if (!mainCategoryId) {
      showErrorToast("Main category is required");
      return;
    }
    if (!subCategoryId) {
      showErrorToast("Subcategory is required");
      return;
    }
    if (!subCategory) {
      showErrorToast("Sub-subcategory name is required");
      return;
    }
    if (!image) {
      showErrorToast("Image is required");
      return;
    }

    setLoadingSubmit(true);
    try {
      const formData = new FormData();

      formData.append("subCategoryId", subCategoryId?.value);
      formData.append("categoryId", mainCategoryId?.value);
      formData.append("name", subCategory);
      if (image) formData.append("image", image);

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/create-sub-sub-category`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showSuccessToast("Sub-subcategory added successfully");

      fetchsubSubCategories(); // Refresh table
      setsubCategoryId(null);
      setMainCategoryId(null);
      setSubCategory("");
      setImage(null);
    } catch (error) {
      showErrorToast("Failed to add sub-subcategory");
      console.error("Error submitting subcategory:", error);
    } finally {
      setLoadingSubmit(false);

    }
  };

  

  const handleStatusToggle = async (id, status) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin/sub-sub-category-status`,
        { id, status: status ? 1 : 0 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showSuccessToast("Status updated successfully");
      fetchsubSubCategories();
    } catch (error) {
      showErrorToast("Failed to update status");
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id) => {
   
    if (!window.confirm("Are you sure you want to delete this subcategory?")) {
      return;
    }

    console.log(id, "id");
    const token = Cookies.get("token");
    if (!token) {
      // Handle the case where the token is not available (e.g., user not authenticated)
      showErrorToast("User not authenticated. Please log in.");
      console.error("No token found. User may not be authenticated.");
      return;
    }

    try {
      // console.log(token, id, "i");

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/delete-sub-sub-category`,
        { id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showSuccessToast("Sub-sub-category deleted successfully");
      fetchsubSubCategories();
    } catch (error) {
      showErrorToast("Failed to delete sub-sub-category");
      console.error("Error deleting subcategory:", error);
    }
  };

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (row) => (
        <img
          src={`${import.meta.env.VITE_BASE_URL_IMAGE}${row.image}`}
          alt="subcategory"
          className="w-16 h-16 object-cover rounded-md"
        />
      ),
    },
    {
      key: "main_category",
      label: "Main Category",
      render: (row) => row.main_category_name,
    },
    {
      key: "sub_category_name",
      label: "Sub Category",
      render: (row) => row.sub_category_name,
    },
    {
      key: "name",
      label: "Sub Sub category",
      render: (row) => row.name,
    },

    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Switch
          checked={row.status === 1}
          onChange={(e) => handleStatusToggle(row.id, e.target.checked)}
        />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button size="sm" onClick={() => handleDelete(row.id)}>
          <TrashIcon className="h-5 w-5 text-red-500" />
        </button>
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
          Add Sub-Sub-category
        </Typography>
    
        <CardBody className="space-y-4">
          {/* Main Category Selection */}
          <Select
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
            value={mainCategoryId}
            onChange={(selectedOption) => {
              setMainCategoryId(selectedOption);
              setsubCategoryId(null); // Reset subcategory when main category changes
              setsubCategories([]); // Clear previous subcategories
            }}

            placeholder="Select Main Category"
          />
        <Select
            options={subCategories.map((sub) => ({ value: sub.id, label: sub.name }))}
            value={subCategoryId}
            onChange={setsubCategoryId}
            placeholder="Select Sub Category"
          />
          <Input
            label=" Enter Sub Sub category"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
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
            onClick={handleSubCategorySubmit}
            disabled={loadingSubmit}
            className="w-full"
          >
            {loadingSubmit ? (
              <Spinner className="h-5 w-5" />
            ) : (
              "Add Subcategory"
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Right Side - Table */}
      <Card className="w-full lg:w-2/3 shadow-lg">
        <Typography variant="h5" className="mb-4 text-center">
          Sub-Sub-Categories Table
        </Typography>
        <CardBody>
          {loading ? (
            <div className="flex justify-center">
              <Spinner className="h-8 w-8 text-blue-500" />
            </div>
          ) : (
            <CustomTable columns={columns} data={subSubCategories} />
          )}
        </CardBody>
      </Card>
    </div>
    </>
  );
};

export default SubSubCategory;
