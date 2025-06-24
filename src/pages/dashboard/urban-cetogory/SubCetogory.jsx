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
  Textarea,
} from "@material-tailwind/react";
import Select from "react-select";
import axios from "axios";
import Cookies from "js-cookie";
import CustomTable from "../../../components/CustomTable";
import { TrashIcon } from "@heroicons/react/24/solid";
import Toaster, {
  showSuccessToast,
  showErrorToast,
} from "../../../components/Toaster";
import { Edit } from "lucide-react";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";

const UpdateSubCategoryModal = ({ open, handleOpen, categoryData, onUpdateSuccess }) => {
  const [mainCategories, setMainCategories] = useState([]);
  const [mainCategoryId, setMainCategoryId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");

  useEffect(() => {
    if (categoryData) {
      setName(categoryData.name);
      setDescription(categoryData.description);
      setPreviewImage(`${import.meta.env.VITE_BASE_URL_IMAGE}${categoryData.imgUrl}`);
      setMainCategoryId({
        value: categoryData.main_category_id,
        label: categoryData.main_category_name
      });
    }
  }, [categoryData]);

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/get-all-main-categories`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMainCategories(data.categories);
      } catch (error) {
        showErrorToast(
          error.response?.data?.message || "Failed to fetch categories"
        );
      }
    };
    fetchMainCategories();
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!mainCategoryId) {
      showErrorToast("Please select a main category");
      return;
    }
    if (!name) {
      showErrorToast("Subcategory name is required");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", categoryData.id);
      formData.append("mainCategoryId", mainCategoryId.value);
      formData.append("name", name);
      formData.append("description", description);
      if (image) formData.append("image", image);

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin/update-sub-category`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showSuccessToast("Subcategory updated successfully");
      onUpdateSuccess();
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Failed to update subcategory"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} handler={handleOpen} size="md">
      <DialogHeader>Update Subcategory</DialogHeader>
      <DialogBody>
        <div className="space-y-4">
          <Select
            options={mainCategories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
            value={mainCategoryId}
            onChange={setMainCategoryId}
            placeholder="Select Main Category"
            isSearchable={true}
            className="basic-single"
          />
          <Input
            label="Subcategory Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded-lg"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md mx-auto"
              />
            )}
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={handleOpen}
          className="mr-1"
        >
          Cancel
        </Button>
        <Button
          variant="gradient"
          color="green"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <Spinner className="h-4 w-4" /> : "Update"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

const SubCategory = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [mainCategoryId, setMainCategoryId] = useState(null);
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const token = Cookies.get("token");

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    if (!token) return;
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/get-all-main-categories`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMainCategories(data.categories);
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Failed to fetch categories"
      );
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchSubCategories = useCallback(async () => {
    setLoading(true);
    if (!token) return;
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/get-all-sub-categories`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSubCategories(data.subCategories);
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Failed to fetch subcategories"
      );
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCategories();
      fetchSubCategories();
    }
  }, [token, fetchCategories, fetchSubCategories]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubCategorySubmit = async () => {
    if (!mainCategoryId) {
      showErrorToast("Please select a main category");
      return;
    }
    if (!subCategory) {
      showErrorToast("Subcategory name is required");
      return;
    }
    if (!image) {
      showErrorToast("Image is required");
      return;
    }

    setLoadingSubmit(true);
    try {
      const formData = new FormData();
      formData.append("mainCategoryId", mainCategoryId?.value);
      formData.append("name", subCategory);
      formData.append("description", description);
      if (image) formData.append("image", image);

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/add-sub-category`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showSuccessToast("Subcategory added successfully");

      fetchSubCategories();
      setMainCategoryId(null);
      setSubCategory("");
      setDescription("");
      setImage(null);
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Failed to add subcategory"
      );
      console.error("Error submitting subcategory:", error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleStatusToggle = async (id, status) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin/sub-category-status`,
        { id, status: status ? 1 : 0 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showSuccessToast("Subcategory status updated successfully");
      fetchSubCategories();
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Failed to update status"
      );
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subcategory?")) {
      return;
    }
    if (!token) {
      console.error("No token found. User may not be authenticated.");
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admin/delete-sub-category/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showSuccessToast("Subcategory deleted successfully");
      fetchSubCategories();
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Failed to delete subcategory"
      );
      console.error("Error deleting subcategory:", error);
    }
  };

  const columns = [
    {
      key: "sno",
      label: "S.No.",
      render: (row) =>
        subCategories.findIndex((item) => item.id === row.id) + 1,
    },
    {
      key: "imgUrl",
      label: "Image",
      render: (row) => (
        <img
          src={`${import.meta.env.VITE_BASE_URL_IMAGE}${row.imgUrl}`}
          alt="subcategory"
          className="w-16 h-16 object-cover rounded-md"
        />
      ),
    },
    {
      key: "main_category_name",
      label: "Main Category",
      render: (row) => row.mainCategoryId,
    },
    {
      key: "name",
      label: "Sub category",
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
            Add Subcategory
          </Typography>
          <CardBody className="space-y-4">
            <Select
              options={mainCategories.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
              value={mainCategoryId}
              onChange={setMainCategoryId}
              placeholder="Select Main Category"
              isSearchable={true}
              className="basic-single"
            />
            <Input
              label=" Enter Sub Category"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
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
              onClick={handleSubCategorySubmit}
              disabled={loadingSubmit}
              className="w-full">
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
            Subcategories
          </Typography>
          <CardBody>
            {loading ? (
              <div className="flex justify-center">
                <Spinner className="h-8 w-8 text-blue-500" />
              </div>
            ) : (
              <CustomTable columns={columns} data={subCategories} />
            )}
          </CardBody>
        </Card>
      </div>
      
      <UpdateSubCategoryModal
        open={editDialogOpen}
        handleOpen={() => setEditDialogOpen(false)}
        categoryData={selectedCategory}
        onUpdateSuccess={() => {
          setEditDialogOpen(false);
          fetchSubCategories();
        }}
      />
    </>
  );
};

export default SubCategory;