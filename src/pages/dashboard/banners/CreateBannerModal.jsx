import {
  Button,
  Card,
  CardBody,
  Input,
  Typography,
  Textarea,
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
} from "@material-tailwind/react";
import Select from "react-select";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import PropTypes from "prop-types";
import { showErrorToast, showSuccessToast } from "@/components/Toaster";

const CreateBannerModal = ({ open, handleOpen, onSuccess, categories, subCategories }) => {
  const token = Cookies.get("token");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [catId, setCatId] = useState(null);
  const [subCatId, setSubCatId] = useState(null);
  const [type, setType] = useState("home");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !catId || !subCatId || !image) {
      showErrorToast("Please fill all required fields");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("catId", catId.value);
    formData.append("subCatId", subCatId.value);
    formData.append("type", type);
    formData.append("image", image);

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/add-banner`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      showSuccessToast("Banner added successfully");
      onSuccess();
      handleOpen();
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to create banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} handler={handleOpen} size="md">
      <DialogHeader>Create Banner</DialogHeader>
      <DialogBody className="space-y-4">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Select
          options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
          onChange={setCatId}
          placeholder="Select Category"
        />
        <Select
          options={subCategories.map((sub) => ({ value: sub.id, label: sub.name }))}
          onChange={setSubCatId}
          placeholder="Select Subcategory"
        />
        <input type="file" name="image" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        <Input label="Type" value={type} onChange={(e) => setType(e.target.value)} />
        <div className="flex justify-between mt-4">
          <Button color="red" onClick={handleOpen}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Spinner className="h-4 w-4" /> : "Create"}
          </Button>
        </div>
      </DialogBody>
    </Dialog>
  );
};

CreateBannerModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired, // Fixed from onClose to handleOpen
  onSuccess: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  subCategories: PropTypes.array.isRequired,
};

export default CreateBannerModal;
