import {
  Button,
  Input,
  Textarea,
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
} from "@material-tailwind/react";
import Select from "react-select";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { showErrorToast, showSuccessToast } from "@/components/Toaster";

const UpdateBannerModal = ({ open, handleOpen, onSuccess, categories, subCategories, banner }) => {
  const token = Cookies.get("token");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [catId, setCatId] = useState(null);
  const [subCatId, setSubCatId] = useState(null);
  const [type, setType] = useState("home");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (banner) {
      setTitle(banner.title || "");
      setDescription(banner.description || "");
      setCatId({ value: banner.catId, label: getCategoryName(banner.catId) });
      setSubCatId({ value: banner.subCatId, label: getSubCategoryName(banner.subCatId) });
      setType(banner.type || "home");
    }
  }, [banner]);

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : "Unknown";
  };

  const getSubCategoryName = (id) => {
    const sub = subCategories.find((s) => s.id === id);
    return sub ? sub.name : "Unknown";
  };

  const handleSubmit = async () => {
    if (!title || !catId || !type) {
      showErrorToast("Please fill all required fields");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("catId", catId.value);
    formData.append("subCatId", subCatId?.value || "");
    formData.append("type", type);
    if (image) formData.append("image", image);

    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/update-banner/${banner.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      showSuccessToast("Banner updated successfully");
      onSuccess();
      handleOpen();
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to update banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} handler={handleOpen} size="md">
      <DialogHeader>Update Banner</DialogHeader>
      <DialogBody className="space-y-4">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Select
          options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
          value={catId}
          onChange={setCatId}
          placeholder="Select Category"
        />
        <Select
          options={subCategories.map((sub) => ({ value: sub.id, label: sub.name }))}
          value={subCatId}
          onChange={setSubCatId}
          placeholder="Select Subcategory"
        />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        <Input label="Type" value={type} onChange={(e) => setType(e.target.value)} />
        <div className="flex justify-between mt-4">
          <Button color="red" onClick={handleOpen}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Spinner className="h-4 w-4" /> : "Update"}
          </Button>
        </div>
      </DialogBody>
    </Dialog>
  );
};

UpdateBannerModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  subCategories: PropTypes.array.isRequired,
  banner: PropTypes.object.isRequired,
};

export default UpdateBannerModal;
