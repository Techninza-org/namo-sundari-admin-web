import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import CreateBannerModal from "./CreateBannerModal";
import CustomTable from "../../../components/CustomTable";
import {
  Button,
  Card,
  CardBody,
  Typography,
  Spinner,
  Switch,
} from "@material-tailwind/react";
import Toaster, {
  showErrorToast,
  showSuccessToast,
} from "@/components/Toaster";
import { Eye, TrashIcon } from "lucide-react";
import UpdateBannerModal from "./UpdateBannerModal";

const BannerPage = () => {
  const token = Cookies.get("token");
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const handleCreateOpen = () => setCreateOpen(!createOpen);
  const handleUpdateOpen = (banner) => {
    setSelectedBanner(banner);
    setUpdateOpen(true);
  };

  const fetchBanners = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/get-all-banners`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Add index to each banner item
      setBanners(
        data.data.map((item, index) => ({
          ...item,
          index: index + 1,
        }))
      );
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Failed to fetch banners"
      );
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchCategories = async () => {
    try {
      const [mainRes, subRes] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/get-all-main-categories`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/get-all-sub-categories`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
      ]);
      setCategories(mainRes.data.categories);
      setSubCategories(subRes.data.subCategories);
    } catch (error) {
      showErrorToast("Failed to fetch categories or subcategories");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBanners();
  }, []);

  const handleBannerStatusToggle = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin/update-banner/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showSuccessToast("Banner status updated successfully");
      fetchBanners();
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Failed to update banner status"
      );
      console.error("Error updating banner status:", error);
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
      fetchBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
      showErrorToast(
        error.response?.data?.message || "Failed to delete banner"
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
          alt="banner"
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
      key: "description",
      label: "Description",
      render: (row) => row.description,
    },
    {
      key: "type",
      label: "Type",
      render: (row) => row.type,
    },
    {
      key: "edit",
      label: "Edit",
      render: (row) => (
        <button onClick={() => handleUpdateOpen(row)}>
          <Eye className="h-5 w-5 text-blue-500" />
        </button>
      ),
    },
    {
      key: "delete",
      label: "Delete",
      render: (row) => (
        <button size="sm" onClick={() => deleteBanner(row.id)}>
          <TrashIcon className="h-5 w-5 text-red-500" />
        </button>
      ),
    },
  ];

  return (
    <>
      <Toaster />
      <div className="p-4">
        <div className="flex justify-between mb-4">
          <Typography variant="h5">Banners</Typography>
          <Button onClick={handleCreateOpen}>Add Banner</Button>
        </div>
        <Card>
          <CardBody>
            {loading ? (
              <div className="flex justify-center">
                <Spinner className="h-6 w-6" />
              </div>
            ) : (
              <CustomTable columns={columns} data={banners} />
            )}
          </CardBody>
        </Card>
      </div>

      <CreateBannerModal
        open={createOpen}
        handleOpen={handleCreateOpen}
        onSuccess={fetchBanners}
        categories={categories}
        subCategories={subCategories}
      />

      <UpdateBannerModal
        open={updateOpen}
        handleOpen={() => setUpdateOpen(false)}
        onSuccess={fetchBanners}
        categories={categories}
        subCategories={subCategories}
        banner={selectedBanner}
      />
    </>
  );
};

export default BannerPage;
