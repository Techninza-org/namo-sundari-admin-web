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
  // Select,
  // Option,
} from "@material-tailwind/react";
import axios from "axios";
import Cookies from "js-cookie";

import { TrashIcon } from "@heroicons/react/24/solid";

import CustomTable from "@/components/CustomTable";
import Toaster, {
  showErrorToast,
  showSuccessToast,
} from "@/components/Toaster";

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("1");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const token = Cookies.get("token");

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/get-all-banners`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBanners(data.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
      showErrorToast(
        error.response?.data?.message || "Failed to fetch banners"
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchBanners();
  }, [token, fetchBanners]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleBannerSubmit = async () => {
    if ( !image) {
      showErrorToast("Please select an image");
      return;
    }
    if (image.size > 2 * 1024 * 1024) {
      showErrorToast("Image size exceeds 2MB limit");
      return;
    }
    if (!["image/jpeg", "image/png", "image/gif"].includes(image.type)) {
      showErrorToast("Invalid image format. Only JPEG, PNG, and GIF are allowed.");
      return;
    }
    if (title.length > 50) {
      showErrorToast("Title exceeds 50 characters limit");
      return;
    }
    if (type.length > 1) {
      showErrorToast("Type should be a single character");
      return;
    }


    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("type", type);
      if (image) formData.append("image", image);

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/add-banner`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSuccessToast("Banner added successfully");
      setTitle("");
      setType("1");
      setImage(null);
      fetchBanners();
    } catch (error) {
      console.error("Error creating banner:", error);
      showErrorToast(error.response?.data?.message || "Failed to add banner");
    } finally {
      setSubmitting(false);
    }
  };
  const toggleStatus = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin/banner-status/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showSuccessToast("Banner status updated");
      fetchBanners(); // Refresh the list with correct status from backend
    } catch (error) {
      console.error("Error updating banner status:", error);
      showErrorToast(
        error.response?.data?.message || "Failed to update banner status"
      );
    }
  };


  const deleteBanner = async (id) => {
    console.log("Deleting banner with ID:", id);
    if (!window.confirm("Are you sure you want to delete this banner?")) {
      return;
    }

    try {

      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admin/delete-banner/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccessToast("Banner deleted successfully");
      fetchBanners(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting banner:", error);
      showErrorToast(
        error.response?.data?.message || "Failed to delete banner"
      );
    }
  };



  const columns = [
    {
      key: "image",
      label: "Image",
      render: (row) => (
        <img
          src={`${import.meta.env.VITE_BASE_URL_IMAGE}${row.image}`}
          alt="Banner"
          className="w-16 h-16 object-cover rounded-md"
        />
      ),
    },
    {
      key: "title",
      label: "Title",
      render: (row) => row.title,
    },
    {
      key: "type",
      label: "Type",
      render: (row) => `Type ${row.type}`,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Switch
          checked={row.status === 1}
          onChange={() => toggleStatus(row.id)}
        />
      ),
    },
    {
      key: "delete",
      label: "Delete",
      render: (row) => (

        <button  size="sm" onClick={() => deleteBanner(row.id)}>
        <TrashIcon className="h-5 w-5 text-red-500" />
      </button>
      

        
       
      ),
    }
  ];

  return (
    <>
      <Toaster />
      <div className="flex flex-col lg:flex-row gap-6 mt-10 px-4">
        {/* Form */}
        <Card className="p-4 w-full lg:w-1/3 shadow-lg">
          <Typography variant="h5" className="mb-4 text-center">
            Add Banner
          </Typography>
          <CardBody className="space-y-4">
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {/* <Select label="Type" value={type} onChange={(val) => setType(val)}>
              <Option value="1">Type 1</Option>
              <Option value="2">Type 2</Option>
              <Option value="3">Type 3</Option>
            </Select> */}
            <input type="file" accept="image/*" onChange={handleImageChange} />
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
              onClick={handleBannerSubmit}
              disabled={submitting}
              className="w-full"
            >
              {submitting ? <Spinner className="h-5 w-5" /> : "Add Banner"}
            </Button>
          </CardFooter>
        </Card>

        {/* Table */}
        <Card className="w-full lg:w-2/3 shadow-lg">
          <Typography variant="h5" className="mb-4 text-center">
            Banners
          </Typography>
          <CardBody>
            {loading ? (
              <div className="flex justify-center">
                <Spinner className="h-8 w-8 text-blue-500" />
              </div>
            ) : (
              <CustomTable columns={columns} data={banners} />
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default BannerManager;
